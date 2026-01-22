"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { UserRole } from "@/types/index";
import { useEffect } from "react";

export default function AdminHospitalsPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && user?.role !== UserRole.ADMIN) {
      router.push("/dashboard");
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Hospital Management</h2>
        <p className="text-gray-600">Admin-only page</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Hospital Cards Placeholder */}
        <div className="card">
          <h3 className="font-semibold text-gray-900 mb-2">City Medical Center</h3>
          <p className="text-sm text-gray-600">ID: HOSP-001</p>
          <div className="mt-4 space-y-2 text-sm text-gray-700">
            <p><strong>Location:</strong> Downtown</p>
            <p><strong>Beds:</strong> 250</p>
            <p><strong>Staff:</strong> 45</p>
          </div>
          <div className="mt-4 flex gap-2">
            <button className="text-sm text-blue-600 hover:underline">Edit</button>
            <button className="text-sm text-red-600 hover:underline">Delete</button>
          </div>
        </div>

        <div className="card">
          <h3 className="font-semibold text-gray-900 mb-2">Riverside Hospital</h3>
          <p className="text-sm text-gray-600">ID: HOSP-002</p>
          <div className="mt-4 space-y-2 text-sm text-gray-700">
            <p><strong>Location:</strong> North Side</p>
            <p><strong>Beds:</strong> 180</p>
            <p><strong>Staff:</strong> 35</p>
          </div>
          <div className="mt-4 flex gap-2">
            <button className="text-sm text-blue-600 hover:underline">Edit</button>
            <button className="text-sm text-red-600 hover:underline">Delete</button>
          </div>
        </div>
      </div>
    </div>
  );
}
