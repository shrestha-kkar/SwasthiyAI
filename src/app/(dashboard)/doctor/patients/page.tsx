"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { UserRole } from "@/types/index";
import { useEffect } from "react";

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
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">My Patients</h2>
        <p className="text-gray-600">Doctor-only page</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Patient Cards Placeholder */}
        <div className="card">
          <h3 className="font-semibold text-gray-900">John Patient</h3>
          <p className="text-sm text-gray-600">ID: PAT-001</p>
          <p className="text-sm text-gray-600">Last Visit: 2 days ago</p>
        </div>

        <div className="card">
          <h3 className="font-semibold text-gray-900">Jane Smith</h3>
          <p className="text-sm text-gray-600">ID: PAT-002</p>
          <p className="text-sm text-gray-600">Last Visit: 1 week ago</p>
        </div>

        <div className="card">
          <h3 className="font-semibold text-gray-900">Robert Johnson</h3>
          <p className="text-sm text-gray-600">ID: PAT-003</p>
          <p className="text-sm text-gray-600">Last Visit: 3 weeks ago</p>
        </div>
      </div>
    </div>
  );
}
