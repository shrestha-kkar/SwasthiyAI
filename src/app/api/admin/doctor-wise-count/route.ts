import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { prisma } from "@/lib/prisma";

interface DecodedToken {
  userId: string;
  role: string;
  iat: number;
}

interface DoctorPatientCount {
  doctorId: string;
  doctorName: string;
  specialization: string;
  totalPatients: number;
  scheduledVisits: number;
  completedVisits: number;
  noShowVisits: number;
}

export async function GET(request: NextRequest) {
  try {
    // Extract JWT token from cookies
    const token = request.cookies.get("auth_token")?.value;

    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // Verify and decode JWT
    let decoded: DecodedToken;
    try {
      decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || "your-secret"
      ) as DecodedToken;
    } catch {
      return NextResponse.json(
        { message: "Invalid or expired token" },
        { status: 401 }
      );
    }

    // Verify admin role
    if (decoded.role !== "admin" && decoded.role !== "ADMIN") {
      return NextResponse.json(
        { message: "Forbidden: Admin access required" },
        { status: 403 }
      );
    }

    // Get all doctors with their visit counts
    const doctors = await prisma.doctorProfile.findMany({
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
        visits: {
          select: {
            id: true,
            status: true,
            patientId: true,
          },
        },
      },
    });

    // Calculate aggregated counts for each doctor
    const doctorStats: DoctorPatientCount[] = doctors.map((doctor) => {
      const uniquePatientIds = new Set(
        doctor.visits.map((visit) => visit.patientId)
      );
      const scheduledCount = doctor.visits.filter(
        (v) => v.status === "SCHEDULED"
      ).length;
      const completedCount = doctor.visits.filter(
        (v) => v.status === "COMPLETED"
      ).length;
      const noShowCount = doctor.visits.filter(
        (v) => v.status === "NO_SHOW"
      ).length;

      return {
        doctorId: doctor.id,
        doctorName: doctor.user.name,
        specialization: doctor.specialization,
        totalPatients: uniquePatientIds.size,
        scheduledVisits: scheduledCount,
        completedVisits: completedCount,
        noShowVisits: noShowCount,
      };
    });

    // Sort by total patients (descending)
    doctorStats.sort((a, b) => b.totalPatients - a.totalPatients);

    // Calculate overall statistics
    const totalPatients = new Set(
      await prisma.visit
        .findMany({
          select: { patientId: true },
          distinct: ["patientId"],
        })
        .then((visits) => visits.map((v) => v.patientId))
    ).size;

    const totalVisits = await prisma.visit.count();

    return NextResponse.json({
      success: true,
      data: {
        doctorStats,
        summary: {
          totalDoctors: doctors.length,
          totalPatients,
          totalVisits,
          averagePatientsPerDoctor:
            doctors.length > 0
              ? (totalPatients / doctors.length).toFixed(2)
              : 0,
        },
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error("Error fetching doctor-wise patient count:", error);
    return NextResponse.json(
      { message: "Internal server error", error: String(error) },
      { status: 500 }
    );
  }
}
