# Database Schema Documentation

## Overview

The SwasthyaSetu healthcare system uses **PostgreSQL** with **Prisma ORM** for persistent data storage. The schema supports role-based access control with hospital isolation, patient-doctor relationships, and comprehensive visit management with clinical notes.

## Architecture Diagram

```
Hospital
├── Users (Admin, Doctor, Patient, Staff)
│   ├── DoctorProfile (with License, Specialization)
│   └── PatientProfile (with Medical History)
└── Visits
    └── DoctorNote (Clinical observations per visit)
```

## Entity Relationships

### 1. **Hospital** (Central Hub)
**Purpose:** Represents healthcare facilities with isolated data per hospital

**Key Fields:**
- `id`: Unique identifier (CUID)
- `name`: Hospital name (Unique)
- `address`, `city`, `state`, `zipCode`: Location
- `phone`, `email`: Contact information
- `createdAt`, `updatedAt`: Audit timestamps

**Relations:**
- One-to-Many with Users (isolation: all users belong to one hospital)
- One-to-Many with PatientProfiles
- One-to-Many with DoctorProfiles
- One-to-Many with Visits

**Hospital Isolation:** Every user, patient, and doctor is scoped to a single hospital. This ensures:
- Data never leaks between hospitals
- Query filtering by `hospitalId` is essential for security
- Can safely host multiple hospital tenants

---

### 2. **User** (Authentication & Authorization)
**Purpose:** Core authentication entity with role-based access control

**Key Fields:**
- `id`: Unique identifier (CUID)
- `email`: Unique identifier for login
- `passwordHash`: Hashed password (base64 in seed, use bcrypt in production)
- `name`: User's full name
- `role`: UserRole enum (ADMIN | DOCTOR | PATIENT | STAFF)
- `hospitalId`: Foreign key to Hospital (enforces hospital isolation)
- `isActive`: Boolean flag for account status
- `lastLogin`: Timestamp for audit trail
- `createdAt`, `updatedAt`: Audit timestamps

**Relations:**
- Belongs to: Hospital
- Has one: DoctorProfile (if role = DOCTOR)
- Has one: PatientProfile (if role = PATIENT)

**User Roles:**
| Role | Permissions | Profile |
|------|------------|---------|
| ADMIN | Full system access, manage users/hospitals | None |
| DOCTOR | View assigned patients, create visits, write notes | DoctorProfile required |
| PATIENT | View own appointments, medical records | PatientProfile required |
| STAFF | Scheduling, patient check-in | None |

---

### 3. **DoctorProfile** (Extended Doctor Information)
**Purpose:** Professional credentials and specialization for doctors

**Key Fields:**
- `id`: Unique identifier (CUID)
- `userId`: Foreign key to User (unique, one-to-one)
- `hospitalId`: Hospital association for multi-hospital setups
- `licenseNumber`: Medical license (Unique)
- `specialization`: Medical specialty (e.g., "Cardiology", "Pediatrics")
- `yearsOfExperience`: Professional experience in years
- `qualifications`: Credentials string (e.g., "MBBS, MD Cardiology")
- `bio`: Professional biography
- `isAvailable`: Boolean for scheduling availability
- `createdAt`, `updatedAt`: Audit timestamps

**Relations:**
- Belongs to: User, Hospital
- Has many: Visits (as doctor)
- Has many: DoctorNotes

**Constraints:**
- Can only exist if User.role = DOCTOR
- licenseNumber must be unique across all doctors

---

### 4. **PatientProfile** (Extended Patient Information)
**Purpose:** Medical history and demographics for patients

**Key Fields:**
- `id`: Unique identifier (CUID)
- `userId`: Foreign key to User (unique, one-to-one)
- `hospitalId`: Hospital association
- `dateOfBirth`: Patient age calculation
- `gender`: Patient gender ("M", "F", "Other")
- `bloodGroup`: Blood type (e.g., "O+", "B-")
- `phoneNumber`: Contact number
- `emergencyContact`: Emergency contact person name
- `emergencyPhone`: Emergency contact phone
- `allergies`: Comma-separated or structured allergies
- `chronicalConditions`: Existing chronic conditions
- `surgicalHistory`: Previous surgeries and dates
- `createdAt`, `updatedAt`: Audit timestamps

**Relations:**
- Belongs to: User, Hospital
- Has many: Visits (as patient)

**Constraints:**
- Can only exist if User.role = PATIENT
- One PatientProfile per User (one-to-one)

---

### 5. **Visit** (Appointment/Consultation)
**Purpose:** Records interactions between patients and doctors

**Key Fields:**
- `id`: Unique identifier (CUID)
- `patientId`: Foreign key to PatientProfile
- `doctorId`: Foreign key to DoctorProfile
- `hospitalId`: Hospital where visit occurs
- `status`: VisitStatus enum (SCHEDULED | COMPLETED | CANCELLED | NO_SHOW)
- `type`: VisitType enum (CONSULTATION | FOLLOW_UP | EMERGENCY | PROCEDURE)
- `scheduledDate`: Date of appointment
- `scheduledTime`: Time of appointment
- `completedAt`: Timestamp when visit was completed
- `duration`: Visit duration in minutes
- `reason`: Chief complaint or reason for visit
- `notes`: General visit notes
- `createdAt`, `updatedAt`: Audit timestamps

**Relations:**
- Belongs to: PatientProfile, DoctorProfile, Hospital
- Has many: DoctorNotes

**Visit Lifecycle:**
1. **SCHEDULED**: Patient books appointment
2. **COMPLETED**: Doctor completes visit and creates notes
3. **CANCELLED**: Either party cancels
4. **NO_SHOW**: Patient doesn't attend

**Indexes:** patientId, doctorId, hospitalId, scheduledDate, status (for efficient queries)

---

### 6. **DoctorNote** (Clinical Documentation)
**Purpose:** Doctor's clinical observations and treatment plan per visit

**Key Fields:**
- `id`: Unique identifier (CUID)
- `visitId`: Foreign key to Visit (cascade delete)
- `doctorId`: Foreign key to DoctorProfile
- `symptoms`: Patient-reported symptoms
- `diagnosis`: Doctor's diagnosis
- `prescription`: Prescribed medications (JSON format)
- `observations`: Clinical observations by doctor
- `recommendations`: Follow-up recommendations
- `vitals`: Vital signs in JSON (BP, temp, pulse, respiration)
- `labResults`: References to lab tests
- `createdAt`, `updatedAt`: Audit timestamps

**Relations:**
- Belongs to: Visit, DoctorProfile

**Prescription Format (JSON):**
```json
[
  {
    "medication": "Metformin",
    "dosage": "1000mg",
    "frequency": "Twice daily"
  }
]
```

**Vitals Format (JSON):**
```json
{
  "bloodPressure": "130/85",
  "temperature": "98.6°F",
  "pulse": 72,
  "respiration": 16
}
```

**Constraints:**
- One DoctorNote per Visit can be created (design choice for simplicity)
- Always associated with the visit's doctor

---

## Enums

### UserRole
```typescript
enum UserRole {
  ADMIN    // Full system access
  DOCTOR   // Has DoctorProfile
  PATIENT  // Has PatientProfile
  STAFF    // Support staff (no profile)
}
```

### VisitStatus
```typescript
enum VisitStatus {
  SCHEDULED  // Appointment booked
  COMPLETED  // Visit finished
  CANCELLED  // Cancelled by patient/doctor
  NO_SHOW    // Patient didn't show up
}
```

### VisitType
```typescript
enum VisitType {
  CONSULTATION // Initial consultation
  FOLLOW_UP    // Follow-up appointment
  EMERGENCY    // Emergency visit
  PROCEDURE    // Medical procedure
}
```

---

## Data Flow Examples

### Example 1: Patient Visits Doctor

```sql
-- 1. Patient logs in
SELECT * FROM users WHERE email = 'patient@example.com' AND passwordHash = ?

-- 2. Patient books appointment
INSERT INTO visits (patientId, doctorId, hospitalId, status, scheduledDate, reason)
VALUES (patient_id, doctor_id, hosp_001, 'SCHEDULED', '2024-02-20', 'Annual checkup')

-- 3. Doctor completes visit
UPDATE visits SET status = 'COMPLETED', completedAt = NOW() WHERE id = visit_id

-- 4. Doctor adds clinical notes
INSERT INTO doctor_notes (visitId, doctorId, symptoms, diagnosis, prescription)
VALUES (visit_id, doctor_id, 'Headache, fever', 'Common cold', '[...]')
```

### Example 2: Admin Views Hospital Statistics

```sql
-- Count active users per role in hospital
SELECT 
  role, 
  COUNT(*) as count 
FROM users 
WHERE hospitalId = 'hosp-001' AND isActive = true 
GROUP BY role

-- Recent visits
SELECT v.*, u.name, d.user.name 
FROM visits v
JOIN patient_profiles pp ON v.patientId = pp.id
JOIN users u ON pp.userId = u.id
JOIN doctor_profiles dp ON v.doctorId = dp.id
WHERE v.hospitalId = 'hosp-001' 
ORDER BY v.createdAt DESC 
LIMIT 20
```

---

## Query Examples

### Find Patient's Visit History
```typescript
const visits = await prisma.visit.findMany({
  where: {
    patientId: patientProfile.id,
    hospitalId: userHospitalId,
  },
  include: {
    doctor: { include: { user: true } },
    doctorNotes: true,
  },
  orderBy: { scheduledDate: 'desc' },
});
```

### Get Doctor's Upcoming Appointments
```typescript
const upcomingVisits = await prisma.visit.findMany({
  where: {
    doctorId: doctorProfile.id,
    status: 'SCHEDULED',
    scheduledDate: {
      gte: new Date(), // Greater than or equal to today
    },
  },
  include: {
    patient: { include: { user: true } },
  },
  orderBy: { scheduledDate: 'asc' },
});
```

### Create Visit with Doctor Note
```typescript
const visit = await prisma.visit.create({
  data: {
    patientId,
    doctorId,
    hospitalId,
    status: 'COMPLETED',
    type: 'CONSULTATION',
    scheduledDate: new Date(),
    reason: 'Annual checkup',
    doctorNotes: {
      create: {
        doctorId,
        symptoms: 'None',
        diagnosis: 'Healthy',
        observations: 'Patient in good health',
      },
    },
  },
  include: { doctorNotes: true },
});
```

---

## Security Considerations

### 1. Hospital Isolation
- **Always filter by `hospitalId`** in all queries
- Middleware should attach `hospitalId` to request context
- Never trust user-provided `hospitalId`

### 2. Role-Based Access
- Admin: Can access all users in their hospital
- Doctor: Can only see assigned patients
- Patient: Can only see own records
- Staff: Limited scheduling access

### 3. Password Security
- Current seed uses base64 (development only)
- **Production: Use bcrypt** with salt rounds ≥ 10
- Hash passwords before storage

### 4. Audit Trail
- All entities have `createdAt` and `updatedAt`
- Consider adding `createdBy` and `updatedBy` for sensitive tables

---

## Migration Commands

```bash
# Setup Prisma client
npm install @prisma/client prisma

# Generate Prisma client (after schema changes)
npx prisma generate

# Create/update database schema
npx prisma db push

# Create managed migration
npx prisma migrate dev --name init

# Deploy migrations in production
npx prisma migrate deploy

# Interactive database browser
npx prisma studio

# Run seed script
npm run db:seed
```

---

## Schema Constraints Summary

| Table | Constraint | Purpose |
|-------|-----------|---------|
| User | email UNIQUE | Ensure unique login emails |
| User | FK to Hospital | Hospital isolation |
| DoctorProfile | licenseNumber UNIQUE | License uniqueness |
| DoctorProfile | userId UNIQUE | One profile per doctor |
| PatientProfile | userId UNIQUE | One profile per patient |
| Visit | FK to Patient, Doctor, Hospital | Referential integrity |
| DoctorNote | FK to Visit (CASCADE) | Delete notes with visit |

---

## Example Seed Data

See `prisma/seed.ts` for complete seeding script including:
- 2 hospitals
- 5 users (1 admin, 1 doctor, 2 patients, 1 staff)
- 2 patient profiles with medical history
- 3 visits (various statuses)
- 2 doctor notes with vitals and prescriptions

Run with: `npm run db:seed`

---

## Integration with Existing Auth System

The database schema integrates with the current JWT authentication:

1. **Login Process:**
   - Validate email/password against `users` table
   - Include `hospitalId` in JWT payload
   - All subsequent queries filtered by this `hospitalId`

2. **Role Validation:**
   - JWT includes `role` field
   - Middleware checks role for protected routes
   - Database queries verify role permissions

3. **Profile Access:**
   - Doctor role requires `doctorProfile` record
   - Patient role requires `patientProfile` record
   - Query endpoints check both JWT role AND profile existence
