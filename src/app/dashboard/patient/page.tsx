'use client';

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { StatsCard } from '@/components/StatsCard';

const MedicalIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
);

const CalendarIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

const HealthIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21H3V3h18v18z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h8M12 8v8" />
  </svg>
);

const DocumentIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
);

const InfoIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const ArrowRightIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
  </svg>
);

export default function PatientPage() {
  const { user } = useAuth();

  return (
    <div className="space-y-8 animate-fade-in-up">
      {/* Hero Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold font-heading text-slate-900">Patient Dashboard</h2>
          <p className="text-slate-500 mt-1">Manage your healthcare and medical records</p>
        </div>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Appointments Card */}
        <div className="relative group">
          <StatsCard
            title="Upcoming"
            value="2"
            variant="default"
            icon={<CalendarIcon />}
            description="Scheduled appointments"
          />
          <Link
            href="/dashboard/patient/appointments"
            className="absolute bottom-4 right-6 text-sm font-semibold text-primary-600 hover:text-primary-700 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            View
            <ArrowRightIcon />
          </Link>
        </div>

        {/* Health Status Card */}
        <StatsCard
          title="Health Status"
          value="Good"
          variant="success"
          icon={<HealthIcon />}
          description="Last checkup: 2 days ago"
        />

        {/* Medical Records Card */}
        <div className="relative group">
          <StatsCard
            title="Records"
            value="5"
            variant="info"
            icon={<DocumentIcon />}
            description="Medical documents"
          />
          <Link
            href="/dashboard/patient/records"
            className="absolute bottom-4 right-6 text-sm font-semibold text-primary-600 hover:text-primary-700 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            Access
            <ArrowRightIcon />
          </Link>
        </div>
      </div>

      {/* Quick Actions Section */}
      <div>
        <h2 className="text-xl font-bold font-heading text-slate-900 mb-6 px-1">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link href="/dashboard/patient/intake" className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-premium hover:-translate-y-1 transition-all duration-300 group">
            <div className="w-12 h-12 bg-primary-50 rounded-xl flex items-center justify-center text-primary-600 mb-4 group-hover:bg-primary-600 group-hover:text-white transition-colors duration-300">
              <MedicalIcon />
            </div>
            <h3 className="font-bold text-slate-900 text-lg mb-2 group-hover:text-primary-700 transition-colors">Medical Intake</h3>
            <p className="text-slate-500 text-sm">Complete health forms before your visit</p>
          </Link>

          <Link href="/dashboard/patient/appointments" className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-premium hover:-translate-y-1 transition-all duration-300 group">
            <div className="w-12 h-12 bg-secondary-50 rounded-xl flex items-center justify-center text-secondary-600 mb-4 group-hover:bg-secondary-600 group-hover:text-white transition-colors duration-300">
              <CalendarIcon />
            </div>
            <h3 className="font-bold text-slate-900 text-lg mb-2 group-hover:text-secondary-700 transition-colors">My Appointments</h3>
            <p className="text-slate-500 text-sm">Schedule and manage your doctor visits</p>
          </Link>

          <Link href="/dashboard/patient/records" className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-premium hover:-translate-y-1 transition-all duration-300 group">
            <div className="w-12 h-12 bg-violet-50 rounded-xl flex items-center justify-center text-violet-600 mb-4 group-hover:bg-violet-600 group-hover:text-white transition-colors duration-300">
              <DocumentIcon />
            </div>
            <h3 className="font-bold text-slate-900 text-lg mb-2 group-hover:text-violet-700 transition-colors">Medical Records</h3>
            <p className="text-slate-500 text-sm">Access your complete medical history</p>
          </Link>
        </div>
      </div>

      {/* Information Card */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-2xl p-6 md:p-8">
        <div className="flex gap-4 items-start">
          <div className="p-2 bg-white rounded-lg text-blue-600 shadow-sm shrink-0">
            <InfoIcon />
          </div>
          <div>
            <h3 className="font-bold text-blue-900 mb-2">About Your Health Dashboard</h3>
            <p className="text-sm text-blue-800/80 leading-relaxed max-w-3xl">
              Your dashboard provides a comprehensive view of your health information. You can complete medical intake forms, schedule appointments with our doctors, and access your medical records all in one place. All your information is securely stored and kept confidential.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
