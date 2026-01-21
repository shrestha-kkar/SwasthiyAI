'use client';

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

export default function PatientPage() {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Patient Dashboard</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <Link
              href="/dashboard/patient/intake"
              className="block px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
            >
              📝 Start Medical Intake
            </Link>
            <Link
              href="/dashboard/patient/appointments"
              className="block px-4 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
            >
              📅 View Appointments
            </Link>
            <Link
              href="/dashboard/patient/records"
              className="block px-4 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition"
            >
              📋 Medical Records
            </Link>
          </div>
        </div>

        {/* Patient Info */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Information</h3>
          <div className="space-y-2 text-sm">
            <p className="text-gray-600">
              <span className="font-semibold">Name:</span> {user?.name || "Loading..."}
            </p>
            <p className="text-gray-600">
              <span className="font-semibold">Email:</span> {user?.email || "Loading..."}
            </p>
            <p className="text-gray-600">
              <span className="font-semibold">Role:</span> <span className="capitalize">{user?.role}</span>
            </p>
          </div>
        </div>
      </div>

      {/* Info Section */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-blue-900 mb-2">About Medical Intake</h3>
        <p className="text-blue-800 text-sm">
          The Medical Intake form helps us understand your current health situation. You will have a 
          conversational chat with our intake assistant to gather information about your symptoms, 
          medical history, and medications. This information will be reviewed by a doctor before your appointment.
        </p>
      </div>
    </div>
  );
}
