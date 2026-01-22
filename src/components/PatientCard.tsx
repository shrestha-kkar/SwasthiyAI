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
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-premium transition-shadow duration-300">
      {/* Header */}
      <div className="p-6 border-b border-slate-100 flex justify-between items-start bg-slate-50/50">
        <div className="flex gap-4">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center text-primary-700 font-bold text-lg border border-primary-100">
            {patientName.charAt(0)}
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">{patientName}</h3>
            <p className="text-sm text-slate-500">{patientEmail}</p>
          </div>
        </div>
        <div className="text-right">
          <span className="inline-block px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-semibold mb-1">
            {reason}
          </span>
          <p className="text-xs font-medium text-slate-400">{formatDate(scheduledDate)}</p>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* AI-Generated Summary */}
        <div className="bg-gradient-to-br from-violet-50 to-indigo-50 rounded-xl p-5 border border-indigo-100 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-5">
            <svg className="w-24 h-24" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2a10 10 0 1010 10A10 10 0 0012 2zm0 18a8 8 0 118-8 8 8 0 01-8 8z" /></svg>
          </div>
          <h4 className="flex items-center gap-2 text-sm font-bold text-indigo-900 mb-4 tracking-wide uppercase">
            <span className="text-lg">✨</span> AI Clinical Summary
          </h4>
          <div className="grid md:grid-cols-2 gap-4 text-sm relative z-10">
            {patientIntake?.currentSymptoms?.length ? (
              <div className="bg-white/60 p-3 rounded-lg backdrop-blur-sm">
                <span className="block text-xs font-bold text-indigo-400 uppercase mb-1">Symptoms</span>
                <span className="text-slate-700 font-medium">{patientIntake.currentSymptoms.join(', ')}</span>
              </div>
            ) : null}

            {patientIntake?.symptomDuration && (
              <div className="bg-white/60 p-3 rounded-lg backdrop-blur-sm">
                <span className="block text-xs font-bold text-indigo-400 uppercase mb-1">Duration</span>
                <span className="text-slate-700 font-medium">{patientIntake.symptomDuration}</span>
              </div>
            )}

            {patientIntake?.symptomSeverity && (
              <div className="bg-white/60 p-3 rounded-lg backdrop-blur-sm">
                <span className="block text-xs font-bold text-indigo-400 uppercase mb-1">Severity</span>
                <span className="text-slate-700 font-medium capitalize">{patientIntake.symptomSeverity}</span>
              </div>
            )}

            {patientIntake?.medicalHistory?.length ? (
              <div className="bg-white/60 p-3 rounded-lg backdrop-blur-sm">
                <span className="block text-xs font-bold text-indigo-400 uppercase mb-1">History</span>
                <span className="text-slate-700 font-medium">{patientIntake.medicalHistory.join(', ')}</span>
              </div>
            ) : null}
          </div>

          {patientIntake?.allergies?.length ? (
            <div className="mt-4 flex items-center gap-2 text-amber-700 bg-amber-50 p-3 rounded-lg border border-amber-100">
              <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
              <span className="font-semibold text-sm">Allergies: {patientIntake.allergies.join(', ')}</span>
            </div>
          ) : null}
        </div>

        {/* Existing Notes Display or Form */}
        {!showForm && existingNotes ? (
          <div className="bg-emerald-50 rounded-xl p-5 border border-emerald-100">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-2 text-emerald-800">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                <h4 className="font-bold">Doctor's Notes</h4>
              </div>
              <button
                onClick={() => setShowForm(true)}
                className="text-xs font-bold text-emerald-700 hover:text-emerald-900 bg-emerald-100 hover:bg-emerald-200 px-3 py-1.5 rounded-lg transition-colors"
              >
                Edit Notes
              </button>
            </div>
            <div className="space-y-4 text-sm">
              <div>
                <span className="block text-xs font-bold text-emerald-600 uppercase mb-1">Diagnosis</span>
                <p className="text-emerald-900 bg-white/50 p-2 rounded-lg">{existingNotes.diagnosis || 'Not provided'}</p>
              </div>
              <div>
                <span className="block text-xs font-bold text-emerald-600 uppercase mb-1">Observations</span>
                <p className="text-emerald-900 bg-white/50 p-2 rounded-lg">{existingNotes.observations}</p>
              </div>
            </div>
          </div>
        ) : !showForm ? (
          <button
            onClick={() => setShowForm(true)}
            className="w-full btn-primary flex justify-center items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
            Add Diagnosis & Notes
          </button>
        ) : null}

        {/* Form */}
        {showForm && (
          <form onSubmit={handleSubmit} className="bg-slate-50 p-6 rounded-xl border border-slate-200 animate-fade-in-up">
            <h4 className="font-bold text-slate-900 mb-6 flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-primary-100 text-primary-600 flex items-center justify-center">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
              </span>
              Edit Consultation Notes
            </h4>

            {error && (
              <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                {error}
              </div>
            )}
            {success && (
              <div className="mb-4 bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 rounded-lg text-sm flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                Notes saved successfully
              </div>
            )}

            <div className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Symptoms Observed</label>
                <textarea
                  value={formData.symptoms}
                  onChange={(e) => setFormData({ ...formData, symptoms: e.target.value })}
                  placeholder="Describe the patient's symptoms..."
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-shadow text-sm"
                  rows={3}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Diagnosis *</label>
                <input
                  type="text"
                  value={formData.diagnosis}
                  onChange={(e) => setFormData({ ...formData, diagnosis: e.target.value })}
                  placeholder="Enter your diagnosis..."
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-shadow text-sm font-medium"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Prescription (Optional)</label>
                <textarea
                  value={formData.prescription}
                  onChange={(e) => setFormData({ ...formData, prescription: e.target.value })}
                  placeholder="Prescribed medications..."
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-shadow text-sm"
                  rows={2}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Observations & Clinical Findings *</label>
                <textarea
                  value={formData.observations}
                  onChange={(e) => setFormData({ ...formData, observations: e.target.value })}
                  placeholder="Detailed clinical observations..."
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-shadow text-sm"
                  rows={3}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Recommendations (Optional)</label>
                <textarea
                  value={formData.recommendations}
                  onChange={(e) => setFormData({ ...formData, recommendations: e.target.value })}
                  placeholder="Follow-up recommendations, lifestyle changes, etc..."
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-shadow text-sm"
                  rows={2}
                />
              </div>
            </div>

            <div className="flex gap-3 pt-6 border-t border-slate-200 mt-6">
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Saving...' : 'Save Notes'}
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="flex-1 btn-secondary"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
