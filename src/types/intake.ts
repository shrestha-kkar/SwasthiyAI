// Types for Patient Intake Form

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp?: string;
}

export interface PatientIntakeData {
  currentSymptoms: string[];
  symptomDuration: string;
  symptomSeverity: 'mild' | 'moderate' | 'severe';
  symptomTriggers: string[];
  medicalHistory: string[];
  currentMedications: Array<{
    name: string;
    dosage: string;
    frequency: string;
  }>;
  allergies: string[];
  recentIllnesses: string[];
  lifestyle: {
    exercise: string;
    diet: string;
    sleep: string;
    stress: string;
  };
  concerns: string;
  additionalInfo: string;
}

export interface IntakeAnalysisResponse {
  success: boolean;
  data?: PatientIntakeData;
  error?: string;
  summary?: string;
}

export interface IntakeFormResponse {
  id: string;
  patientId: string;
  hospitalId: string;
  chatHistory: ChatMessage[];
  structuredData: PatientIntakeData | null;
  isComplete: boolean;
  isReviewedByDoc: boolean;
  createdAt: string;
  updatedAt: string;
}
