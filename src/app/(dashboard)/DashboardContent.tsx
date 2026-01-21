"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { UserRole } from "@/types/index";

interface DashboardContentProps {
  children: React.ReactNode;
}

export default function DashboardContent({ children }: DashboardContentProps) {
  const { user, logout, isLoading } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    logout();
    router.push("/");
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    router.push("/login");
    return null;
  }

  const getRoleLabel = (role: string) => {
    return role.charAt(0).toUpperCase() + role.slice(1);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow">
        <div className="p-6 border-b">
          <h2 className="text-lg font-bold text-gray-900">SwasthyaSetu</h2>
          <p className="text-xs text-gray-500 mt-2">{getRoleLabel(user.role)} Portal</p>
        </div>

        {/* User Info */}
        <div className="p-6 border-b bg-gray-50">
          <p className="text-sm font-medium text-gray-900">{user.name}</p>
          <p className="text-xs text-gray-600 truncate">{user.email}</p>
          <span className="inline-block mt-2 px-2 py-1 text-xs font-semibold text-white bg-blue-600 rounded">
            {getRoleLabel(user.role)}
          </span>
        </div>

        {/* Navigation */}
        <nav className="p-6 space-y-2">
          <Link
            href="/dashboard"
            className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded transition"
          >
            Dashboard
          </Link>

          {user.role === UserRole.DOCTOR && (
            <>
              <Link
                href="/dashboard/doctor/patients"
                className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded transition"
              >
                My Patients
              </Link>
              <Link
                href="/dashboard/doctor/appointments"
                className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded transition"
              >
                Appointments
              </Link>
            </>
          )}

          {user.role === UserRole.PATIENT && (
            <>
              <Link
                href="/dashboard/patient/appointments"
                className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded transition"
              >
                My Appointments
              </Link>
              <Link
                href="/dashboard/patient/records"
                className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded transition"
              >
                Medical Records
              </Link>
            </>
          )}

          {user.role === UserRole.ADMIN && (
            <>
              <Link
                href="/dashboard/admin/users"
                className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded transition"
              >
                Users
              </Link>
              <Link
                href="/dashboard/admin/hospitals"
                className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded transition"
              >
                Hospitals
              </Link>
              <Link
                href="/dashboard/admin/reports"
                className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded transition"
              >
                Reports
              </Link>
            </>
          )}
        </nav>

        {/* Logout */}
        <div className="p-6 border-t absolute bottom-0 w-64">
          <button
            onClick={handleLogout}
            className="w-full px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded transition"
          >
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {/* Header */}
        <header className="bg-white border-b px-8 py-4 shadow-sm">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            <div className="text-sm text-gray-600">
              Welcome, <span className="font-semibold">{user.name}</span>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="p-8">{children}</div>
      </main>
    </div>
  );
}
