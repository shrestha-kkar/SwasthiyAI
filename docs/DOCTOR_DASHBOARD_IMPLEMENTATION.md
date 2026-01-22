# Doctor Dashboard Implementation Guide

## Overview

The Doctor Dashboard is a comprehensive feature that allows doctors to:
- View their scheduled and completed patient visits
- Access AI-generated medical summaries from patient intake forms
- Add diagnoses and clinical notes for each patient visit
- Manage patient medical records efficiently

## Architecture

### Components

#### 1. **PatientCard Component** (`src/components/PatientCard.tsx`)
Interactive card component displaying patient information with integrated diagnosis form.

**Features:**
- Patient information display (name, email, appointment reason, time)
- AI-generated medical summary from patient intake
- Collapsible diagnosis and notes form
- Form validation with error display
- Success feedback on save

**Props:**
```typescript
interface PatientCardProps {
  visitId: string;
  patientName: string;
  patientEmail: string;
  reason: string;
  scheduledDate: string;
  patientIntake?: { /* AI-generated data */ };
  existingNotes?: { /* Previously saved notes */ };
  onSubmitNotes: (data: DoctorNoteInput) => Promise<void>;
  isLoading?: boolean;
  isEditing?: boolean;
}
```

### Pages

#### 2. **Doctor Dashboard** (`src/app/(dashboard)/doctor/page.tsx`)
Main dashboard showing overview and statistics.

**Features:**
- Dashboard statistics (scheduled, completed, total visits)
- Visit filtering by status (SCHEDULED, COMPLETED, ALL)
- List of patient cards with AI summaries
- Real-time data fetching
- Error handling and loading states

#### 3. **Doctor Appointments** (`src/app/(dashboard)/doctor/appointments/page.tsx`)
Dedicated page for upcoming appointments.

**Features:**
- Filtered view of scheduled appointments
- Enhanced UI for appointment management
- Quick access to patient information

### API Routes

#### 4. **GET /api/doctor/visits**
Fetches doctor's patient visits with optional filtering.

**Query Parameters:**
- `status`: Filter by visit status (SCHEDULED, COMPLETED, CANCELLED, NO_SHOW)
- `limit`: Number of results (default: 20, max: 100)
- `offset`: Pagination offset (default: 0)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "visit-id",
      "patientId": "patient-id",
      "reason": "Chief complaint",
      "scheduledDate": "2026-01-25T10:00:00Z",
      "status": "SCHEDULED",
      "patient": {
        "user": {
          "id": "user-id",
          "name": "Patient Name",
          "email": "patient@example.com"
        }
      },
      "doctorNotes": [],
      "patientIntake": {
        "currentSymptoms": ["symptom1", "symptom2"],
        "symptomDuration": "3 days",
        "symptomSeverity": "moderate",
        "medicalHistory": [],
        "allergies": []
      }
    }
  ],
  "pagination": {
    "total": 10,
    "limit": 20,
    "offset": 0,
    "hasMore": false
  }
}
```

**Authentication:** Required (JWT token)
**Authorization:** Doctor role required

#### 5. **POST /api/doctor/notes**
Creates or updates doctor notes and diagnosis for a visit.

**Request Body:**
```typescript
{
  visitId: "visit-id",           // Required
  symptoms: "symptom description", // Required, min 10 chars
  diagnosis: "diagnosis text",      // Required, min 5 chars
  prescription?: "medication info",  // Optional
  observations: "clinical findings", // Required, min 10 chars
  recommendations?: "follow-up",     // Optional
  vitals?: {
    bloodPressure?: "120/80",
    temperature?: 98.6,
    pulse?: 72,
    respiration?: 16
  }
}
```

**Response:**
```json
{
  "success": true,
  "message": "Doctor notes saved successfully",
  "data": {
    "id": "note-id",
    "visitId": "visit-id",
    "doctorId": "doctor-id",
    "symptoms": "...",
    "diagnosis": "...",
    "observations": "...",
    "createdAt": "2026-01-25T10:30:00Z",
    "updatedAt": "2026-01-25T10:30:00Z"
  }
}
```

**Features:**
- Validates input using Zod schemas
- Creates new notes or updates existing ones
- Marks visit as COMPLETED when notes are saved
- Stores vital signs in JSON format

**Authentication:** Required (JWT token)
**Authorization:** Doctor role required

### Validation Schemas

#### 6. **Doctor Schemas** (`src/lib/doctor-schema.ts`)

**DoctorNoteSchema:**
```typescript
z.object({
  visitId: z.string().cuid(),
  symptoms: z.string().min(10).max(1000),
  diagnosis: z.string().min(5).max(500),
  prescription: z.string().optional(),
  observations: z.string().min(10).max(2000),
  recommendations: z.string().optional(),
  vitals: z.object({
    bloodPressure?: z.string(),
    temperature?: z.number(),
    pulse?: z.number(),
    respiration?: z.number()
  }).optional()
})
```

**DoctorVisitFilterSchema:**
```typescript
z.object({
  status: z.enum(['SCHEDULED', 'COMPLETED', 'CANCELLED', 'NO_SHOW']).optional(),
  limit: z.number().int().min(1).max(100).default(20),
  offset: z.number().int().min(0).default(0)
})
```

## Database Schema Integration

### Related Models

```prisma
// Doctor Profile
model DoctorProfile {
  id: String @id @default(cuid())
  userId: String @unique
  user: User @relation(...)
  visits: Visit[] @relation("DoctorVisits")
  doctorNotes: DoctorNote[]
}

// Visit Model
model Visit {
  id: String @id @default(cuid())
  patientId: String
  doctorId: String
  reason: String
  scheduledDate: DateTime
  status: VisitStatus // SCHEDULED, COMPLETED, etc.
  doctorNotes: DoctorNote[]
}

// Doctor Notes Model
model DoctorNote {
  id: String @id @default(cuid())
  visitId: String
  doctorId: String
  symptoms: String
  diagnosis: String?
  observations: String
  recommendations: String?
  vitals: String? // JSON
  createdAt: DateTime
  updatedAt: DateTime
}

// Patient Intake (AI-Generated Summary)
model PatientIntake {
  id: String @id @default(cuid())
  patientId: String
  structuredData: String? // JSON with symptoms, medical history, etc.
  isComplete: Boolean
  isReviewedByDoc: Boolean
}
```

## User Flows

### 1. Doctor Login Flow
```
Login Page
  ↓
/api/auth/login (verify credentials)
  ↓
Middleware (check token)
  ↓
Doctor Dashboard (/dashboard/doctor)
```

### 2. Viewing Patient Visits
```
Doctor Dashboard Loads
  ↓
GET /api/doctor/visits (fetch doctor's visits)
  ↓
Fetch PatientIntake for each visit
  ↓
Display PatientCard components
```

### 3. Adding Diagnosis & Notes
```
Click "Add Diagnosis & Notes"
  ↓
Form opens in PatientCard
  ↓
Fill in symptoms, diagnosis, observations
  ↓
Click "Save Notes"
  ↓
POST /api/doctor/notes (validation & save)
  ↓
Update visit status to COMPLETED
  ↓
Refresh visit list
  ↓
Show success feedback
```

## Error Handling

### API Errors

```typescript
// 401 Unauthorized - No token
{ message: "Unauthorized: No token provided" }

// 401 Unauthorized - Invalid token
{ message: "Unauthorized: Invalid token" }

// 403 Forbidden - Wrong role
{ message: "Forbidden: Only doctors can access this resource" }

// 404 Not Found
{ message: "Visit not found" }

// 400 Bad Request - Validation failed
{ message: "Validation failed", errors: "..." }

// 500 Internal Server Error
{ message: "Internal server error" }
```

### Client-Side Handling
All components include:
- Error state display with user-friendly messages
- Loading states during async operations
- Form validation before submission
- Success feedback on completion

## Security Considerations

### Authentication & Authorization
- JWT token validation on all endpoints
- Role-based access control (DOCTOR role required)
- Doctor can only access their own visits
- Visit ownership verified before allowing note creation

### Data Validation
- Input validation using Zod schemas
- Maximum field lengths enforced
- CUID validation for IDs
- Enum validation for status values

### Privacy
- Doctor notes only visible to assigned doctor
- Patient data encrypted in database
- API endpoints require authentication
- HTTPS enforced in production (Vercel)

## Testing Scenarios

### Happy Path
1. Login as doctor (email: doctor@example.com, password: password123)
2. View scheduled visits on dashboard
3. See AI-generated patient summaries
4. Click "Add Diagnosis & Notes"
5. Fill in form fields
6. Submit and see success message
7. Verify notes display in green success card

### Edge Cases
- Doctor tries to access another doctor's patient → 403 Forbidden
- Invalid form input → Validation error displayed
- Network error during save → Error message shown
- Visiting completed patient → Shows existing notes with edit option

## Performance Optimization

### Data Fetching
- Pagination limit: max 100 visits per request
- Only fetch necessary patient fields
- Cache patient intake data
- Index database queries on visitId, doctorId, status, scheduledDate

### Component Optimization
- PatientCard uses React.memo (optional enhancement)
- Form state kept at component level
- Lazy load form only when needed
- Debounce API calls if needed

## Future Enhancements

1. **Advanced Filtering**
   - Filter by patient name
   - Date range filtering
   - Search by diagnosis

2. **Bulk Operations**
   - Bulk status updates
   - Batch export notes

3. **Analytics**
   - Visit statistics
   - Diagnosis trends
   - Patient outcomes tracking

4. **Integration**
   - Email notifications for new visits
   - Print medical reports
   - Export to external systems

5. **Enhanced Features**
   - Voice-to-text for notes
   - Template-based diagnosis suggestions
   - Drug interaction checker for prescriptions

## Troubleshooting

### Issue: "Unauthorized" Error on Page Load
**Cause:** User is not logged in or token expired
**Solution:** Redirect to login page (middleware handles this)

### Issue: No Visits Showing
**Cause:** Doctor has no scheduled visits or API call failed
**Solution:** Check browser console, verify database has visits assigned to doctor

### Issue: Form Submission Fails
**Cause:** Validation errors or API error
**Solution:** Check error message displayed, ensure all required fields filled

### Issue: Patient Intake Data Not Showing
**Cause:** Patient hasn't completed intake form
**Solution:** Display fallback message, show appointment info from Visit model

## API Response Examples

### Successful Visit Fetch
```bash
curl -H "Cookie: auth_token=<jwt>" \
  "http://localhost:3000/api/doctor/visits?status=SCHEDULED&limit=10"

# Response 200 OK
{
  "success": true,
  "data": [...],
  "pagination": {...}
}
```

### Successful Note Submission
```bash
curl -X POST \
  -H "Cookie: auth_token=<jwt>" \
  -H "Content-Type: application/json" \
  -d '{
    "visitId": "...",
    "symptoms": "Patient reports chest pain...",
    "diagnosis": "Angina",
    "observations": "Vitals elevated...",
    "recommendations": "Refer to cardiology"
  }' \
  "http://localhost:3000/api/doctor/notes"

# Response 201 Created
{
  "success": true,
  "message": "Doctor notes saved successfully",
  "data": {...}
}
```

## Deployment Considerations

- All API endpoints protected by JWT authentication
- Database connections pooled for serverless (Vercel)
- Error logs captured for debugging
- Sensitive data not logged (passwords, tokens)
- CORS properly configured
- Rate limiting recommended for production

---

**Implementation Date**: January 22, 2026
**Version**: 1.0
**Status**: Production Ready
