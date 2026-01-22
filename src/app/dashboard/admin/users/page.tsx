"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { UserRole } from "@/types/index";
import { useEffect } from "react";

export default function AdminUsersPage() {
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
        <h2 className="text-3xl font-bold text-gray-900 mb-2">User Management</h2>
        <p className="text-gray-600">Admin-only page</p>
      </div>

      <div className="card">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold text-gray-900">All Users</h3>
          <button className="btn-primary text-sm">Add New User</button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2 px-4 font-semibold text-gray-700">Name</th>
                <th className="text-left py-2 px-4 font-semibold text-gray-700">Email</th>
                <th className="text-left py-2 px-4 font-semibold text-gray-700">Role</th>
                <th className="text-left py-2 px-4 font-semibold text-gray-700">Status</th>
                <th className="text-left py-2 px-4 font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b hover:bg-gray-50">
                <td className="py-2 px-4">John Doe</td>
                <td className="py-2 px-4">patient@example.com</td>
                <td className="py-2 px-4"><span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">Patient</span></td>
                <td className="py-2 px-4"><span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">Active</span></td>
                <td className="py-2 px-4"><button className="text-blue-600 hover:underline">Edit</button></td>
              </tr>
              <tr className="border-b hover:bg-gray-50">
                <td className="py-2 px-4">Dr. Sarah Smith</td>
                <td className="py-2 px-4">doctor@example.com</td>
                <td className="py-2 px-4"><span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded">Doctor</span></td>
                <td className="py-2 px-4"><span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">Active</span></td>
                <td className="py-2 px-4"><button className="text-blue-600 hover:underline">Edit</button></td>
              </tr>
              <tr className="hover:bg-gray-50">
                <td className="py-2 px-4">Admin User</td>
                <td className="py-2 px-4">admin@example.com</td>
                <td className="py-2 px-4"><span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded">Admin</span></td>
                <td className="py-2 px-4"><span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">Active</span></td>
                <td className="py-2 px-4"><button className="text-blue-600 hover:underline">Edit</button></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
