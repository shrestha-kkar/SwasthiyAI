'use client';

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

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
    <div className="space-y-8">
      {/* Hero Header */}
      <div className="bg-white rounded-xl border border-gray-200 p-8 shadow-sm">
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 bg-gradient-to-br from-blue-100 to-blue-50 rounded-lg flex items-center justify-center text-blue-600">
            <MedicalIcon />
          </div>
          <div>
            <h1 className="text-4xl font-bold text-gray-900">Patient Dashboard</h1>
            <p className="text-gray-600 mt-2">Manage your healthcare and medical records</p>
          </div>
        </div>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Appointments Card */}
        <div className="bg-white rounded-xl border border-gray-200 p-7 shadow-sm hover:shadow-md transition">
          <div className="flex items-start justify-between mb-5">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600">
              <CalendarIcon />
            </div>
            <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">Active</span>
          </div>
          <p className="text-sm font-medium text-gray-600 mb-2">Upcoming Appointments</p>
          <p className="text-3xl font-bold text-gray-900 mb-4">2</p>
          <Link href="/dashboard/patient/appointments" className="text-sm font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1 transition">
            View Appointments
            <ArrowRightIcon />
          </Link>
        </div>

        {/* Health Status Card */}
        <div className="bg-white rounded-xl border border-gray-200 p-7 shadow-sm hover:shadow-md transition">
          <div className="flex items-start justify-between mb-5">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center text-green-600">
              <HealthIcon />
            </div>
            <span className="text-xs font-semibold text-green-600 bg-green-50 px-3 py-1 rounded-full">Good</span>
          </div>
          <p className="text-sm font-medium text-gray-600 mb-2">Health Status</p>
          <p className="text-3xl font-bold text-gray-900 mb-4">Excellent</p>
          <p className="text-xs text-gray-500">Last checkup: 2 days ago</p>
        </div>

        {/* Medical Records Card */}
        <div className="bg-white rounded-xl border border-gray-200 p-7 shadow-sm hover:shadow-md transition">
          <div className="flex items-start justify-between mb-5">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center text-purple-600">
              <DocumentIcon />
            </div>
            <span className="text-xs font-semibold text-purple-600 bg-purple-50 px-3 py-1 rounded-full">Documents</span>
          </div>
          <p className="text-sm font-medium text-gray-600 mb-2">Medical Records</p>
          <p className="text-3xl font-bold text-gray-900 mb-4">5</p>
          <Link href="/dashboard/patient/records" className="text-sm font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1 transition">
            View Records
            <ArrowRightIcon />
          </Link>
        </div>
      </div>

      {/* Quick Actions Section */}
      <div className="bg-white rounded-xl border border-gray-200 p-8 shadow-sm">
        <h2 className="text-xl font-bold text-gray-900 mb-8">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <Link href="/dashboard/patient/intake" className="p-6 border border-gray-200 rounded-lg hover:bg-blue-50 hover:border-blue-200 transition group">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 mb-4 group-hover:bg-blue-200 transition">
              <MedicalIcon />
            </div>
            <p className="font-semibold text-gray-900 group-hover:text-blue-600 transition mb-2">Medical Intake</p>
            <p className="text-sm text-gray-600">Complete health form</p>
          </Link>

          <Link href="/dashboard/patient/appointments" className="p-6 border border-gray-200 rounded-lg hover:bg-green-50 hover:border-green-200 transition group">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center text-green-600 mb-4 group-hover:bg-green-200 transition">
              <CalendarIcon />
            </div>
            <p className="font-semibold text-gray-900 group-hover:text-green-600 transition mb-2">My Appointments</p>
            <p className="text-sm text-gray-600">Schedule and manage visits</p>
          </Link>

          <Link href="/dashboard/patient/records" className="p-6 border border-gray-200 rounded-lg hover:bg-purple-50 hover:border-purple-200 transition group">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center text-purple-600 mb-4 group-hover:bg-purple-200 transition">
              <DocumentIcon />
            </div>
            <p className="font-semibold text-gray-900 group-hover:text-purple-600 transition mb-2">Medical Records</p>
            <p className="text-sm text-gray-600">Access your medical history</p>
          </Link>
        </div>
      </div>

      {/* Information Card */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-8">
        <div className="flex gap-4">
          <div className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5">
            <InfoIcon />
          </div>
          <div>
            <h3 className="font-semibold text-blue-900 mb-3">About Your Health Dashboard</h3>
            <p className="text-sm text-blue-800 leading-relaxed">
              Your dashboard provides a comprehensive view of your health information. You can complete medical intake forms, schedule appointments with our doctors, and access your medical records all in one place. All your information is securely stored and kept confidential.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
