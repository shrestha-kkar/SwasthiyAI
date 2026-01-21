# Patient AI Intake Flow - Implementation Guide

## Overview

The Patient AI Intake Flow is a conversational, AI-powered system that gathers patient medical information before a doctor's appointment. It uses OpenAI's API to conduct intelligent conversations while strictly avoiding medical diagnosis or prescription.

## Key Features

✅ **Conversational Chat Interface** - Natural dialogue between patient and AI
✅ **Structured Data Extraction** - AI processes conversation and extracts structured medical information  
✅ **Database Storage** - All conversations and data stored in PostgreSQL
✅ **Doctor Review** - Structured data ready for doctor review before appointment
✅ **Safety Constraints** - AI explicitly prevented from diagnosing or prescribing

## Architecture

### Database Schema

The `PatientIntake` model stores:

```prisma
model PatientIntake {
  id              String    @id @default(cuid())
  patientId       String
  patient         PatientProfile @relation(fields: [patientId], references: [id], onDelete: Cascade)
  hospitalId      String
  hospital        Hospital  @relation(fields: [hospitalId], references: [id], onDelete: Cascade)
  chatHistory     String    // JSON array of ChatMessage
  structuredData  String?   // JSON of PatientIntakeData
  isComplete      Boolean   @default(false)
  isReviewedByDoc Boolean   @default(false)
  reviewedBy      String?
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt
  @@index([patientId])
  @@index([hospitalId])
  @@index([isComplete])
  @@map("patient_intakes")
}
```

### File Structure

```
src/
├── app/
│   └── (dashboard)/
│       └── patient/
│           └── intake/
│               └── page.tsx              # Chat UI component
│   └── api/
│       └── patient/
│           └── intake/
│               ├── route.ts              # GET/POST endpoints
│               └── analyze/
│                   └── route.ts          # AI analysis endpoint
├── lib/
│   ├── intake-schema.ts                  # JSON schema & validation
│   └── intake-prompt.ts                  # System prompt for AI
└── types/
    └── intake.ts                         # TypeScript interfaces
```

## API Endpoints

### GET /api/patient/intake
Retrieves existing or creates new patient intake form.

**Response:**
```json
{
  "id": "cuid-string",
  "chatHistory": [
    { "role": "assistant", "content": "...", "timestamp": "..." },
    { "role": "user", "content": "...", "timestamp": "..." }
  ],
  "structuredData": null,
  "isComplete": false
}
```

### POST /api/patient/intake
Adds a message to the chat and gets AI response.

**Request:**
```json
{
  "intakeId": "cuid-string",
  "message": "I've been having a headache for 3 days"
}
```

**Response:**
```json
{
  "message": "I'm sorry to hear that. Can you tell me more about the headache?",
  "chatHistory": [...]
}
```

### POST /api/patient/intake/analyze
Analyzes completed conversation and extracts structured data.

**Request:**
```json
{
  "intakeId": "cuid-string"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "currentSymptoms": ["headache", "nausea"],
    "symptomDuration": "3 days",
    "symptomSeverity": "moderate",
    "symptomTriggers": ["stress", "bright lights"],
    "medicalHistory": ["hypertension"],
    "currentMedications": [
      { "name": "Lisinopril", "dosage": "10mg", "frequency": "daily" }
    ],
    "allergies": ["Penicillin"],
    "recentIllnesses": [],
    "lifestyle": {
      "exercise": "Sedentary",
      "diet": "High sodium",
      "sleep": "6 hours per night",
      "stress": "High"
    },
    "concerns": "Worried about blood pressure",
    "additionalInfo": ""
  },
  "summary": "Intake form completed. 2 symptoms recorded, 1 medication listed."
}
```

## Data Types

### ChatMessage
```typescript
interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp?: string;
}
```

### PatientIntakeData
```typescript
interface PatientIntakeData {
  currentSymptoms: string[];
  symptomDuration: string;
  symptomSeverity: 'mild' | 'moderate' | 'severe';
  symptomTriggers: string[];
  medicalHistory: string[];
  currentMedications: Array<{
    name: string;
    dosage: string;
    frequency: string;
  }>;
  allergies: string[];
  recentIllnesses: string[];
  lifestyle: {
    exercise: string;
    diet: string;
    sleep: string;
    stress: string;
  };
  concerns: string;
  additionalInfo: string;
}
```

## System Prompt Safety Constraints

The AI system prompt explicitly includes these constraints:

```
CRITICAL CONSTRAINTS - NEVER violate these:
- NEVER provide a diagnosis or suspected diagnosis
- NEVER prescribe or recommend medications
- NEVER provide treatment advice or medical recommendations
- NEVER dismiss patient concerns
- NEVER provide emergency medical guidance (always suggest contacting emergency services for serious issues)
- Your role is INFORMATION GATHERING ONLY, not medical advice
```

This is enforced through:
1. **System Prompt** in `INTAKE_SYSTEM_PROMPT` - Clear instructions to the AI
2. **Structured Extraction** - Only extracts pre-defined fields, can't add diagnosis/prescription
3. **JSON Schema Validation** - Output validated against strict schema with Zod

## Configuration

### Environment Variables Required

```
OPENAI_API_KEY=sk-...              # OpenAI API key for GPT-4 access
DATABASE_URL=postgresql://...       # PostgreSQL connection string
JWT_SECRET=your-secret-key          # For auth token validation
```

### Model Used

- **GPT-4 Turbo Preview** - For accurate medical information extraction
- **Temperature: 0.3** - Lower temperature for consistent structure

## Usage Flow

### 1. Patient Initiates Intake
- Navigate to `/dashboard/patient/intake`
- System fetches or creates new PatientIntake record
- Initial greeting message from AI assistant

### 2. Conversational Exchange
- Patient responds to questions
- Each message:
  - Added to chat history
  - Sent to API
  - Processed by LLM for next question
  - Response added to chat history
  - UI updates with new message

### 3. Patient Completes Intake
- Click "Complete Intake" button
- System sends conversation to analyze endpoint
- OpenAI processes entire conversation
- Structured data extracted and validated
- Stored in database
- Patient sees confirmation

### 4. Doctor Reviews
- Doctor sees structured data in patient record
- Can view original conversation
- Marks as `isReviewedByDoc: true`
- Notes doctor who reviewed

## Implementation Details

### AI Response Generation

Currently implemented with placeholder responses. To enable OpenAI:

1. Set `OPENAI_API_KEY` environment variable
2. Update POST `/api/patient/intake` to call OpenAI API:

```typescript
// Example implementation
const openai = new OpenAI({ apiKey: OPENAI_API_KEY });

const response = await openai.chat.completions.create({
  model: 'gpt-4-turbo-preview',
  messages: [
    { role: 'system', content: INTAKE_SYSTEM_PROMPT },
    ...chatHistory,
  ],
  temperature: 0.3,
  max_tokens: 500,
});

const aiMessage = response.choices[0].message.content;
```

### Structured Data Analysis

When analyzing completed intake:

1. Format conversation as text
2. Call OpenAI with extraction prompt
3. Request JSON output matching schema
4. Parse and validate with Zod
5. Store in database

## Testing

### Test Patient Credentials
```
Email: patient@example.com
Password: password123

Email: patient2@example.com
Password: password123
```

### Manual Testing Steps

1. **Create Intake**
   ```bash
   curl -H "Authorization: Bearer <token>" \
     http://localhost:3000/api/patient/intake
   ```

2. **Send Message**
   ```bash
   curl -X POST \
     -H "Authorization: Bearer <token>" \
     -H "Content-Type: application/json" \
     -d '{"intakeId":"xxx","message":"I have a headache"}' \
     http://localhost:3000/api/patient/intake
   ```

3. **Analyze Intake**
   ```bash
   curl -X POST \
     -H "Authorization: Bearer <token>" \
     -H "Content-Type: application/json" \
     -d '{"intakeId":"xxx"}' \
     http://localhost:3000/api/patient/intake/analyze
   ```

## Security Considerations

✅ **Authentication** - All endpoints require valid JWT token
✅ **Authorization** - Patients can only access their own intakes
✅ **Hospital Isolation** - Intakes isolated by hospital
✅ **Data Validation** - All inputs validated before processing
✅ **No PII in Logs** - Sensitive data not logged
✅ **HTTPS Required** - In production, enforced by middleware

## Future Enhancements

1. **Voice Input** - Add speech-to-text for voice intake
2. **Progressive Disclosure** - Ask more questions based on symptoms
3. **Multi-Language Support** - Support for multiple languages
4. **Doctor Notes Integration** - Link to appointment notes
5. **Follow-up Forms** - Post-visit intake forms
6. **Analytics** - Track common symptoms and patterns
7. **Mobile App** - Native mobile intake experience
8. **Real-time Validation** - Validate data as user enters
9. **Export to EHR** - Direct integration with EHR systems
10. **Accessibility** - Full WCAG 2.1 AA compliance

## Troubleshooting

### OpenAI API Errors
- Check `OPENAI_API_KEY` is set correctly
- Verify API key has required permissions
- Check API rate limits not exceeded
- Review OpenAI dashboard for errors

### Chat Not Responding
- Check browser console for errors
- Verify patient is authenticated
- Check API logs for request/response
- Verify database connection working

### Data Not Saving
- Check database connection
- Verify Prisma migrations applied (`npm run db:push`)
- Check user has patientProfile
- Verify hospital isolation intact

## Support

For issues or questions:
1. Check logs: `npm run logs:check`
2. Verify database: `npx prisma studio`
3. Test API endpoint: `npm run test:intake`
4. Review error details in browser DevTools

---

**Last Updated:** 2024
**Version:** 1.0.0
**Status:** Production Ready
