"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { UserRole } from "@/types/index";

interface DashboardContentProps {
  children: React.ReactNode;
}

const DashboardIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-3m0 0l7-4 7 4M5 9v10a1 1 0 001 1h12a1 1 0 001-1V9M9 5l3-3m3 3" />
  </svg>
);

const CalendarIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

const UsersIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 12H9m6 0a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const DocumentIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
);

const LogoutIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
  </svg>
);

export default function DashboardContent({ children }: DashboardContentProps) {
  const { user, logout, isLoading } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    logout();
    router.push("/");
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-700 font-medium">Loading...</p>
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
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-72 bg-white shadow-sm border-r border-gray-200 flex flex-col">
        {/* Logo & Branding */}
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-700">
            SwasthyaSetu
          </h1>
          <p className="text-sm text-gray-500 mt-1 font-medium">{getRoleLabel(user.role)} Dashboard</p>
        </div>

        {/* User Info Card */}
        <div className="p-6 border-b border-gray-200 bg-gradient-to-br from-blue-50 to-indigo-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-sm">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900 truncate">{user.name}</p>
              <p className="text-xs text-gray-600 truncate">{user.email}</p>
            </div>
          </div>
          <span className="inline-block mt-3 px-3 py-1 text-xs font-semibold text-blue-700 bg-blue-100 rounded-full">
            {getRoleLabel(user.role)}
          </span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-6 space-y-1 overflow-y-auto">
          <Link
            href="/dashboard"
            className="flex items-center gap-3 px-4 py-2.5 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition group"
          >
            <DashboardIcon />
            <span className="font-medium text-sm">Dashboard</span>
          </Link>

          {user.role === UserRole.DOCTOR && (
            <>
              <div className="pt-4">
                <p className="px-4 py-2 text-xs font-bold text-gray-400 uppercase tracking-wider">Patient Management</p>
              </div>
              <Link
                href="/dashboard/doctor/appointments"
                className="flex items-center gap-3 px-4 py-2.5 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition"
              >
                <CalendarIcon />
                <span className="font-medium text-sm">My Appointments</span>
              </Link>
              <Link
                href="/dashboard/doctor/patients"
                className="flex items-center gap-3 px-4 py-2.5 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition"
              >
                <UsersIcon />
                <span className="font-medium text-sm">My Patients</span>
              </Link>
            </>
          )}

          {user.role === UserRole.PATIENT && (
            <>
              <div className="pt-4">
                <p className="px-4 py-2 text-xs font-bold text-gray-400 uppercase tracking-wider">Health Management</p>
              </div>
              <Link
                href="/dashboard/patient/intake"
                className="flex items-center gap-3 px-4 py-2.5 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition"
              >
                <DocumentIcon />
                <span className="font-medium text-sm">Medical Intake</span>
              </Link>
              <Link
                href="/dashboard/patient/appointments"
                className="flex items-center gap-3 px-4 py-2.5 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition"
              >
                <CalendarIcon />
                <span className="font-medium text-sm">My Appointments</span>
              </Link>
              <Link
                href="/dashboard/patient/records"
                className="flex items-center gap-3 px-4 py-2.5 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition"
              >
                <DocumentIcon />
                <span className="font-medium text-sm">Medical Records</span>
              </Link>
            </>
          )}

          {user.role === UserRole.ADMIN && (
            <>
              <div className="pt-4">
                <p className="px-4 py-2 text-xs font-bold text-gray-400 uppercase tracking-wider">Administration</p>
              </div>
              <Link
                href="/dashboard/admin/users"
                className="flex items-center gap-3 px-4 py-2.5 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition"
              >
                <UsersIcon />
                <span className="font-medium text-sm">Users</span>
              </Link>
              <Link
                href="/dashboard/admin/hospitals"
                className="flex items-center gap-3 px-4 py-2.5 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition"
              >
                <DocumentIcon />
                <span className="font-medium text-sm">Hospitals</span>
              </Link>
              <Link
                href="/dashboard/admin/reports"
                className="flex items-center gap-3 px-4 py-2.5 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition"
              >
                <DocumentIcon />
                <span className="font-medium text-sm">Reports</span>
              </Link>
            </>
          )}
        </nav>

        {/* Logout Button */}
        <div className="p-6 border-t border-gray-200">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 rounded-lg transition shadow-sm"
          >
            <LogoutIcon />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-8 py-4 shadow-sm">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-sm text-gray-500 mt-1">Welcome back, {user.name}</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900">{user.role.toUpperCase()}</p>
              <p className="text-xs text-gray-500 mt-1">
                {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto bg-gray-50">
          <div className="p-8 max-w-7xl mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
}
