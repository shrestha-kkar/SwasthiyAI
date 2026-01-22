import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { DoctorNoteSchema } from '@/lib/doctor-schema';
import jwt from 'jsonwebtoken';

interface DecodedToken {
  userId: string;
  role: string;
  hospitalId: string;
}

export async function POST(request: NextRequest) {
  try {
    // Get token from cookie
    const token = request.cookies.get('auth_token')?.value;

    if (!token) {
      return NextResponse.json(
        { message: 'Unauthorized: No token provided' },
        { status: 401 }
      );
    }

    // Verify and decode token
    let decoded: DecodedToken;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret') as DecodedToken;
    } catch (error) {
      return NextResponse.json(
        { message: 'Unauthorized: Invalid token' },
        { status: 401 }
      );
    }

    // Verify user is a doctor
    if (decoded.role !== 'doctor') {
      return NextResponse.json(
        { message: 'Forbidden: Only doctors can submit notes' },
        { status: 403 }
      );
    }

    // Parse request body
    const body = await request.json();

    // Validate input
    const validatedData = DoctorNoteSchema.parse(body);

    // Verify visit exists and belongs to this doctor
    const visit = await prisma.visit.findUnique({
      where: { id: validatedData.visitId },
      include: { doctorNotes: true },
    });

    if (!visit) {
      return NextResponse.json(
        { message: 'Visit not found' },
        { status: 404 }
      );
    }

    if (visit.doctorId !== decoded.userId) {
      return NextResponse.json(
        { message: 'Forbidden: This visit does not belong to you' },
        { status: 403 }
      );
    }

    // Check if notes already exist for this visit
    if (visit.doctorNotes.length > 0) {
      // Update existing note
      const updatedNote = await prisma.doctorNote.update({
        where: { id: visit.doctorNotes[0].id },
        data: {
          symptoms: validatedData.symptoms,
          diagnosis: validatedData.diagnosis,
          prescription: validatedData.prescription,
          observations: validatedData.observations,
          recommendations: validatedData.recommendations,
          vitals: validatedData.vitals ? JSON.stringify(validatedData.vitals) : null,
          updatedAt: new Date(),
        },
      });

      return NextResponse.json(
        {
          success: true,
          message: 'Doctor notes updated successfully',
          data: updatedNote,
        },
        { status: 200 }
      );
    }

    // Create new doctor note
    const doctorNote = await prisma.doctorNote.create({
      data: {
        visitId: validatedData.visitId,
        doctorId: decoded.userId,
        symptoms: validatedData.symptoms,
        diagnosis: validatedData.diagnosis,
        prescription: validatedData.prescription,
        observations: validatedData.observations,
        recommendations: validatedData.recommendations,
        vitals: validatedData.vitals ? JSON.stringify(validatedData.vitals) : null,
      },
    });

    // Mark visit as completed
    await prisma.visit.update({
      where: { id: validatedData.visitId },
      data: {
        status: 'COMPLETED',
        completedAt: new Date(),
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Doctor notes saved successfully',
        data: doctorNote,
      },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { message: 'Invalid JSON in request body' },
        { status: 400 }
      );
    }

    if (error instanceof Error && error.message.includes('Validation error')) {
      return NextResponse.json(
        { message: 'Validation failed', errors: error.message },
        { status: 400 }
      );
    }

    console.error('Error saving doctor notes:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
