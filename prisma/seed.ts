import { PrismaClient, UserRole, VisitStatus, VisitType } from "@prisma/client";

const prisma = new PrismaClient();

// Simple hash simulation (in production, use bcrypt)
function hashPassword(password: string): string {
  return Buffer.from(password).toString("base64");
}

async function main() {
  console.log("🌱 Starting database seeding...");

  // ========================================
  // CREATE HOSPITALS
  // ========================================
  const hospital1 = await prisma.hospital.create({
    data: {
      id: "hosp-001",
      name: "Central Medical Hospital",
      address: "123 Healthcare Ave",
      city: "San Francisco",
      state: "CA",
      zipCode: "94105",
      phone: "+1-415-555-0001",
      email: "contact@centralhospital.com",
    },
  });

  const hospital2 = await prisma.hospital.create({
    data: {
      id: "hosp-002",
      name: "City Care Medical Center",
      address: "456 Wellness Street",
      city: "Los Angeles",
      state: "CA",
      zipCode: "90001",
      phone: "+1-213-555-0002",
      email: "contact@citycaremedical.com",
    },
  });

  console.log("✓ Created 2 hospitals");

  // ========================================
  // CREATE USERS & PROFILES
  // ========================================

  // Admin User
  const adminUser = await prisma.user.create({
    data: {
      id: "user-001",
      email: "admin@example.com",
      name: "Admin User",
      passwordHash: hashPassword("password123"),
      role: UserRole.ADMIN,
      hospitalId: hospital1.id,
      isActive: true,
    },
  });

  // Doctor User
  const doctorUser = await prisma.user.create({
    data: {
      id: "user-002",
      email: "doctor@example.com",
      name: "Dr. Sarah Johnson",
      passwordHash: hashPassword("password123"),
      role: UserRole.DOCTOR,
      hospitalId: hospital1.id,
      isActive: true,
    },
  });

  // Create Doctor Profile
  const doctorProfile = await prisma.doctorProfile.create({
    data: {
      userId: doctorUser.id,
      hospitalId: hospital1.id,
      licenseNumber: "MD-2024-001",
      specialization: "General Practice",
      yearsOfExperience: 8,
      qualifications: "MBBS, MD Internal Medicine",
      bio: "Experienced general practitioner with focus on preventive care",
      isAvailable: true,
    },
  });

  // Patient User 1
  const patientUser1 = await prisma.user.create({
    data: {
      id: "user-003",
      email: "patient@example.com",
      name: "John Doe",
      passwordHash: hashPassword("password123"),
      role: UserRole.PATIENT,
      hospitalId: hospital1.id,
      isActive: true,
    },
  });

  // Create Patient Profile 1
  const patientProfile1 = await prisma.patientProfile.create({
    data: {
      userId: patientUser1.id,
      hospitalId: hospital1.id,
      dateOfBirth: new Date("1990-05-15"),
      gender: "M",
      bloodGroup: "O+",
      phoneNumber: "+1-415-555-1234",
      emergencyContact: "Jane Doe",
      emergencyPhone: "+1-415-555-5678",
      allergies: "Penicillin, Shellfish",
      chronicalConditions: "Type 2 Diabetes",
      surgicalHistory: "Appendectomy (2015)",
    },
  });

  // Patient User 2
  const patientUser2 = await prisma.user.create({
    data: {
      id: "user-004",
      email: "patient2@example.com",
      name: "Emily Chen",
      passwordHash: hashPassword("password123"),
      role: UserRole.PATIENT,
      hospitalId: hospital1.id,
      isActive: true,
    },
  });

  // Create Patient Profile 2
  const patientProfile2 = await prisma.patientProfile.create({
    data: {
      userId: patientUser2.id,
      hospitalId: hospital1.id,
      dateOfBirth: new Date("1985-08-22"),
      gender: "F",
      bloodGroup: "A-",
      phoneNumber: "+1-415-555-9999",
      emergencyContact: "Michael Chen",
      emergencyPhone: "+1-415-555-8888",
      allergies: "Sulfonamides",
      chronicalConditions: "Hypertension",
      surgicalHistory: "C-section (2018)",
    },
  });

  // Staff User
  const staffUser = await prisma.user.create({
    data: {
      id: "user-005",
      email: "staff@example.com",
      name: "Nurse Assistant",
      passwordHash: hashPassword("password123"),
      role: UserRole.STAFF,
      hospitalId: hospital1.id,
      isActive: true,
    },
  });

  console.log("✓ Created 5 users (1 admin, 1 doctor, 2 patients, 1 staff)");

  // ========================================
  // CREATE VISITS
  // ========================================

  const visit1 = await prisma.visit.create({
    data: {
      patientId: patientProfile1.id,
      doctorId: doctorProfile.id,
      hospitalId: hospital1.id,
      status: VisitStatus.COMPLETED,
      type: VisitType.CONSULTATION,
      scheduledDate: new Date("2024-01-15"),
      scheduledTime: new Date("2024-01-15T10:00:00Z"),
      completedAt: new Date("2024-01-15T10:45:00Z"),
      duration: 45,
      reason: "Annual checkup and diabetes management",
      notes: "Patient doing well, labs ordered",
    },
  });

  const visit2 = await prisma.visit.create({
    data: {
      patientId: patientProfile2.id,
      doctorId: doctorProfile.id,
      hospitalId: hospital1.id,
      status: VisitStatus.SCHEDULED,
      type: VisitType.FOLLOW_UP,
      scheduledDate: new Date("2024-02-20"),
      scheduledTime: new Date("2024-02-20T14:00:00Z"),
      completedAt: null,
      duration: null,
      reason: "Blood pressure follow-up",
      notes: null,
    },
  });

  const visit3 = await prisma.visit.create({
    data: {
      patientId: patientProfile1.id,
      doctorId: doctorProfile.id,
      hospitalId: hospital1.id,
      status: VisitStatus.COMPLETED,
      type: VisitType.FOLLOW_UP,
      scheduledDate: new Date("2024-01-30"),
      scheduledTime: new Date("2024-01-30T09:30:00Z"),
      completedAt: new Date("2024-01-30T10:15:00Z"),
      duration: 45,
      reason: "Lab results review",
      notes: "Results reviewed with patient, medication adjusted",
    },
  });

  console.log("✓ Created 3 visits");

  // ========================================
  // CREATE DOCTOR NOTES
  // ========================================

  const note1 = await prisma.doctorNote.create({
    data: {
      visitId: visit1.id,
      doctorId: doctorProfile.id,
      symptoms: "Increased thirst, frequent urination",
      diagnosis: "Type 2 Diabetes Mellitus - controlled",
      prescription: JSON.stringify([
        { medication: "Metformin", dosage: "1000mg", frequency: "Twice daily" },
      ]),
      observations:
        "Patient compliant with medications. Weight stable. Blood glucose levels improving.",
      recommendations: "Continue current medications. Recheck HbA1c in 3 months. Increase physical activity.",
      vitals: JSON.stringify({
        bloodPressure: "130/85",
        temperature: "98.6°F",
        pulse: 72,
        respiration: 16,
      }),
      labResults: "Fasting glucose: 125 mg/dL, HbA1c: 6.8%",
    },
  });

  const note3 = await prisma.doctorNote.create({
    data: {
      visitId: visit3.id,
      doctorId: doctorProfile.id,
      symptoms: "None currently reported",
      diagnosis: "Type 2 Diabetes - stable",
      prescription: JSON.stringify([
        { medication: "Metformin", dosage: "1000mg", frequency: "Twice daily" },
      ]),
      observations:
        "All lab results within acceptable range. Patient educated on diet and exercise.",
      recommendations: "Schedule next visit in 3 months. Continue monitoring blood glucose at home.",
      vitals: JSON.stringify({
        bloodPressure: "128/84",
        temperature: "98.4°F",
        pulse: 70,
        respiration: 16,
      }),
      labResults: "Fasting glucose: 118 mg/dL, HbA1c: 6.5%",
    },
  });

  console.log("✓ Created 2 doctor notes");

  // ========================================
  // SUMMARY
  // ========================================
  console.log("\n✅ Database seeding completed successfully!\n");
  console.log("📊 Created Data Summary:");
  console.log(`   - Hospitals: 2`);
  console.log(`   - Users: 5 (1 Admin, 1 Doctor, 2 Patients, 1 Staff)`);
  console.log(`   - Doctor Profiles: 1`);
  console.log(`   - Patient Profiles: 2`);
  console.log(`   - Visits: 3 (2 Completed, 1 Scheduled)`);
  console.log(`   - Doctor Notes: 2`);
  console.log("\n🔐 Demo Credentials:");
  console.log(`   Admin:   admin@example.com / password123`);
  console.log(`   Doctor:  doctor@example.com / password123`);
  console.log(`   Patient: patient@example.com / password123`);
}

main()
  .catch((e) => {
    console.error("❌ Error during seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
