'use client';

import { useState } from 'react';
import { DoctorNoteInput } from '@/lib/doctor-schema';

interface PatientCardProps {
  visitId: string;
  patientName: string;
  patientEmail: string;
  reason: string;
  scheduledDate: string;
  patientIntake?: {
    currentSymptoms?: string[];
    symptomDuration?: string;
    symptomSeverity?: string;
    medicalHistory?: string[];
    allergies?: string[];
  };
  existingNotes?: {
    symptoms: string;
    diagnosis?: string;
    observations: string;
  };
  onSubmitNotes: (data: DoctorNoteInput) => Promise<void>;
  isLoading?: boolean;
  isEditing?: boolean;
}

export function PatientCard({
  visitId,
  patientName,
  patientEmail,
  reason,
  scheduledDate,
  patientIntake,
  existingNotes,
  onSubmitNotes,
  isLoading = false,
  isEditing = false,
}: PatientCardProps) {
  const [showForm, setShowForm] = useState(isEditing);
  const [formData, setFormData] = useState<DoctorNoteInput>({
    visitId,
    symptoms: existingNotes?.symptoms || patientIntake?.currentSymptoms?.join(', ') || '',
    diagnosis: existingNotes?.diagnosis || '',
    prescription: '',
    observations: existingNotes?.observations || '',
    recommendations: '',
  });
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    try {
      await onSubmitNotes(formData);
      setSuccess(true);
      setShowForm(false);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save notes');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{patientName}</h3>
          <p className="text-sm text-gray-500">{patientEmail}</p>
        </div>
        <div className="text-right">
          <p className="text-sm font-medium text-blue-600">{reason}</p>
          <p className="text-xs text-gray-500">{formatDate(scheduledDate)}</p>
        </div>
      </div>

      {/* AI-Generated Summary */}
      <div className="bg-blue-50 rounded-lg p-4 mb-4 border border-blue-200">
        <h4 className="text-sm font-semibold text-blue-900 mb-3">
          🤖 AI-Generated Summary
        </h4>
        <div className="space-y-2 text-sm text-gray-700">
          {patientIntake?.currentSymptoms && patientIntake.currentSymptoms.length > 0 && (
            <div>
              <span className="font-medium">Symptoms:</span>{' '}
              {patientIntake.currentSymptoms.join(', ')}
            </div>
          )}
          {patientIntake?.symptomDuration && (
            <div>
              <span className="font-medium">Duration:</span> {patientIntake.symptomDuration}
            </div>
          )}
          {patientIntake?.symptomSeverity && (
            <div>
              <span className="font-medium">Severity:</span>{' '}
              <span className="capitalize">{patientIntake.symptomSeverity}</span>
            </div>
          )}
          {patientIntake?.medicalHistory && patientIntake.medicalHistory.length > 0 && (
            <div>
              <span className="font-medium">Medical History:</span>{' '}
              {patientIntake.medicalHistory.join(', ')}
            </div>
          )}
          {patientIntake?.allergies && patientIntake.allergies.length > 0 && (
            <div className="text-amber-700 font-medium bg-amber-50 p-2 rounded">
              ⚠️ Allergies: {patientIntake.allergies.join(', ')}
            </div>
          )}
        </div>
      </div>

      {/* Existing Notes Display or Form */}
      {!showForm && existingNotes ? (
        <div className="bg-green-50 rounded-lg p-4 mb-4 border border-green-200">
          <div className="flex justify-between items-start mb-2">
            <h4 className="font-semibold text-green-900">✓ Notes Saved</h4>
            <button
              onClick={() => setShowForm(true)}
              className="text-sm text-green-700 hover:text-green-900 underline"
            >
              Edit
            </button>
          </div>
          <div className="space-y-2 text-sm text-gray-700">
            <div>
              <span className="font-medium">Diagnosis:</span> {existingNotes.diagnosis || 'Not provided'}
            </div>
            <div>
              <span className="font-medium">Observations:</span> {existingNotes.observations}
            </div>
          </div>
        </div>
      ) : !showForm ? (
        <button
          onClick={() => setShowForm(true)}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition"
        >
          Add Diagnosis & Notes
        </button>
      ) : null}

      {/* Form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="space-y-4 bg-gray-50 p-4 rounded-lg">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}
          {success && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">
              ✓ Notes saved successfully
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Symptoms Observed
            </label>
            <textarea
              value={formData.symptoms}
              onChange={(e) =>
                setFormData({ ...formData, symptoms: e.target.value })
              }
              placeholder="Describe the patient's symptoms..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={3}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Diagnosis *
            </label>
            <input
              type="text"
              value={formData.diagnosis}
              onChange={(e) =>
                setFormData({ ...formData, diagnosis: e.target.value })
              }
              placeholder="Enter your diagnosis..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Prescription (Optional)
            </label>
            <textarea
              value={formData.prescription}
              onChange={(e) =>
                setFormData({ ...formData, prescription: e.target.value })
              }
              placeholder="Prescribed medications..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={2}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Observations & Clinical Findings *
            </label>
            <textarea
              value={formData.observations}
              onChange={(e) =>
                setFormData({ ...formData, observations: e.target.value })
              }
              placeholder="Detailed clinical observations..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={3}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Recommendations (Optional)
            </label>
            <textarea
              value={formData.recommendations}
              onChange={(e) =>
                setFormData({ ...formData, recommendations: e.target.value })
              }
              placeholder="Follow-up recommendations, lifestyle changes, etc..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={2}
            />
          </div>

          <div className="flex gap-2 pt-2">
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-2 px-4 rounded-lg transition"
            >
              {isLoading ? 'Saving...' : 'Save Notes'}
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-900 font-medium py-2 px-4 rounded-lg transition"
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
