# Database Quick Reference

## Entity Overview

```
┌─────────────────────────────────────────────────────────────┐
│ HOSPITAL (Central Hub - All data belongs to 1 hospital)     │
├─────────────────────────────────────────────────────────────┤
│ • id, name, address, city, state, zipCode, phone, email    │
└────────────────┬──────────────────────────────────────────┘
                 │
        ┌────────┼────────┬──────────┐
        │        │        │          │
        v        v        v          v
    ┌────────────┐  ┌──────────┐  ┌──────────┐
    │ USER       │  │ DOCTOR   │  │ PATIENT  │
    ├────────────┤  ├──────────┤  ├──────────┤
    │ (5 demo)   │  │ (1 demo) │  │ (2 demo) │
    └────────────┘  └──────────┘  └──────────┘
        │               │              │
        │ 1:N            │ 1:1          │ 1:1
        └──────┬─────────┴──────────────┘
               │
               v
            ┌───────────────┐
            │    VISIT      │
            ├───────────────┤
            │  (3 demo)     │
            │               │
            │  Patient+Doc  │ Same hospital
            │  Scheduled or │
            │  Completed    │
            └───────┬───────┘
                    │
                    │ 1:N
                    v
            ┌──────────────────┐
            │  DOCTOR_NOTE     │
            ├──────────────────┤
            │  (2 demo)        │
            │                  │
            │  Symptoms,       │
            │  Diagnosis,      │
            │  Prescription,   │
            │  Vitals (JSON)   │
            └──────────────────┘
```

## Enum Quick Reference

```
┌─────────────────────────────────────────┐
│ UserRole (Each User has ONE)            │
├─────────────────────────────────────────┤
│ • ADMIN  → Full system access           │
│ • DOCTOR → Has DoctorProfile, sees      │
│            assigned patients only       │
│ • PATIENT→ Has PatientProfile, sees     │
│            own records only             │
│ • STAFF  → No profile, schedule support │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│ VisitStatus (Visit state machine)       │
├─────────────────────────────────────────┤
│ • SCHEDULED → Appointment booked        │
│ • COMPLETED → Doctor finished, has notes│
│ • CANCELLED → Either party cancelled    │
│ • NO_SHOW   → Patient didn't attend     │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│ VisitType (Appointment category)        │
├─────────────────────────────────────────┤
│ • CONSULTATION → Initial visit          │
│ • FOLLOW_UP    → Revisit for checkup    │
│ • EMERGENCY    → Urgent care            │
│ • PROCEDURE    → Medical procedure      │
└─────────────────────────────────────────┘
```

## Entity Fields Quick Lookup

### Hospital
```
id (PK)          - Auto-generated ID
name (UNIQUE)    - Hospital name
address          - Street address
city, state      - Location
zipCode          - Postal code
phone, email     - Contact info
createdAt        - Created timestamp
updatedAt        - Last updated timestamp
```

### User
```
id (PK)               - Auto-generated ID
email (UNIQUE)        - Login email
passwordHash          - Bcrypt hashed password
name                  - Full name
role (ENUM)           - User role
hospitalId (FK)       - Which hospital
isActive              - Account status
lastLogin             - Last login time
createdAt, updatedAt  - Audit timestamps
```

### DoctorProfile
```
id (PK)               - Auto-generated ID
userId (UNIQUE, FK)   - Links to User (if role=DOCTOR)
hospitalId (FK)       - Hospital location
licenseNumber (UNIQUE)- Medical license
specialization        - Medical specialty
yearsOfExperience     - Years practicing
qualifications        - Credentials (MBBS, MD, etc.)
bio                   - Professional biography
isAvailable           - Can take appointments
createdAt, updatedAt  - Audit timestamps
```

### PatientProfile
```
id (PK)               - Auto-generated ID
userId (UNIQUE, FK)   - Links to User (if role=PATIENT)
hospitalId (FK)       - Hospital location
dateOfBirth           - Birth date (for age calc)
gender                - M, F, Other
bloodGroup            - O+, A-, etc. (optional)
phoneNumber           - Contact number
emergencyContact      - Emergency person name
emergencyPhone        - Emergency person phone
allergies             - Comma-separated list
chronicalConditions   - Existing conditions
surgicalHistory       - Previous surgeries
createdAt, updatedAt  - Audit timestamps
```

### Visit
```
id (PK)               - Auto-generated ID
patientId (FK)        - PatientProfile.id
doctorId (FK)         - DoctorProfile.id
hospitalId (FK)       - Must match patient & doctor
status (ENUM)         - SCHEDULED|COMPLETED|etc
type (ENUM)           - CONSULTATION|FOLLOW_UP|etc
scheduledDate         - Appointment date
scheduledTime         - Appointment time
completedAt           - When visit finished
duration              - Minutes spent
reason                - Chief complaint
notes                 - General notes
createdAt, updatedAt  - Audit timestamps
```

### DoctorNote
```
id (PK)               - Auto-generated ID
visitId (FK)          - Which Visit
doctorId (FK)         - Which Doctor
symptoms              - Patient symptoms
diagnosis             - Doctor diagnosis
prescription (JSON)   - Medications array
observations          - Clinical findings
recommendations       - Follow-up plan
vitals (JSON)         - Blood pressure, temp, pulse
labResults            - Lab test references
createdAt, updatedAt  - Audit timestamps
```

## JSON Field Formats

### Prescription Format
```typescript
[
  {
    medication: "Metformin",
    dosage: "1000mg",
    frequency: "Twice daily",
    duration?: "30 days"
  }
]
```

### Vitals Format
```typescript
{
  bloodPressure: "130/85",    // mmHg
  temperature: "98.6°F",      // Fahrenheit
  pulse: 72,                  // BPM
  respiration: 16             // Breaths/min
}
```

## Relationships at a Glance

| From | To | Type | Why |
|------|---|------|-----|
| User | Hospital | M:1 | Hospital isolation |
| DoctorProfile | User | 1:1 | Doctor's account |
| PatientProfile | User | 1:1 | Patient's account |
| Visit | Patient | M:1 | Patient has many visits |
| Visit | Doctor | M:1 | Doctor has many visits |
| Visit | Hospital | M:1 | Hospital isolation |
| DoctorNote | Visit | M:1 | Notes per visit |
| DoctorNote | Doctor | M:1 | Doctor's notes |

## Demo Data Created

```
HOSPITALS (2)
  ├─ hosp-001: Central Medical Hospital (SF)
  └─ hosp-002: City Care Medical Center (LA)

USERS (5)
  ├─ user-001: admin@example.com (ADMIN)
  ├─ user-002: doctor@example.com (DOCTOR) → DoctorProfile
  ├─ user-003: patient@example.com (PATIENT) → PatientProfile
  ├─ user-004: patient2@example.com (PATIENT) → PatientProfile
  └─ user-005: staff@example.com (STAFF)

VISITS (3)
  ├─ visit-1: patient-001 → doctor-001 (COMPLETED)
  ├─ visit-2: patient-002 → doctor-001 (SCHEDULED)
  └─ visit-3: patient-001 → doctor-001 (COMPLETED)

DOCTOR_NOTES (2)
  ├─ note-1: visit-1 (Diabetes management)
  └─ note-2: visit-3 (Lab results review)
```

## Login Credentials

```
ADMIN
  Email: admin@example.com
  Pass:  password123
  Role:  ADMIN

DOCTOR
  Email: doctor@example.com
  Pass:  password123
  Role:  DOCTOR
  Spec:  General Practice

PATIENT 1
  Email: patient@example.com
  Pass:  password123
  Role:  PATIENT
  Name:  John Doe
  
PATIENT 2
  Email: patient2@example.com
  Pass:  password123
  Role:  PATIENT
  Name:  Emily Chen
```

## Common Queries (Pseudocode)

```typescript
// Get all visits for a patient in current hospital
visits = Visit.where(
  patientId = user.patientProfile.id,
  hospitalId = user.hospitalId
).orderBy(scheduledDate desc)

// Get upcoming appointments for a doctor
appointments = Visit.where(
  doctorId = user.doctorProfile.id,
  hospitalId = user.hospitalId,
  status = "SCHEDULED",
  scheduledDate >= TODAY
).orderBy(scheduledDate asc)

// Get doctor's notes for a visit
notes = DoctorNote.where(
  visitId = visit.id,
  doctorId = visit.doctorId  // Verify doctor
)

// Get all patients in hospital (admin only)
patients = PatientProfile.where(
  hospitalId = admin.hospitalId
).include(user: { select: name, email })

// Create new visit
visit = Visit.create({
  patientId,
  doctorId,
  hospitalId,  // CRITICAL: Both patient & doctor must be here
  scheduledDate,
  reason
})

// Complete visit and add notes
visit.update({ status: "COMPLETED" })
notes.create({
  visitId,
  doctorId,
  symptoms,
  diagnosis,
  prescription: JSON
})
```

## Security Checklist

```
☐ Always filter by hospitalId in queries
☐ Verify user.hospitalId == queried data.hospitalId
☐ Hash passwords with bcrypt (10+ rounds)
☐ Validate user role before returning data
☐ Use HTTP-only cookies for JWT storage
☐ Set SameSite=Lax on auth cookies
☐ Refresh tokens every 7 days
☐ Audit all user modifications
☐ Never reveal if email exists in error messages
☐ Rate limit login attempts
☐ Use HTTPS in production
```

## Setup Commands

```bash
# Install dependencies
npm install

# Push schema to database
npx prisma db push

# View/edit database
npm run db:studio

# Seed sample data
npm run db:seed

# Create migrations
npx prisma migrate dev --name description

# Reset database (⚠️ Deletes data)
npx prisma migrate reset
```

## File Locations

```
prisma/
  ├─ schema.prisma      ← Data model
  └─ seed.ts            ← Sample data

docs/
  ├─ DATABASE_SCHEMA.md        ← Full documentation
  ├─ DATABASE_RELATIONSHIPS.md ← Diagrams & patterns
  ├─ DATABASE_SETUP.md         ← PostgreSQL setup
  └─ DATABASE_INTEGRATION.md   ← Auth integration

config/
  └─ .env.local         ← DATABASE_URL
```

## Hospital Isolation Pattern

```
⚠️ CRITICAL: Every query must include hospital isolation

✓ CORRECT:
  SELECT * FROM visits 
  WHERE hospitalId = $1 AND patientId = $2

✗ WRONG:
  SELECT * FROM visits 
  WHERE patientId = $2
  -- BUG: Could leak another hospital's data!

Implementation:
1. Extract hospitalId from JWT token
2. Include in WHERE clause on all queries
3. Validate hospitalId before update/delete
4. Never trust user-provided hospitalId
```

## Data Integrity Rules

```
Rule: User must have matching Hospital
  User.hospitalId must exist in Hospital table

Rule: Doctor must have matching User
  DoctorProfile.userId must have role=DOCTOR

Rule: Patient must have matching User
  PatientProfile.userId must have role=PATIENT

Rule: Visit must have matching Hospital
  Visit.hospitalId must match:
    - Patient.hospitalId
    - Doctor.hospitalId
    
Rule: DoctorNote must have matching Visit
  DoctorNote.visitId must reference valid Visit
  DoctorNote.doctorId must match Visit.doctorId
```

## Architecture Summary

```
Single Hospital Instance (hosp-001)
├── Users (All have hospitalId=hosp-001)
│   ├── Admin User
│   ├── Doctor User → DoctorProfile
│   ├── Patient User → PatientProfile
│   └── Staff User
├── Visits (All have hospitalId=hosp-001)
│   └── Each links specific patient + doctor
└── DoctorNotes (Attached to visits)

Result: Complete data isolation + HIPAA compliance
```

---

For detailed information, see:
- [DATABASE_SCHEMA.md](DATABASE_SCHEMA.md) - Complete field reference
- [DATABASE_RELATIONSHIPS.md](DATABASE_RELATIONSHIPS.md) - Diagrams & patterns
- [DATABASE_INTEGRATION.md](DATABASE_INTEGRATION.md) - Auth system integration
