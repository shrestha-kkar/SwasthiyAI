# Database Relationship Diagram

## Entity Relationship Diagram (ERD)

```
┌─────────────────────────────────────────────────────────────────────────┐
│                              HOSPITAL                                    │
│  ┌──────────────────────────────────────────────────────────────────┐   │
│  │ id (PK)                                                          │   │
│  │ name (UNIQUE)                                                    │   │
│  │ address, city, state, zipCode                                   │   │
│  │ phone, email                                                     │   │
│  │ createdAt, updatedAt                                            │   │
│  └──────────────────────────────────────────────────────────────────┘   │
└──────────┬──────────────────────────────────────────────────────────────┘
           │
           │ 1:N (Hospital Isolation)
           │
     ┌─────┴─────────────────────────────────────────────────────────┐
     │                                                                │
     v                                                                v
┌──────────────────────┐                                   ┌──────────────────────┐
│        USER          │                                   │   DOCTOR_PROFILE     │
├──────────────────────┤                                   ├──────────────────────┤
│ id (PK)              │                                   │ id (PK)              │
│ email (UNIQUE)       │◄─ 1:1 (if role=DOCTOR)        ─►│ userId (FK, UNIQUE)  │
│ name                 │                                   │ hospitalId (FK)      │
│ passwordHash         │                                   │ licenseNumber        │
│ role (ENUM)          │                                   │ specialization       │
│ hospitalId (FK)      │                                   │ yearsOfExperience    │
│ isActive             │                                   │ qualifications       │
│ lastLogin            │                                   │ bio                  │
│ createdAt, updatedAt │                                   │ isAvailable          │
└──────────┬───────────┘                                   │ createdAt, updatedAt │
           │                                                └──────────┬───────────┘
           │                                                           │
           │ 1:1 (if role=PATIENT)                                    │
           │                                                        1:N │
           │                                                        (Doctor)
           v                                                           │
┌──────────────────────┐                                              │
│  PATIENT_PROFILE     │                                              │
├──────────────────────┤                                              │
│ id (PK)              │                                              │
│ userId (FK, UNIQUE)  │◄───────────────┐                           │
│ hospitalId (FK)      │                 │                           │
│ dateOfBirth          │                 │                           │
│ gender               │                 │ 1:N (Patient)            │
│ bloodGroup           │                 │                           │
│ phoneNumber          │                 │                           │
│ emergencyContact     │                 │                           │
│ emergencyPhone       │                 │                           │
│ allergies            │                 │                           │
│ chronicalConditions  │                 │                           │
│ surgicalHistory      │                 │                           │
│ createdAt, updatedAt │                 │                           │
└──────────┬───────────┘                 │                           │
           │                             │                           │
           │ 1:N                         │                           │
           │ (Patient)                   │                           │
           │                             │                           │
           v                             v                           v
        ┌─────────────────────────────────────────────────────────────┐
        │                          VISIT                              │
        │  ┌─────────────────────────────────────────────────────────┤│
        │  │ id (PK)                                                 ││
        │  │ patientId (FK) ──────────┘  (References PatientProfile) ││
        │  │ doctorId (FK)  ──────────────┘  (References DoctorProfile)
        │  │ hospitalId (FK) ─ Hospital Isolation Check               ││
        │  │ status (ENUM): SCHEDULED | COMPLETED | CANCELLED | NO_SHOW
        │  │ type (ENUM): CONSULTATION | FOLLOW_UP | EMERGENCY | PROCEDURE
        │  │ scheduledDate, scheduledTime                            ││
        │  │ completedAt, duration                                   ││
        │  │ reason, notes                                           ││
        │  │ createdAt, updatedAt                                    ││
        │  └────────────────────────────┬───────────────────────────┬┘
        │                               │                           │
        └───────────────────────────────┼───────────────────────────┘
                                        │
                               1:N (Doctor Notes per Visit)
                                        │
                                        v
                        ┌─────────────────────────────────┐
                        │       DOCTOR_NOTE               │
                        ├─────────────────────────────────┤
                        │ id (PK)                         │
                        │ visitId (FK)                    │
                        │ doctorId (FK)                   │
                        │ symptoms, diagnosis             │
                        │ prescription (JSON)             │
                        │ observations, recommendations   │
                        │ vitals (JSON)                   │
                        │ labResults                      │
                        │ createdAt, updatedAt            │
                        └─────────────────────────────────┘
```

## Relationship Matrix

| From | To | Type | Cardinality | Foreign Key | Cascade | Notes |
|------|---|------|-------|------------|----------|--------|
| User | Hospital | M:1 | Many users per hospital | `hospitalId` | Cascade | Hospital isolation key |
| DoctorProfile | User | 1:1 | One profile per doctor | `userId` | Cascade | If role=DOCTOR |
| DoctorProfile | Hospital | M:1 | Many doctors per hospital | `hospitalId` | Cascade | Hospital isolation |
| PatientProfile | User | 1:1 | One profile per patient | `userId` | Cascade | If role=PATIENT |
| PatientProfile | Hospital | M:1 | Many patients per hospital | `hospitalId` | Cascade | Hospital isolation |
| Visit | PatientProfile | M:1 | Many visits per patient | `patientId` | Cascade | Referential integrity |
| Visit | DoctorProfile | M:1 | Many visits per doctor | `doctorId` | Restrict | Prevent doctor deletion |
| Visit | Hospital | M:1 | Many visits per hospital | `hospitalId` | Cascade | Hospital isolation |
| DoctorNote | Visit | M:1 | Many notes per visit | `visitId` | Cascade | Delete notes with visit |
| DoctorNote | DoctorProfile | M:1 | Many notes per doctor | `doctorId` | Restrict | Prevent doctor deletion |

## Data Access Patterns

### Hospital Isolation Pattern
```
All queries MUST filter by hospitalId:

User belongs to 1 Hospital
  └─ DoctorProfile → 1 Hospital
  └─ PatientProfile → 1 Hospital

Doctor visits Patient within same Hospital
Visit → 1 Hospital (ensures doctor & patient are from same hospital)
DoctorNote → Visit → Hospital
```

### Role-Based Access Control
```
ADMIN
  ├─ Can view all users in their hospital
  ├─ Can create doctors and patients
  └─ Can view all visits in their hospital

DOCTOR
  ├─ Can view their own profile
  ├─ Can view their assigned patients
  ├─ Can view their visits
  ├─ Can create doctor notes
  └─ Cannot view other doctors' patients

PATIENT
  ├─ Can view their own profile
  ├─ Can view their own visits
  ├─ Can view their own medical records
  ├─ Can book appointments
  └─ Cannot view other patients' data

STAFF
  ├─ Can view patient schedules
  ├─ Can schedule appointments
  └─ Cannot view clinical notes
```

## Index Strategy

```sql
-- Performance Indexes for Common Queries

-- User lookups by email (login)
CREATE INDEX idx_users_email ON users(email);

-- Hospital isolation queries
CREATE INDEX idx_users_hospital ON users(hospitalId);
CREATE INDEX idx_doctor_profiles_hospital ON doctor_profiles(hospitalId);
CREATE INDEX idx_patient_profiles_hospital ON patient_profiles(hospitalId);
CREATE INDEX idx_visits_hospital ON visits(hospitalId);

-- Visit scheduling queries
CREATE INDEX idx_visits_patient ON visits(patientId);
CREATE INDEX idx_visits_doctor ON visits(doctorId);
CREATE INDEX idx_visits_scheduled_date ON visits(scheduledDate);
CREATE INDEX idx_visits_status ON visits(status);

-- Doctor note lookups
CREATE INDEX idx_doctor_notes_visit ON doctor_notes(visitId);
CREATE INDEX idx_doctor_notes_doctor ON doctor_notes(doctorId);

-- License number lookup
CREATE INDEX idx_doctor_profiles_license ON doctor_profiles(licenseNumber);
```

## Transaction Scenarios

### Scenario 1: Book an Appointment
```typescript
await prisma.$transaction(async (tx) => {
  // 1. Verify patient exists and is active
  const patient = await tx.patientProfile.findUnique({
    where: { id: patientId },
    include: { user: true },
  });
  
  // 2. Verify doctor exists and is available
  const doctor = await tx.doctorProfile.findUnique({
    where: { id: doctorId },
  });
  
  // 3. Create visit (both from same hospital)
  const visit = await tx.visit.create({
    data: {
      patientId,
      doctorId,
      hospitalId: patient.hospitalId, // From patient's hospital
      status: 'SCHEDULED',
      scheduledDate: new Date('2024-02-20'),
      reason: 'Annual checkup',
    },
  });
  
  return visit;
});
```

### Scenario 2: Complete Visit with Clinical Notes
```typescript
await prisma.$transaction(async (tx) => {
  // 1. Update visit to completed
  const visit = await tx.visit.update({
    where: { id: visitId },
    data: {
      status: 'COMPLETED',
      completedAt: new Date(),
      duration: 45,
    },
  });
  
  // 2. Create doctor notes
  const notes = await tx.doctorNote.create({
    data: {
      visitId,
      doctorId,
      symptoms: 'None',
      diagnosis: 'Healthy',
      observations: 'Patient in good health',
      vitals: JSON.stringify({
        bloodPressure: '120/80',
        temperature: '98.6°F',
      }),
    },
  });
  
  return { visit, notes };
});
```

### Scenario 3: Delete Doctor (with Cascade Protection)
```typescript
// Doctor deletion will:
// ✓ Delete DoctorProfile (CASCADE)
// ✓ Keep Visits (RESTRICT on doctorId prevents deletion)
// ✓ Keep DoctorNotes (RESTRICT on doctorId prevents deletion)
// ✓ Delete User record (CASCADE from DoctorProfile)

try {
  await prisma.doctorProfile.delete({
    where: { userId: doctorUserId },
  });
} catch (error) {
  // Error: Cannot delete doctor with active visits
  // Action: Archive doctor instead of deleting
  await prisma.user.update({
    where: { id: doctorUserId },
    data: { isActive: false },
  });
}
```

## Hospital Isolation Verification

To ensure hospital isolation is maintained:

```typescript
// ✓ CORRECT: Filter by current user's hospital
const visits = await prisma.visit.findMany({
  where: {
    hospitalId: currentUser.hospitalId,
    patientId,
  },
});

// ✗ WRONG: Missing hospital filter (security risk)
const visits = await prisma.visit.findMany({
  where: { patientId },
  // BUG: Could access patient from other hospital!
});

// ✓ CORRECT: Verify hospital match before operations
const doctor = await prisma.doctorProfile.findUnique({
  where: { id: doctorId },
});

if (doctor.hospitalId !== currentUser.hospitalId) {
  throw new Error('Doctor not in your hospital');
}
```
