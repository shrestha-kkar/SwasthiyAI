import { z } from 'zod';

// Zod schema for validating intake form data
export const PatientIntakeDataSchema = z.object({
  currentSymptoms: z.array(z.string()).min(1, 'At least one symptom is required'),
  symptomDuration: z.string().min(1, 'Duration is required'),
  symptomSeverity: z.enum(['mild', 'moderate', 'severe']),
  symptomTriggers: z.array(z.string()).default([]),
  medicalHistory: z.array(z.string()).default([]),
  currentMedications: z.array(
    z.object({
      name: z.string().min(1),
      dosage: z.string().min(1),
      frequency: z.string().min(1),
    })
  ).default([]),
  allergies: z.array(z.string()).default([]),
  recentIllnesses: z.array(z.string()).default([]),
  lifestyle: z.object({
    exercise: z.string().default(''),
    diet: z.string().default(''),
    sleep: z.string().default(''),
    stress: z.string().default(''),
  }).default({}),
  concerns: z.string().default(''),
  additionalInfo: z.string().default(''),
});

export type PatientIntakeDataType = z.infer<typeof PatientIntakeDataSchema>;

// JSON Schema for AI model (OpenAI format)
export const INTAKE_JSON_SCHEMA = {
  type: 'object',
  properties: {
    currentSymptoms: {
      type: 'array',
      items: { type: 'string' },
      description: 'List of current symptoms the patient is experiencing',
    },
    symptomDuration: {
      type: 'string',
      description: 'How long the patient has had these symptoms (e.g., "3 days", "2 weeks")',
    },
    symptomSeverity: {
      type: 'string',
      enum: ['mild', 'moderate', 'severe'],
      description: 'Severity of symptoms',
    },
    symptomTriggers: {
      type: 'array',
      items: { type: 'string' },
      description: 'What triggers or worsens the symptoms',
    },
    medicalHistory: {
      type: 'array',
      items: { type: 'string' },
      description: 'Relevant past medical conditions and treatments',
    },
    currentMedications: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          name: { type: 'string' },
          dosage: { type: 'string' },
          frequency: { type: 'string' },
        },
        required: ['name', 'dosage', 'frequency'],
      },
      description: 'Current medications patient is taking',
    },
    allergies: {
      type: 'array',
      items: { type: 'string' },
      description: 'Known allergies (medications, food, environmental)',
    },
    recentIllnesses: {
      type: 'array',
      items: { type: 'string' },
      description: 'Recent illnesses or infections',
    },
    lifestyle: {
      type: 'object',
      properties: {
        exercise: { type: 'string', description: 'Exercise habits and frequency' },
        diet: { type: 'string', description: 'Diet and nutrition habits' },
        sleep: { type: 'string', description: 'Sleep patterns and hours per night' },
        stress: { type: 'string', description: 'Stress levels and sources' },
      },
    },
    concerns: {
      type: 'string',
      description: 'Main concerns or reasons for the visit',
    },
    additionalInfo: {
      type: 'string',
      description: 'Any additional information the patient wants to share',
    },
  },
  required: ['currentSymptoms', 'symptomDuration', 'symptomSeverity'],
};
