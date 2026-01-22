import { NextRequest, NextResponse } from "next/server";
import { verify } from "jsonwebtoken";
import { prisma } from "@/lib/prisma";
import { ChatMessage, PatientIntakeData } from "@/types/intake";

// 🔒 REQUIRED for Prisma + JWT + Vercel
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

// GET - Retrieve existing intake or create new one
export async function GET(request: NextRequest) {
  try {
    const JWT_SECRET = process.env.JWT_SECRET;
    if (!JWT_SECRET) {
      return NextResponse.json(
        { error: "Server misconfiguration" },
        { status: 500 }
      );
    }

    const authHeader = request.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.slice(7);
    const decoded = verify(token, JWT_SECRET) as { id: string };
    const userId = decoded.id;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { patientProfile: true },
    });

    if (!user?.patientProfile) {
      return NextResponse.json(
        { error: "Patient profile not found" },
        { status: 404 }
      );
    }

    const patientId = user.patientProfile.id;
    const hospitalId = user.hospitalId;

    let intake = await prisma.patientIntake.findFirst({
      where: {
        patientId,
        hospitalId,
        isComplete: false,
      },
    });

    if (!intake) {
      intake = await prisma.patientIntake.create({
        data: {
          patientId,
          hospitalId,
          chatHistory: JSON.stringify([
            {
              role: "assistant",
              content:
                "Hello! I'm here to help gather your medical information for the doctor. What brings you in today?",
              timestamp: new Date().toISOString(),
            },
          ]),
        },
      });
    }

    const chatHistory = JSON.parse(intake.chatHistory) as ChatMessage[];
    const structuredData = intake.structuredData
      ? (JSON.parse(intake.structuredData) as PatientIntakeData)
      : null;

    return NextResponse.json({
      id: intake.id,
      chatHistory,
      structuredData,
      isComplete: intake.isComplete,
    });
  } catch (error) {
    console.error("Intake GET error:", error);
    return NextResponse.json(
      { error: "Failed to retrieve intake form" },
      { status: 500 }
    );
  }
}

// POST - Save chat message and generate AI response
export async function POST(request: NextRequest) {
  try {
    const JWT_SECRET = process.env.JWT_SECRET;
    if (!JWT_SECRET) {
      return NextResponse.json(
        { error: "Server misconfiguration" },
        { status: 500 }
      );
    }

    const authHeader = request.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.slice(7);
    const decoded = verify(token, JWT_SECRET) as { id: string };
    const userId = decoded.id;

    const { intakeId, message } = await request.json();

    if (!message?.trim()) {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { patientProfile: true },
    });

    if (!user?.patientProfile) {
      return NextResponse.json(
        { error: "Patient profile not found" },
        { status: 404 }
      );
    }

    const intake = await prisma.patientIntake.findUnique({
      where: { id: intakeId },
    });

    if (!intake || intake.patientId !== user.patientProfile.id) {
      return NextResponse.json(
        { error: "Intake not found or access denied" },
        { status: 404 }
      );
    }

    if (intake.isComplete) {
      return NextResponse.json(
        { error: "This intake form is already completed" },
        { status: 400 }
      );
    }

    const chatHistory = JSON.parse(intake.chatHistory) as ChatMessage[];

    chatHistory.push({
      role: "user",
      content: message.trim(),
      timestamp: new Date().toISOString(),
    });

    // Placeholder AI response (safe at runtime)
    const aiResponse =
      "Thank you for sharing that. Can you tell me more about when these symptoms started?";

    chatHistory.push({
      role: "assistant",
      content: aiResponse,
      timestamp: new Date().toISOString(),
    });

    await prisma.patientIntake.update({
      where: { id: intakeId },
      data: {
        chatHistory: JSON.stringify(chatHistory),
      },
    });

    return NextResponse.json({
      message: aiResponse,
      chatHistory,
    });
  } catch (error) {
    console.error("Intake POST error:", error);
    return NextResponse.json(
      { error: "Failed to save message" },
      { status: 500 }
    );
  }
}
