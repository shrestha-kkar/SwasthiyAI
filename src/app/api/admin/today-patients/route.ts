import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { prisma } from "@/lib/prisma";

interface DecodedToken {
  userId: string;
  role: string;
  iat: number;
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

    // Get today's date range
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Count visits scheduled for today (SCHEDULED, COMPLETED, NO_SHOW)
    const todayVisits = await prisma.visit.findMany({
      where: {
        scheduledDate: {
          gte: today,
          lt: tomorrow,
        },
        status: {
          in: ["SCHEDULED", "COMPLETED", "NO_SHOW"],
        },
      },
      include: {
        patient: {
          select: {
            user: {
              select: {
                name: true,
                email: true,
              },
            },
          },
        },
      },
    });

    // Count completed visits today
    const completedToday = todayVisits.filter(
      (v) => v.status === "COMPLETED"
    ).length;

    // Get unique patient count (in case a patient has multiple visits)
    const uniquePatientIds = new Set(todayVisits.map((v) => v.patientId));

    return NextResponse.json({
      success: true,
      data: {
        totalVisits: todayVisits.length,
        totalPatients: uniquePatientIds.size,
        completedVisits: completedToday,
        scheduledVisits: todayVisits.filter((v) => v.status === "SCHEDULED")
          .length,
        noShowVisits: todayVisits.filter((v) => v.status === "NO_SHOW").length,
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error("Error fetching today's patient count:", error);
    return NextResponse.json(
      { message: "Internal server error", error: String(error) },
      { status: 500 }
    );
  }
}
