"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
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
  const pathname = usePathname();

  const handleLogout = async () => {
    logout();
    router.push("/");
  };

  const isActive = (path: string) => pathname === path;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-slate-600 font-medium">Loading...</p>
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

  const NavItem = ({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) => (
    <Link
      href={href}
      className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${isActive(href)
        ? "bg-primary-50 text-primary-700 font-semibold shadow-sm"
        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900 font-medium"
        }`}
    >
      <div className={`${isActive(href) ? "text-primary-600" : "text-slate-400 group-hover:text-slate-600"}`}>
        {icon}
      </div>
      <span>{label}</span>
    </Link>
  );

  return (
    <div className="flex h-screen bg-slate-50 font-sans">
      {/* Sidebar */}
      <aside className="w-72 bg-white border-r border-slate-200 flex flex-col shadow-[4px_0_24px_rgba(0,0,0,0.02)] z-10">
        {/* Logo & Branding */}
        <div className="p-6">
          <div className="flex items-center gap-2 px-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-600 to-secondary-600 flex items-center justify-center text-white">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a9 9 0 110 18m0-18a9 9 0 100 18m0-18V4m0 2a9 9 0 110 18m0-18a9 9 0 100 18" /></svg>
            </div>
            <h1 className="text-xl font-bold font-heading text-slate-900 tracking-tight">
              Swasthya<span className="text-primary-600">Setu</span>
            </h1>
          </div>
        </div>

        {/* User Info Card */}
        <div className="px-6 mb-6">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-primary-700 font-bold shadow-sm">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-bold text-slate-900 truncate">{user.name}</p>
                <p className="text-xs text-slate-500 truncate">{getRoleLabel(user.role)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 space-y-1 overflow-y-auto custom-scrollbar">
          <NavItem href="/dashboard" icon={<DashboardIcon />} label="Dashboard" />

          {user.role === UserRole.DOCTOR && (
            <>
              <div className="mt-6 mb-2 px-4">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Patient Management</p>
              </div>
              <NavItem href="/dashboard/doctor/appointments" icon={<CalendarIcon />} label="My Appointments" />
              <NavItem href="/dashboard/doctor/patients" icon={<UsersIcon />} label="My Patients" />
            </>
          )}

          {user.role === UserRole.PATIENT && (
            <>
              <div className="mt-6 mb-2 px-4">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Health Management</p>
              </div>
              <NavItem href="/dashboard/patient/intake" icon={<DocumentIcon />} label="Medical Intake" />
              <NavItem href="/dashboard/patient/appointments" icon={<CalendarIcon />} label="My Appointments" />
              <NavItem href="/dashboard/patient/records" icon={<DocumentIcon />} label="Medical Records" />
            </>
          )}

          {user.role === UserRole.ADMIN && (
            <>
              <div className="mt-6 mb-2 px-4">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Administration</p>
              </div>
              <NavItem href="/dashboard/admin/users" icon={<UsersIcon />} label="Users" />
              <NavItem href="/dashboard/admin/hospitals" icon={<DocumentIcon />} label="Hospitals" />
              <NavItem href="/dashboard/admin/reports" icon={<DocumentIcon />} label="Reports" />
            </>
          )}
        </nav>

        {/* Logout Button */}
        <div className="p-4 border-t border-slate-100">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200 group"
          >
            <div className="text-slate-400 group-hover:text-red-500 transition-colors">
              <LogoutIcon />
            </div>
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden bg-slate-50/50">
        {/* Header */}
        <header className="bg-white/80 backdrop-blur-md border-b border-slate-200/60 sticky top-0 z-20">
          <div className="flex justify-between items-center px-8 py-4">
            <div>
              <h1 className="text-2xl font-bold font-heading text-slate-900">Dashboard</h1>
              <p className="text-sm text-slate-500">Welcome back, {user.name}</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="hidden md:block text-right">
                <p className="text-sm font-bold text-slate-900">{new Date().toLocaleDateString('en-US', { weekday: 'long' })}</p>
                <p className="text-xs text-slate-500 text-right">
                  {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
              </div>
              <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 hover:bg-primary-50 hover:text-primary-600 transition-colors cursor-pointer">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto p-6 md:p-8">
          <div className="max-w-7xl mx-auto space-y-6 animate-fade-in-up">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
