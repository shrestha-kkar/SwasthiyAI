"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { UserRole } from "@/types/index";
import { useEffect } from "react";

// SVG Icons
const DocumentIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
);

const FlaskIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5h.01" />
  </svg>
);

const PillIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
  </svg>
);

const ShieldIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const ExternalLinkIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
  </svg>
);

export default function PatientRecordsPage() {
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
            <DocumentIcon />
          </div>
          <div>
            <h1 className="text-4xl font-bold text-gray-900">Medical Records</h1>
            <p className="text-gray-600 mt-2">Access and manage your medical documents and history</p>
          </div>
        </div>
      </div>

      {/* Records Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Lab Results Card */}
        <div className="bg-white rounded-xl border border-gray-200 p-7 shadow-sm hover:shadow-md transition group">
          <div className="flex items-start justify-between mb-6">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 group-hover:bg-blue-200 transition">
              <FlaskIcon />
            </div>
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Lab Results</span>
          </div>
          <h3 className="font-semibold text-gray-900 mb-3">Lab Results</h3>
          <p className="text-sm text-gray-600 mb-4">Date: January 20, 2026</p>
          <p className="text-sm text-gray-700 mb-6">Blood test results and analysis</p>
          <button className="text-sm font-medium text-blue-600 hover:text-blue-700 flex items-center gap-2 transition">
            View Document
            <ExternalLinkIcon />
          </button>
        </div>

        {/* Prescription Card */}
        <div className="bg-white rounded-xl border border-gray-200 p-7 shadow-sm hover:shadow-md transition group">
          <div className="flex items-start justify-between mb-6">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center text-purple-600 group-hover:bg-purple-200 transition">
              <PillIcon />
            </div>
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Prescription</span>
          </div>
          <h3 className="font-semibold text-gray-900 mb-3">Prescription</h3>
          <p className="text-sm text-gray-600 mb-4">Date: January 18, 2026</p>
          <p className="text-sm text-gray-700 mb-6">Current medications and prescriptions</p>
          <button className="text-sm font-medium text-blue-600 hover:text-blue-700 flex items-center gap-2 transition">
            View Prescription
            <ExternalLinkIcon />
          </button>
        </div>

        {/* Medical History Card */}
        <div className="bg-white rounded-xl border border-gray-200 p-7 shadow-sm hover:shadow-md transition group">
          <div className="flex items-start justify-between mb-6">
            <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center text-amber-600 group-hover:bg-amber-200 transition">
              <DocumentIcon />
            </div>
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">History</span>
          </div>
          <h3 className="font-semibold text-gray-900 mb-3">Medical History</h3>
          <p className="text-sm text-gray-600 mb-4">Updated: January 15, 2026</p>
          <p className="text-sm text-gray-700 mb-6">Complete medical history and notes</p>
          <button className="text-sm font-medium text-blue-600 hover:text-blue-700 flex items-center gap-2 transition">
            View History
            <ExternalLinkIcon />
          </button>
        </div>

        {/* Vaccination Records Card */}
        <div className="bg-white rounded-xl border border-gray-200 p-7 shadow-sm hover:shadow-md transition group">
          <div className="flex items-start justify-between mb-6">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center text-green-600 group-hover:bg-green-200 transition">
              <ShieldIcon />
            </div>
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Vaccinations</span>
          </div>
          <h3 className="font-semibold text-gray-900 mb-3">Vaccination Records</h3>
          <p className="text-sm text-gray-600 mb-4">Last Updated: January 10, 2026</p>
          <p className="text-sm text-gray-700 mb-6">Immunization and vaccination records</p>
          <button className="text-sm font-medium text-blue-600 hover:text-blue-700 flex items-center gap-2 transition">
            View Records
            <ExternalLinkIcon />
          </button>
        </div>
      </div>
    </div>
  );
}
