"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { UserRole } from "@/types/index";
import { useEffect } from "react";

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
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">My Appointments</h2>
        <p className="text-gray-600">Patient-only page</p>
      </div>

      <div className="space-y-4">
        {/* Patient Appointment Items Placeholder */}
        <div className="card border-l-4 border-l-blue-600">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-semibold text-gray-900">Dr. Sarah Smith</h3>
              <p className="text-sm text-gray-600">Jan 25, 2026 at 10:00 AM</p>
              <p className="text-sm text-gray-700 mt-2">General Checkup</p>
            </div>
            <span className="px-3 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded-full">
              Scheduled
            </span>
          </div>
        </div>

        <div className="card border-l-4 border-l-green-600">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-semibold text-gray-900">Dr. Michael Brown</h3>
              <p className="text-sm text-gray-600">Feb 2, 2026 at 3:00 PM</p>
              <p className="text-sm text-gray-700 mt-2">Follow-up Consultation</p>
            </div>
            <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded-full">
              Pending Confirmation
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
