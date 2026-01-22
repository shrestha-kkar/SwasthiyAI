"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { UserRole } from "@/types/index";
import { useEffect, useState } from "react";
import { PatientCard } from "@/components/PatientCard";
import { DoctorNoteInput } from "@/lib/doctor-schema";

// SVG Icons
const CalendarCheckIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
  </svg>
);

const InfoIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const AlertIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4v.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const CheckCircleIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const LoadingIcon = () => (
  <svg className="w-6 h-6 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
  </svg>
);

interface PatientAppointment {
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

export default function DoctorAppointmentsPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [appointments, setAppointments] = useState<PatientAppointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!isLoading && user?.role !== UserRole.DOCTOR) {
      router.push("/dashboard");
    }
  }, [user, isLoading, router]);

  useEffect(() => {
    if (user?.role === UserRole.DOCTOR) {
      fetchAppointments();
    }
  }, [user]);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(`/api/doctor/visits?status=SCHEDULED&limit=100`, {
        method: "GET",
        credentials: "include",
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Failed to fetch appointments");
      }

      const data = await response.json();
      setAppointments(data.data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitNotes = async (noteData: DoctorNoteInput) => {
    try {
      setSubmitting(true);

      const response = await fetch("/api/doctor/notes", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(noteData),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Failed to save notes");
      }

      // Refresh appointments
      await fetchAppointments();
    } catch (err) {
      throw err;
    } finally {
      setSubmitting(false);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-8">
      {/* Hero Header */}
      <div className="bg-white rounded-xl border border-gray-200 p-8 shadow-sm">
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 bg-gradient-to-br from-blue-100 to-blue-50 rounded-lg flex items-center justify-center text-blue-600">
            <CalendarCheckIcon />
          </div>
          <div>
            <h1 className="text-4xl font-bold text-gray-900">Appointments</h1>
            <p className="text-gray-600 mt-2">View and manage your upcoming patient visits</p>
          </div>
        </div>
      </div>

      {/* Quick Tips */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-7 shadow-sm">
        <div className="flex gap-4">
          <div className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5">
            <InfoIcon />
          </div>
          <div>
            <p className="text-sm font-semibold text-blue-900 mb-2">Consultation Notes</p>
            <p className="text-sm text-blue-800">Click "Add Diagnosis & Notes" to record your clinical observations and treatment plan for each patient.</p>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-white border border-red-200 text-red-800 px-5 py-4 rounded-xl font-medium flex items-center gap-3 shadow-sm">
          <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
            <AlertIcon />
          </div>
          {error}
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center py-20">
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 mx-auto mb-4">
              <LoadingIcon />
            </div>
            <p className="text-gray-600 font-medium">Loading your appointments...</p>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!loading && appointments.length === 0 && (
        <div className="bg-white rounded-xl p-12 text-center border border-gray-200 shadow-sm">
          <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <p className="text-gray-900 text-lg font-semibold mb-2">No upcoming appointments</p>
          <p className="text-gray-600 max-w-sm mx-auto">You have no scheduled appointments at the moment. Enjoy your free time!</p>
        </div>
      )}

      {/* Appointments List */}
      {!loading && appointments.length > 0 && (
        <div className="space-y-4">
          <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
            {appointments.length} {appointments.length === 1 ? 'Appointment' : 'Appointments'} Scheduled
          </p>
          {appointments.map((appointment) => (
            <PatientCard
              key={appointment.id}
              visitId={appointment.id}
              patientName={appointment.patient.user.name}
              patientEmail={appointment.patient.user.email}
              reason={appointment.reason}
              scheduledDate={appointment.scheduledDate}
              patientIntake={appointment.patientIntake}
              existingNotes={
                appointment.doctorNotes.length > 0
                  ? appointment.doctorNotes[0]
                  : undefined
              }
              onSubmitNotes={handleSubmitNotes}
              isLoading={submitting}
            />
          ))}
        </div>
      )}

      {/* Refresh Button */}
      {!loading && appointments.length > 0 && (
        <div className="flex justify-center pt-6">
          <button
            onClick={fetchAppointments}
            className="px-6 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition shadow-sm"
          >
            Refresh Appointments
          </button>
        </div>
      )}
    </div>
  );
}
