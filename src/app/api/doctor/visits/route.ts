import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import jwt from 'jsonwebtoken';

interface DecodedToken {
  userId: string;
  role: string;
  hospitalId: string;
}

export async function GET(request: NextRequest) {
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
        { message: 'Forbidden: Only doctors can access this resource' },
        { status: 403 }
      );
    }

    // Get query parameters
    const { searchParams } = request.nextUrl;
    const status = searchParams.get('status');
    const limitParam = searchParams.get('limit');
    const offsetParam = searchParams.get('offset');

    const limit = limitParam ? Math.min(parseInt(limitParam), 100) : 20;
    const offset = offsetParam ? Math.max(parseInt(offsetParam), 0) : 0;

    // Build filter
    const filter: any = {
      doctorId: decoded.userId,
    };

    if (status && ['SCHEDULED', 'COMPLETED', 'CANCELLED', 'NO_SHOW'].includes(status)) {
      filter.status = status;
    }

    // Fetch visits with patient and intake data
    const [visits, total] = await Promise.all([
      prisma.visit.findMany({
        where: filter,
        include: {
          patient: {
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                },
              },
            },
          },
          doctorNotes: {
            orderBy: { createdAt: 'desc' },
            take: 1,
          },
        },
        orderBy: { scheduledDate: 'asc' },
        take: limit,
        skip: offset,
      }),
      prisma.visit.count({ where: filter }),
    ]);

    // Fetch patient intake data for summary
    const visitsWithIntake = await Promise.all(
      visits.map(async (visit) => {
        const intake = await prisma.patientIntake.findFirst({
          where: { patientId: visit.patientId },
          orderBy: { createdAt: 'desc' },
        });

        let structuredIntake = null;
        if (intake?.structuredData) {
          try {
            structuredIntake = JSON.parse(intake.structuredData);
          } catch (e) {
            console.error('Failed to parse structured data:', e);
          }
        }

        return {
          ...visit,
          patientIntake: structuredIntake,
        };
      })
    );

    return NextResponse.json({
      success: true,
      data: visitsWithIntake,
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + limit < total,
      },
    });
  } catch (error) {
    console.error('Error fetching visits:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
