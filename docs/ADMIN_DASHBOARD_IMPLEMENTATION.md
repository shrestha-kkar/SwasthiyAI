# Admin Dashboard Implementation Guide

## Overview

The hospital admin dashboard provides administrators with comprehensive visibility into hospital operations, patient statistics, and doctor workload distribution. This is a read-only analytics interface designed for hospital management and operational oversight.

**Key Features:**
- Real-time today's patient statistics
- Doctor-wise patient distribution analysis
- Hospital-wide metrics and overview
- Read-only access control (admin role required)
- JWT authentication and authorization

---

## Architecture Overview

### Component Hierarchy

```
AdminPage (Main Dashboard)
├── Header & Controls
│   ├── Title & Description
│   └── Refresh Button
├── Today's Statistics Section
│   ├── StatsCard (Total Visits)
│   ├── StatsCard (Total Patients)
│   ├── StatsCard (Scheduled)
│   ├── StatsCard (Completed)
│   └── StatsCard (No Shows)
├── Hospital Overview Section
│   ├── StatsCard (Total Doctors)
│   ├── StatsCard (Total Patients)
│   ├── StatsCard (Total Visits)
│   └── StatsCard (Avg. Patients/Doctor)
└── DoctorPatientTable (Doctor Distribution)
```

### Data Flow

```
AdminPage (State Management)
    ↓
fetch /api/admin/today-patients → TodayStats
fetch /api/admin/doctor-wise-count → DoctorWiseData
    ↓
StatsCards (Display) & DoctorPatientTable (Render)
    ↓
User Views Read-Only Dashboard
```

---

## Component Details

### AdminPage.tsx

**Location:** `src/app/(dashboard)/admin/page.tsx`

**Responsibilities:**
- Authentication verification (admin role check)
- Data fetching from two API endpoints
- State management for statistics and doctor data
- Error handling and loading states
- Manual refresh functionality

**Key State Variables:**
```typescript
todayStats: TodayStats | null                    // Today's patient metrics
doctorWiseData: DoctorWiseData | null            // All doctors with patient counts
isLoading: boolean                               // Loading state
error: string | null                             // Error messages
lastRefresh: string                              // Last refresh timestamp
```

**Key Functions:**
```typescript
fetchData()  // Calls both API endpoints and updates state
```

**Flow:**
1. Component mounts → Check if user is admin
2. If not admin → Redirect to /dashboard
3. If admin → Fetch data from both API endpoints
4. Display statistics in StatsCards and table
5. User can click "Refresh Data" to fetch latest

---

### StatsCard.tsx

**Location:** `src/components/StatsCard.tsx`

**Props:**
```typescript
interface StatsCardProps {
  title: string                    // Card title (e.g., "Total Patients")
  value: number | string           // Main statistic value
  description?: string             // Optional additional info
  icon?: React.ReactNode           // Optional emoji icon
  variant?: 'default' | 'success' | 'warning' | 'info'  // Color variant
}
```

**Variants:**
- `default`: Blue border (metrics)
- `success`: Green border (positive metrics)
- `warning`: Yellow border (warnings/pending)
- `info`: Purple border (secondary metrics)

**Example Usage:**
```tsx
<StatsCard
  title="Total Patients"
  value={todayStats.totalPatients}
  variant="info"
  icon="👥"
/>
```

---

### DoctorPatientTable.tsx

**Location:** `src/components/DoctorPatientTable.tsx`

**Props:**
```typescript
interface DoctorPatientTableProps {
  doctors: DoctorStat[]           // Array of doctor statistics
  isLoading: boolean              // Loading state
}

interface DoctorStat {
  doctorId: string                // Doctor's unique ID
  doctorName: string              // Doctor's full name
  specialization: string          // Medical specialty
  totalPatients: number           // Unique patient count
  scheduledVisits: number         // Upcoming visits
  completedVisits: number         // Finished visits
  noShowVisits: number            // Missed appointments
}
```

**Features:**
- Responsive table with horizontal scrolling on mobile
- Alternating row colors for readability
- Color-coded status badges
- Sorted by total patients (descending)
- Empty state handling

**Column Details:**
| Column | Type | Description |
|--------|------|-------------|
| Doctor Name | Text | Full name with bold font weight |
| Specialization | Badge | Medical specialty in blue badge |
| Total Patients | Number | Count of unique patients |
| Scheduled | Badge | Yellow badge for upcoming visits |
| Completed | Badge | Green badge for finished visits |
| No Show | Badge | Red badge for missed appointments |

---

## API Routes

### GET /api/admin/today-patients

**Purpose:** Fetch today's patient statistics

**Authentication:** Required (JWT token in cookies)
**Authorization:** Admin role required

**Query Parameters:** None

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "totalVisits": 15,
    "totalPatients": 12,
    "completedVisits": 8,
    "scheduledVisits": 5,
    "noShowVisits": 2,
    "timestamp": "2026-01-22T10:30:45.123Z"
  }
}
```

**Response (401 Unauthorized):**
```json
{
  "message": "Unauthorized"
}
```

**Response (403 Forbidden):**
```json
{
  "message": "Forbidden: Admin access required"
}
```

**Response (500 Server Error):**
```json
{
  "message": "Internal server error",
  "error": "Error details"
}
```

**Database Query:**
```sql
-- Fetch all visits for today
SELECT v.* FROM visits v
WHERE v.scheduled_date >= TODAY()
  AND v.scheduled_date < TODAY() + INTERVAL 1 DAY
  AND v.status IN ('SCHEDULED', 'COMPLETED', 'NO_SHOW')

-- Count unique patients
SELECT COUNT(DISTINCT patient_id) FROM visits
WHERE scheduled_date >= TODAY()
  AND scheduled_date < TODAY() + INTERVAL 1 DAY
```

**Implementation File:** `src/app/api/admin/today-patients/route.ts`

---

### GET /api/admin/doctor-wise-count

**Purpose:** Fetch aggregated patient count by doctor

**Authentication:** Required (JWT token in cookies)
**Authorization:** Admin role required

**Query Parameters:** None

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "doctorStats": [
      {
        "doctorId": "doc_123",
        "doctorName": "Dr. John Smith",
        "specialization": "Cardiology",
        "totalPatients": 45,
        "scheduledVisits": 8,
        "completedVisits": 120,
        "noShowVisits": 3
      },
      {
        "doctorId": "doc_456",
        "doctorName": "Dr. Sarah Johnson",
        "specialization": "Pediatrics",
        "totalPatients": 38,
        "scheduledVisits": 5,
        "completedVisits": 95,
        "noShowVisits": 2
      }
    ],
    "summary": {
      "totalDoctors": 10,
      "totalPatients": 250,
      "totalVisits": 1050,
      "averagePatientsPerDoctor": "25.00"
    },
    "timestamp": "2026-01-22T10:30:45.123Z"
  }
}
```

**Response Codes:**
- `200 OK`: Successfully fetched data
- `401 Unauthorized`: Missing or invalid token
- `403 Forbidden`: Non-admin user
- `500 Server Error`: Database or processing error

**Database Queries:**
```sql
-- Fetch all doctors with their visits
SELECT d.*, u.name
FROM doctor_profiles d
JOIN users u ON d.user_id = u.id
LEFT JOIN visits v ON d.id = v.doctor_id

-- Count unique patients per doctor
SELECT d.id, COUNT(DISTINCT v.patient_id)
FROM doctor_profiles d
LEFT JOIN visits v ON d.id = v.doctor_id
GROUP BY d.id

-- Aggregate visit status counts
SELECT doctor_id, status, COUNT(*) as count
FROM visits
GROUP BY doctor_id, status
```

**Implementation File:** `src/app/api/admin/doctor-wise-count/route.ts`

---

## Security & Access Control

### Authentication Flow

```
1. User Login → JWT token created (stored in HTTP-only cookie)
2. Admin Dashboard Access → Verify user has "admin" role
3. API Request → Validate JWT in cookie
4. Authorization Check → Verify role is "admin" or "ADMIN"
5. Data Access → Fetch and aggregate data (read-only)
```

### Authorization Checks

**Frontend:**
```typescript
if (user?.role !== "admin") {
  router.push("/dashboard");
}
```

**Backend (Both APIs):**
```typescript
if (decoded.role !== "admin" && decoded.role !== "ADMIN") {
  return NextResponse.json(
    { message: "Forbidden: Admin access required" },
    { status: 403 }
  );
}
```

### Token Verification

```typescript
const token = request.cookies.get("auth_token")?.value;
if (!token) {
  return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
}

const verified = await jwtVerify(token, SECRET);
const decoded = verified.payload as { userId: string; role: string };
```

---

## Data Models & Schema

### Visit Model
```prisma
model Visit {
  id              String
  patientId       String
  patient         PatientProfile
  doctorId        String
  doctor          DoctorProfile
  hospitalId      String
  status          VisitStatus    // SCHEDULED, COMPLETED, CANCELLED, NO_SHOW
  scheduledDate   DateTime
  scheduledTime   DateTime
  completedAt     DateTime?
  reason          String
  createdAt       DateTime
}
```

### DoctorProfile Model
```prisma
model DoctorProfile {
  id              String
  userId          String
  user            User
  hospitalId      String
  specialization  String
  visits          Visit[]        // One-to-many
  doctorNotes     DoctorNote[]
  createdAt       DateTime
}
```

### Aggregation Queries

**Today's Patient Count:**
- Groups visits by date (today only)
- Filters by status (SCHEDULED, COMPLETED, NO_SHOW)
- Counts unique patients (deduplication)
- Counts visits by status

**Doctor-Wise Distribution:**
- Joins doctorProfile with visits
- Groups by doctor
- Counts unique patients per doctor
- Counts visits per status per doctor
- Calculates averages across hospital

---

## Error Handling

### Client-Side Errors

```typescript
try {
  const response = await fetch("/api/admin/today-patients", { ... });
  
  if (!response.ok) {
    throw new Error(`Failed: ${response.statusText}`);
  }
  
  const data = await response.json();
  setTodayStats(data.data);
} catch (err) {
  const errorMessage = err instanceof Error ? err.message : "Unknown error";
  setError(errorMessage);
}
```

### Server-Side Errors

```typescript
try {
  // Database operations
  const visits = await prisma.visit.findMany({ ... });
  
  // Validation & aggregation
  const stats = calculateStats(visits);
  
  return NextResponse.json({ success: true, data: stats });
} catch (error) {
  console.error("Error:", error);
  return NextResponse.json(
    { message: "Internal server error", error: String(error) },
    { status: 500 }
  );
}
```

### Common Error Scenarios

| Scenario | Status | Message |
|----------|--------|---------|
| Missing auth token | 401 | Unauthorized |
| Invalid/expired JWT | 401 | Invalid or expired token |
| Non-admin user | 403 | Forbidden: Admin access required |
| Database failure | 500 | Internal server error |
| Network error | Network | Browser handling |

---

## User Flows

### View Dashboard Statistics

```
1. Admin user navigates to /dashboard/admin
2. Page loads & verifies admin role
3. Component fetches both API endpoints in parallel
4. StatsCards render with today's metrics
5. Hospital overview cards appear
6. Doctor table populates and sorts by patient count
7. Last refresh timestamp displays
8. Dashboard ready for interaction
```

### Refresh Data

```
1. User clicks "Refresh Data" button
2. Button becomes disabled, shows "Refreshing..."
3. Both API endpoints re-fetch latest data
4. State updates with new data
5. Last refresh timestamp updates
6. Button re-enables
7. User sees latest statistics
```

### View Doctor Details

```
1. Admin views doctor row in table
2. Can see:
   - Doctor name and specialization
   - Total unique patients assigned
   - Breakdown of visit statuses
   - Comparison to other doctors
3. Can sort by clicking column headers (future enhancement)
4. Understands workload distribution
```

---

## Performance Optimization

### Query Optimization

**Today's Patients:**
- Uses indexed `scheduledDate` field (fast date filtering)
- Filters by `status` enum (indexed field)
- Only selects needed fields
- Database handles DISTINCT deduplication

**Doctor-Wise Count:**
- Uses indexed `doctorId` field
- Batch fetches all doctors with single query
- Includes visits relationship for aggregation
- In-memory deduplication (Set) for unique patient IDs

### Caching Opportunities

**Current:** Real-time, always fresh
**Future Enhancements:**
- Cache doctor stats for 5-10 minutes
- Cache today's statistics for 2-5 minutes
- Invalidate cache on Visit creation/update
- Implement Redis for distributed caching

### Pagination Opportunities

**Current:** Loads all doctors
**Future Enhancements:**
- Paginate doctor table (20 per page)
- Add filtering by specialization
- Add sorting by different columns
- Lazy-load additional data

---

## Testing Scenarios

### 1. Admin Access Verification

**Setup:** Multiple user roles (admin, doctor, patient)

**Test:**
```
1. Try accessing /dashboard/admin as admin → ✓ Allowed
2. Try accessing /dashboard/admin as doctor → ✓ Redirected to /dashboard
3. Try accessing /dashboard/admin as patient → ✓ Redirected to /dashboard
```

**Expected:** Admin only sees dashboard, others redirected

---

### 2. Today's Statistics Calculation

**Setup:** Create multiple visits for today with different statuses

**Test:**
```
1. Create 10 SCHEDULED visits for today
2. Create 5 COMPLETED visits for today
3. Create 2 NO_SHOW visits for today
4. Create 3 SCHEDULED visits for tomorrow
5. Fetch /api/admin/today-patients
```

**Expected:**
```json
{
  "totalVisits": 17,           // 10+5+2
  "totalPatients": <unique>,   // Count unique patient IDs
  "scheduledVisits": 10,
  "completedVisits": 5,
  "noShowVisits": 2
}
```

**Note:** Tomorrow's visits excluded

---

### 3. Doctor-Wise Distribution

**Setup:** Create 3 doctors with different patient loads

**Test:**
```
1. Dr. A: 5 unique patients, 3 scheduled, 15 completed, 1 no-show
2. Dr. B: 8 unique patients, 2 scheduled, 12 completed, 0 no-show
3. Dr. C: 3 unique patients, 1 scheduled, 8 completed, 2 no-show
4. Fetch /api/admin/doctor-wise-count
```

**Expected:**
- Sorted by total patients: Dr. B (8), Dr. A (5), Dr. C (3)
- Summary: 3 doctors, 16 total patients, 50 total visits
- Average: 5.33 patients per doctor

---

### 4. Authentication & Authorization

**Test 1: Missing Token**
```
curl http://localhost:3000/api/admin/today-patients
Expected: 401 Unauthorized
```

**Test 2: Invalid Token**
```
curl -H "Cookie: auth_token=invalid" http://localhost:3000/api/admin/today-patients
Expected: 401 Invalid or expired token
```

**Test 3: Non-Admin Token**
```
curl -H "Cookie: auth_token=doctor_token" http://localhost:3000/api/admin/today-patients
Expected: 403 Forbidden: Admin access required
```

---

### 5. Loading & Error States

**Test: Network Error**
```
1. Block network request to /api/admin/today-patients
2. Click "Refresh Data"
3. Observe error message
Expected: Error message displayed, button re-enables
```

**Test: Slow Response**
```
1. Simulate 3-second API response delay
2. Click "Refresh Data"
3. Observe loading state
Expected: "Refreshing..." button disabled, then re-enables
```

---

## Deployment Checklist

- [ ] Verify admin user exists in database
- [ ] Test JWT token generation and validation
- [ ] Verify all API routes are accessible
- [ ] Test authentication flow for non-admin users
- [ ] Load test with multiple concurrent admin users
- [ ] Verify database indexes on scheduledDate, doctorId, status
- [ ] Configure appropriate database query timeouts
- [ ] Set up monitoring for API response times
- [ ] Test error handling and edge cases
- [ ] Verify UI responsive design on mobile
- [ ] Document admin access process for hospital IT
- [ ] Create backup/recovery plan for stats queries

---

## Future Enhancements

### Feature Ideas

1. **Advanced Filtering**
   - Filter doctor stats by specialization
   - Filter by date range (not just today)
   - Search by doctor name

2. **Enhanced Reporting**
   - Export statistics to CSV/PDF
   - Schedule automated reports
   - Email digest summaries

3. **Performance Metrics**
   - Doctor performance scores
   - Patient satisfaction metrics
   - Visit duration analytics
   - No-show rate trends

4. **Real-time Updates**
   - WebSocket connection for live updates
   - Push notifications for milestones
   - Activity feed of recent visits

5. **Customizable Dashboard**
   - Save dashboard layout preferences
   - Custom metric selection
   - Configurable update intervals

6. **Analytics & Insights**
   - Trend analysis over time
   - Predictive capacity planning
   - Doctor workload balancing recommendations
   - Peak hour identification

---

## Troubleshooting

### Issue: "Forbidden: Admin access required"

**Cause:** User doesn't have admin role

**Solution:**
1. Verify user role in database: `SELECT role FROM users WHERE email='admin@hospital.com';`
2. Update if needed: `UPDATE users SET role='admin' WHERE id='user_id';`
3. Clear browser cookies and re-login

---

### Issue: Data showing 0 values

**Cause:** No visits in database or date mismatch

**Solution:**
1. Check visits exist: `SELECT COUNT(*) FROM visits;`
2. Verify today's date filter: `SELECT COUNT(*) FROM visits WHERE scheduled_date >= TODAY();`
3. Seed test data if needed: `npm run prisma:seed`

---

### Issue: API returning 500 error

**Cause:** Database connection or query error

**Solution:**
1. Check database connection: `DATABASE_URL` in `.env.local`
2. Verify Prisma client: `npx prisma generate`
3. Check database indexes exist
4. Review server logs for specific error

---

### Issue: Table not displaying doctors

**Cause:** Doctor data not being fetched or rendered

**Solution:**
1. Check doctor profiles exist: `SELECT COUNT(*) FROM doctor_profiles;`
2. Verify API response in browser DevTools Network tab
3. Check `doctorStats` array is populated in state
4. Verify component receives props correctly

---

## Additional Resources

- [Prisma Documentation](https://www.prisma.io/docs/)
- [Next.js API Routes](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)
- [JWT Authentication](https://jwt.io/introduction)
- [React Hooks Documentation](https://react.dev/reference/react)
- [Tailwind CSS Classes](https://tailwindcss.com/docs)

---

**Last Updated:** January 22, 2026
**Version:** 1.0
**Status:** Production Ready
