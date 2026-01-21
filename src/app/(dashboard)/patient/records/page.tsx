"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { UserRole } from "@/types/index";
import { useEffect } from "react";

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
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Medical Records</h2>
        <p className="text-gray-600">Patient-only page</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Medical Record Cards Placeholder */}
        <div className="card">
          <h3 className="font-semibold text-gray-900 mb-2">Lab Results</h3>
          <p className="text-sm text-gray-600">Date: Jan 20, 2026</p>
          <p className="text-sm text-gray-700 mt-2">Blood test results available</p>
          <button className="mt-3 text-sm text-blue-600 hover:underline">View Document</button>
        </div>

        <div className="card">
          <h3 className="font-semibold text-gray-900 mb-2">Prescription</h3>
          <p className="text-sm text-gray-600">Date: Jan 18, 2026</p>
          <p className="text-sm text-gray-700 mt-2">Current medications and prescriptions</p>
          <button className="mt-3 text-sm text-blue-600 hover:underline">View Prescription</button>
        </div>

        <div className="card">
          <h3 className="font-semibold text-gray-900 mb-2">Medical History</h3>
          <p className="text-sm text-gray-600">Updated: Jan 15, 2026</p>
          <p className="text-sm text-gray-700 mt-2">Complete medical history and notes</p>
          <button className="mt-3 text-sm text-blue-600 hover:underline">View History</button>
        </div>

        <div className="card">
          <h3 className="font-semibold text-gray-900 mb-2">Vaccination Records</h3>
          <p className="text-sm text-gray-600">Last Updated: Jan 10, 2026</p>
          <p className="text-sm text-gray-700 mt-2">Immunization and vaccination records</p>
          <button className="mt-3 text-sm text-blue-600 hover:underline">View Records</button>
        </div>
      </div>
    </div>
  );
}
