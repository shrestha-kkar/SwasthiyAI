"use client";

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { UserRole } from '@/types/index';
import { PatientCard } from '@/components/PatientCard';
import { StatsCard } from '@/components/StatsCard';
import { DoctorNoteInput } from '@/lib/doctor-schema';

interface Visit {
  id: string;
  patientId: string;
  reason: string;
  scheduledDate: string;
  status: string;
  patient: {
    user: {
      id: string;
      name: string;
      email: string;
    };
  };
  doctorNotes: Array<{
    symptoms: string;
    diagnosis?: string;
    observations: string;
  }>;
  patientIntake?: {
    currentSymptoms?: string[];
    symptomDuration?: string;
    symptomSeverity?: string;
    medicalHistory?: string[];
    allergies?: string[];
  };
}

export default function DoctorPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [visits, setVisits] = useState<Visit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [filter, setFilter] = useState<'SCHEDULED' | 'COMPLETED' | 'ALL'>('SCHEDULED');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!isLoading && user?.role !== UserRole.DOCTOR) {
      router.push('/dashboard');
    }
  }, [user, isLoading, router]);

  useEffect(() => {
    if (user?.role === UserRole.DOCTOR) {
      fetchVisits();
    }
  }, [user, filter]);

  const fetchVisits = async () => {
    try {
      setLoading(true);
      setError('');

      const params = new URLSearchParams();
      if (filter !== 'ALL') {
        params.append('status', filter);
      }
      params.append('limit', '50');

      const response = await fetch(`/api/doctor/visits?${params}`, {
        method: 'GET',
        credentials: 'include',
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to fetch visits');
      }

      const data = await response.json();
      setVisits(data.data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitNotes = async (noteData: DoctorNoteInput) => {
    try {
      setSubmitting(true);

      const response = await fetch('/api/doctor/notes', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(noteData),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to save notes');
      }

      // Refresh visits list
      await fetchVisits();
    } catch (err) {
      throw err;
    } finally {
      setSubmitting(false);
    }
  };

  if (isLoading) {
    return <div className="text-center py-12 text-slate-500">Loading workspace...</div>;
  }

  const filteredVisits = visits.filter((visit) => {
    if (filter === 'ALL') return true;
    return visit.status === filter;
  });

  const stats = {
    scheduled: visits.filter((v) => v.status === 'SCHEDULED').length,
    completed: visits.filter((v) => v.status === 'COMPLETED').length,
    total: visits.length,
  };

  return (
    <div className="space-y-8 animate-fade-in-up">
      {/* Hero Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold font-heading text-slate-900">Patient Visits</h2>
          <p className="text-slate-500 mt-1">Manage appointments and clinical notes</p>
        </div>
        <button
          onClick={fetchVisits}
          className="self-start md:self-auto btn-secondary flex items-center gap-2 text-sm px-4 py-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
          Refresh Data
        </button>
      </div>

      {/* Performance Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatsCard
          title="Scheduled"
          value={stats.scheduled}
          variant="default"
          icon={<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>}
          description="Upcoming appointments"
        />
        <StatsCard
          title="Completed"
          value={stats.completed}
          variant="success"
          icon={<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>}
          description="Finished consultations"
        />
        <StatsCard
          title="Total Visits"
          value={stats.total}
          variant="info"
          icon={<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.856-1.487M15 10h.01M11 10h.01M7 10h.01M3 20h18a2 2 0 002-2V6a2 2 0 00-2-2H3a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>}
          description="All time records"
        />
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1 p-1 bg-slate-100/80 rounded-xl w-fit">
        {[
          { id: 'SCHEDULED', label: 'Scheduled' },
          { id: 'COMPLETED', label: 'Completed' },
          { id: 'ALL', label: 'All Visits' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFilter(tab.id as any)}
            className={`px-6 py-2 rounded-lg font-medium text-sm transition-all duration-200 ${filter === tab.id
                ? 'bg-white text-primary-700 shadow-sm'
                : 'text-slate-500 hover:text-slate-700 hover:bg-white/50'
              }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-5 py-4 rounded-xl font-medium flex items-start gap-3">
          <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4v.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>{error}</div>
        </div>
      )}

      {/* Content Area */}
      <div className="space-y-6">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-slate-100 shadow-sm">
            <div className="inline-block animate-spin rounded-full h-10 w-10 border-b-2 border-primary-600 mb-4"></div>
            <p className="text-slate-500 font-medium">Loading visits data...</p>
          </div>
        ) : filteredVisits.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 border-dashed p-16 text-center">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-slate-900 font-bold text-lg mb-1">No visits found</h3>
            <p className="text-slate-500 text-sm">
              {filter === 'SCHEDULED' ? 'You have no upcoming appointments.' : 'No completed visits in the records.'}
            </p>
          </div>
        ) : (
          <div className="grid gap-6">
            <div className="flex justify-between items-center px-2">
              <p className="text-sm font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-full uppercase tracking-wider text-xs">
                Showing {filteredVisits.length} {filteredVisits.length === 1 ? 'Visit' : 'Visits'}
              </p>
            </div>
            {filteredVisits.map((visit) => (
              <PatientCard
                key={visit.id}
                visitId={visit.id}
                patientName={visit.patient.user.name}
                patientEmail={visit.patient.user.email}
                reason={visit.reason}
                scheduledDate={visit.scheduledDate}
                patientIntake={visit.patientIntake}
                existingNotes={visit.doctorNotes?.[0]}
                onSubmitNotes={handleSubmitNotes}
                isLoading={submitting}
                isEditing={false}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
