import { NextRequest, NextResponse } from 'next/server';
import { verify } from 'jsonwebtoken';
import OpenAI from 'openai';
import { prisma } from '@/lib/prisma';
import {
  PatientIntakeDataSchema,
} from '@/lib/intake-schema';
import {
  INTAKE_SYSTEM_PROMPT,
  generateExtractionPrompt,
} from '@/lib/intake-prompt';
import { ChatMessage, PatientIntakeData } from '@/types/intake';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

if (!OPENAI_API_KEY) {
  console.error(
    'WARNING: OPENAI_API_KEY is not set. AI analysis will not work.'
  );
}

const getOpenAIClient = () => {
  if (!OPENAI_API_KEY) {
    return null;
  }
  return new OpenAI({ apiKey: OPENAI_API_KEY });
};

// POST - Analyze completed intake conversation with AI
export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.slice(7);
    const decoded = verify(token, JWT_SECRET) as any;
    const userId = decoded.id;

    const { intakeId } = await request.json();

    if (!intakeId) {
      return NextResponse.json(
        { error: 'Intake ID is required' },
        { status: 400 }
      );
    }

    // Verify intake belongs to authenticated user
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { patientProfile: true },
    });

    if (!user?.patientProfile) {
      return NextResponse.json(
        { error: 'Patient profile not found' },
        { status: 404 }
      );
    }

    const intake = await prisma.patientIntake.findUnique({
      where: { id: intakeId },
    });

    if (!intake || intake.patientId !== user.patientProfile.id) {
      return NextResponse.json(
        { error: 'Intake not found or access denied' },
        { status: 404 }
      );
    }

    // Parse chat history
    const chatHistory = JSON.parse(intake.chatHistory) as ChatMessage[];

    // Format conversation for analysis
    const conversationText = chatHistory
      .map((msg) => `${msg.role === 'user' ? 'Patient' : 'Assistant'}: ${msg.content}`)
      .join('\n\n');

    const openai = getOpenAIClient();
    if (!openai) {
      return NextResponse.json(
        {
          error: 'AI analysis is not configured. Please set OPENAI_API_KEY environment variable.',
        },
        { status: 500 }
      );
    }

    // Call OpenAI API with structured output
    const response = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [
        {
          role: 'system',
          content: INTAKE_SYSTEM_PROMPT,
        },
        {
          role: 'user',
          content: generateExtractionPrompt(conversationText),
        },
      ],
      temperature: 0.3, // Lower temperature for more consistent structure
      max_tokens: 2000,
    });

    const aiResponseText =
      response.choices[0]?.message?.content || '';

    // Parse the JSON response
    let structuredData: PatientIntakeData;
    try {
      // Try to extract JSON from the response
      const jsonMatch = aiResponseText.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No JSON found in response');
      }

      const parsedData = JSON.parse(jsonMatch[0]);

      // Validate against schema
      const validatedData = PatientIntakeDataSchema.parse(parsedData);
      structuredData = validatedData;
    } catch (parseError) {
      console.error('Failed to parse AI response:', parseError);
      // Return partial data if parsing fails
      structuredData = {
        currentSymptoms: [],
        symptomDuration: 'Not determined',
        symptomSeverity: 'mild',
        symptomTriggers: [],
        medicalHistory: [],
        currentMedications: [],
        allergies: [],
        recentIllnesses: [],
        lifestyle: {
          exercise: '',
          diet: '',
          sleep: '',
          stress: '',
        },
        concerns: 'See conversation for details',
        additionalInfo: aiResponseText,
      };
    }

    // Update intake with structured data and mark as complete
    await prisma.patientIntake.update({
      where: { id: intakeId },
      data: {
        structuredData: JSON.stringify(structuredData),
        isComplete: true,
      },
    });

    return NextResponse.json({
      success: true,
      data: structuredData,
      summary: `Intake form completed. ${structuredData.currentSymptoms.length} symptoms recorded, ${structuredData.currentMedications.length} medications listed.`,
    });
  } catch (error) {
    console.error('Intake analysis error:', error);
    return NextResponse.json(
      {
        error: 'Failed to analyze intake',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
