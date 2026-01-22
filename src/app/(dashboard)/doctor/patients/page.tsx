"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { UserRole } from "@/types/index";
import { useEffect } from "react";

// SVG Icons
const UsersIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-2a6 6 0 0112 0v2zm6-11a2 2 0 11-4 0 2 2 0 014 0zM19 21h-6" />
  </svg>
);

const UserIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

const ClockIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 2m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const ArrowRightIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
  </svg>
);

export default function DoctorPatientsPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && user?.role !== UserRole.DOCTOR) {
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
            <UsersIcon />
          </div>
          <div>
            <h1 className="text-4xl font-bold text-gray-900">My Patients</h1>
            <p className="text-gray-600 mt-2">View and manage your patient list</p>
          </div>
        </div>
      </div>

      {/* Patients Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Patient Cards */}
        <div className="bg-white rounded-xl border border-gray-200 p-7 shadow-sm hover:shadow-md transition group">
          <div className="flex items-start gap-4 mb-6">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 group-hover:bg-blue-200 transition">
              <UserIcon />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-gray-900 text-lg">John Patient</h3>
              <p className="text-xs text-gray-500 mt-1">ID: PAT-001</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-5 pb-5 border-b border-gray-200">
            <ClockIcon />
            <span>Last Visit: 2 days ago</span>
          </div>
          <button className="text-sm font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1 transition">
            View Patient
            <ArrowRightIcon />
          </button>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-7 shadow-sm hover:shadow-md transition group">
          <div className="flex items-start gap-4 mb-6">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center text-purple-600 group-hover:bg-purple-200 transition">
              <UserIcon />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-gray-900 text-lg">Jane Smith</h3>
              <p className="text-xs text-gray-500 mt-1">ID: PAT-002</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-5 pb-5 border-b border-gray-200">
            <ClockIcon />
            <span>Last Visit: 1 week ago</span>
          </div>
          <button className="text-sm font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1 transition">
            View Patient
            <ArrowRightIcon />
          </button>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-7 shadow-sm hover:shadow-md transition group">
          <div className="flex items-start gap-4 mb-6">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center text-green-600 group-hover:bg-green-200 transition">
              <UserIcon />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-gray-900 text-lg">Robert Johnson</h3>
              <p className="text-xs text-gray-500 mt-1">ID: PAT-003</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-5 pb-5 border-b border-gray-200">
            <ClockIcon />
            <span>Last Visit: 3 weeks ago</span>
          </div>
          <button className="text-sm font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1 transition">
            View Patient
            <ArrowRightIcon />
          </button>
        </div>
      </div>
    </div>
  );
}
