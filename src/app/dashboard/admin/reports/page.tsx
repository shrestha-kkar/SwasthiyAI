"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { UserRole } from "@/types/index";
import { useEffect } from "react";

export default function AdminReportsPage() {
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
        <h2 className="text-3xl font-bold text-gray-900 mb-2">System Reports</h2>
        <p className="text-gray-600">Admin-only page</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Statistics Cards */}
        <div className="card bg-gradient-to-br from-blue-50 to-blue-100 border-t-4 border-t-blue-600">
          <p className="text-sm text-gray-600 mb-2">Total Users</p>
          <p className="text-3xl font-bold text-gray-900">1,234</p>
          <p className="text-xs text-gray-600 mt-2">↑ 12% from last month</p>
        </div>

        <div className="card bg-gradient-to-br from-green-50 to-green-100 border-t-4 border-t-green-600">
          <p className="text-sm text-gray-600 mb-2">Active Appointments</p>
          <p className="text-3xl font-bold text-gray-900">567</p>
          <p className="text-xs text-gray-600 mt-2">↑ 8% from last month</p>
        </div>

        <div className="card bg-gradient-to-br from-purple-50 to-purple-100 border-t-4 border-t-purple-600">
          <p className="text-sm text-gray-600 mb-2">Hospitals</p>
          <p className="text-3xl font-bold text-gray-900">12</p>
          <p className="text-xs text-gray-600 mt-2">2 new this month</p>
        </div>
      </div>

      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
        <div className="space-y-4">
          <div className="flex items-start gap-4 pb-4 border-b">
            <div className="w-2 h-2 mt-2 bg-green-600 rounded-full flex-shrink-0"></div>
            <div>
              <p className="text-sm font-medium text-gray-900">New user registration</p>
              <p className="text-xs text-gray-600">2 hours ago</p>
            </div>
          </div>
          <div className="flex items-start gap-4 pb-4 border-b">
            <div className="w-2 h-2 mt-2 bg-blue-600 rounded-full flex-shrink-0"></div>
            <div>
              <p className="text-sm font-medium text-gray-900">Appointment scheduled</p>
              <p className="text-xs text-gray-600">5 hours ago</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="w-2 h-2 mt-2 bg-purple-600 rounded-full flex-shrink-0"></div>
            <div>
              <p className="text-sm font-medium text-gray-900">Hospital data updated</p>
              <p className="text-xs text-gray-600">1 day ago</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
