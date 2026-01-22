import { z } from 'zod';

// Schema for doctor notes and diagnosis
export const DoctorNoteSchema = z.object({
  visitId: z.string().cuid('Invalid visit ID'),
  symptoms: z.string().min(10, 'Symptoms description must be at least 10 characters').max(1000),
  diagnosis: z.string().min(5, 'Diagnosis must be at least 5 characters').max(500),
  prescription: z.string().optional().default(''),
  observations: z.string().min(10, 'Observations must be at least 10 characters').max(2000),
  recommendations: z.string().optional().default(''),
  vitals: z.object({
    bloodPressure: z.string().optional().default(''),
    temperature: z.number().optional(),
    pulse: z.number().optional(),
    respiration: z.number().optional(),
  }).optional(),
});

export type DoctorNoteInput = z.infer<typeof DoctorNoteSchema>;

// Schema for fetching doctor's visits with filters
export const DoctorVisitFilterSchema = z.object({
  status: z.enum(['SCHEDULED', 'COMPLETED', 'CANCELLED', 'NO_SHOW']).optional(),
  limit: z.number().int().min(1).max(100).default(20),
  offset: z.number().int().min(0).default(0),
});

export type DoctorVisitFilter = z.infer<typeof DoctorVisitFilterSchema>;

// Schema for updating visit status
export const UpdateVisitStatusSchema = z.object({
  visitId: z.string().cuid('Invalid visit ID'),
  status: z.enum(['SCHEDULED', 'COMPLETED', 'CANCELLED', 'NO_SHOW']),
});

export type UpdateVisitStatus = z.infer<typeof UpdateVisitStatusSchema>;
