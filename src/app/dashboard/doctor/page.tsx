"use client";

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { UserRole } from '@/types/index';
import { PatientCard } from '@/components/PatientCard';
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
    return <div className="text-center py-12">Loading...</div>;
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
    <div className="space-y-8">
      {/* Hero Header */}
      <div className="bg-white rounded-xl border border-gray-200 p-8 shadow-sm">
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 bg-gradient-to-br from-blue-100 to-blue-50 rounded-lg flex items-center justify-center text-blue-600">
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
            </svg>
          </div>
          <div>
            <h1 className="text-4xl font-bold text-gray-900">Doctor Dashboard</h1>
            <p className="text-gray-600 mt-2">Manage your patient appointments and consultations</p>
          </div>
        </div>
      </div>

      {/* Performance Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-7 shadow-sm hover:shadow-md transition">
          <div className="flex items-start justify-between mb-5">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">Upcoming</span>
          </div>
          <p className="text-sm font-medium text-gray-600 mb-2">Scheduled Visits</p>
          <p className="text-3xl font-bold text-gray-900">{stats.scheduled}</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-7 shadow-sm hover:shadow-md transition">
          <div className="flex items-start justify-between mb-5">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center text-green-600">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <span className="text-xs font-semibold text-green-600 bg-green-50 px-3 py-1 rounded-full">Completed</span>
          </div>
          <p className="text-sm font-medium text-gray-600 mb-2">Completed Visits</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{stats.completed}</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 hover:shadow-md transition">
          <div className="flex items-start justify-between mb-4">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center text-purple-600">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.856-1.487M15 10h.01M11 10h.01M7 10h.01M3 20h18a2 2 0 002-2V6a2 2 0 00-2-2H3a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
          <p className="text-sm text-gray-600">Total Visits</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{stats.total}</p>
        </div>
      </div>

      {/* Filter Buttons */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setFilter('SCHEDULED')}
          className={`px-4 py-2 rounded-lg font-medium transition text-sm ${
            filter === 'SCHEDULED'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'bg-white border border-gray-200 text-gray-700 hover:border-gray-300'
          }`}
        >
          Scheduled
        </button>
        <button
          onClick={() => setFilter('COMPLETED')}
          className={`px-4 py-2 rounded-lg font-medium transition text-sm ${
            filter === 'COMPLETED'
              ? 'bg-green-600 text-white shadow-sm'
              : 'bg-white border border-gray-200 text-gray-700 hover:border-gray-300'
          }`}
        >
          Completed
        </button>
        <button
          onClick={() => setFilter('ALL')}
          className={`px-4 py-2 rounded-lg font-medium transition text-sm ${
            filter === 'ALL'
              ? 'bg-purple-600 text-white shadow-sm'
              : 'bg-white border border-gray-200 text-gray-700 hover:border-gray-300'
          }`}
        >
          All Visits
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-5 py-4 rounded-lg font-medium flex items-start gap-3">
          <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4v.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>{error}</div>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center py-12">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mb-4"></div>
            <p className="text-gray-600 font-medium">Loading your visits...</p>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!loading && filteredVisits.length === 0 && (
        <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
          <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
          </svg>
          <p className="text-gray-900 font-semibold text-lg">No {filter.toLowerCase()} visits</p>
          <p className="text-gray-600 text-sm mt-1">
            {filter === 'SCHEDULED'
              ? 'You have no scheduled visits at the moment.'
              : filter === 'COMPLETED'
              ? 'You have no completed visits yet.'
              : 'You have no visits yet.'}
          </p>
        </div>
      )}

      {/* Patient Cards */}
      {!loading && filteredVisits.length > 0 && (
        <div className="space-y-4">
          <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
            {filteredVisits.length} {filteredVisits.length === 1 ? 'Visit' : 'Visits'} Found
          </p>
          {filteredVisits.map((visit) => (
            <PatientCard
              key={visit.id}
              visitId={visit.id}
              patientName={visit.patient.user.name}
              patientEmail={visit.patient.user.email}
              reason={visit.reason}
              scheduledDate={visit.scheduledDate}
              patientIntake={visit.patientIntake}
              existingNotes={
                visit.doctorNotes.length > 0 ? visit.doctorNotes[0] : undefined
              }
              onSubmitNotes={handleSubmitNotes}
              isLoading={submitting}
              isEditing={false}
            />
          ))}
        </div>
      )}

      {/* Refresh Button */}
      {!loading && filteredVisits.length > 0 && (
        <div className="flex justify-center pt-6">
          <button
            onClick={fetchVisits}
            className="px-6 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition shadow-sm"
          >
            Refresh Visits
          </button>
        </div>
      )}
    </div>
  );
}
