"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { UserRole } from "@/types/index";
import { useEffect } from "react";

// SVG Icons
const CalendarIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

const DoctorIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h-2m0 0H10m2 0v2m0-2v-2m7.07 2a9 9 0 11-18.14 0 9 9 0 0118.14 0z" />
  </svg>
);

const CheckIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const ClockIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 2m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const PlusIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
  </svg>
);

export default function PatientAppointmentsPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && user?.role !== UserRole.PATIENT) {
      router.push("/dashboard");
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-8">
      {/* Hero Header */}
      <div className="bg-white rounded-xl border border-gray-200 p-8 shadow-sm">
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 bg-gradient-to-br from-blue-100 to-blue-50 rounded-lg flex items-center justify-center text-blue-600">
            <CalendarIcon />
          </div>
          <div>
            <h1 className="text-4xl font-bold text-gray-900">My Appointments</h1>
            <p className="text-gray-600 mt-2">Schedule and manage your healthcare visits</p>
          </div>
        </div>
      </div>

      {/* Appointments List */}
      <div className="space-y-5">
        <p className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Scheduled Appointments</p>
        
        {/* Appointment Item 1 */}
        <div className="bg-white rounded-xl border border-gray-200 p-7 shadow-sm hover:shadow-md transition">
          <div className="flex items-start justify-between gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-4 mb-5">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600">
                  <DoctorIcon />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Dr. Sarah Smith</h3>
                  <p className="text-sm text-gray-600 mt-1">Cardiologist</p>
                </div>
              </div>
              <div className="space-y-3 mb-5">
                <div className="flex items-center gap-3 text-sm text-gray-700">
                  <CalendarIcon />
                  <span>January 25, 2026 • 10:00 AM</span>
                </div>
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-lg text-sm text-blue-700 font-medium">
                  General Checkup
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3 px-4 py-2 bg-green-100 text-green-700 text-sm font-semibold rounded-lg whitespace-nowrap">
              <CheckIcon />
              Confirmed
            </div>
          </div>
        </div>

        {/* Appointment Item 2 */}
        <div className="bg-white rounded-xl border border-gray-200 p-7 shadow-sm hover:shadow-md transition">
          <div className="flex items-start justify-between gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-4 mb-5">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center text-purple-600">
                  <DoctorIcon />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Dr. Michael Brown</h3>
                  <p className="text-sm text-gray-600 mt-1">Internal Medicine</p>
                </div>
              </div>
              <div className="space-y-3 mb-5">
                <div className="flex items-center gap-3 text-sm text-gray-700">
                  <CalendarIcon />
                  <span>February 2, 2026 • 3:00 PM</span>
                </div>
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-50 rounded-lg text-sm text-purple-700 font-medium">
                  Follow-up Consultation
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-amber-100 text-amber-700 text-sm font-semibold rounded-lg whitespace-nowrap">
              <ClockIcon />
              Pending
            </div>
          </div>
        </div>
      </div>

      {/* Book New Appointment */}
      <div className="bg-white rounded-xl border border-blue-200 p-8 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Schedule New Appointment</h3>
            <p className="text-sm text-gray-600">Contact your doctor to book additional appointments</p>
          </div>
          <button className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition flex items-center gap-2 whitespace-nowrap">
            <PlusIcon />
            New Appointment
          </button>
        </div>
      </div>
    </div>
  );
}
