"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function DashboardPage() {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user?.role) {
      switch (user.role) {
        case "doctor":
          router.push("/dashboard/doctor");
          break;
        case "patient":
          router.push("/dashboard/patient");
          break;
        case "admin":
          router.push("/dashboard/admin");
          break;
      }
    }
  }, [user, router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full mb-4 animate-pulse">
          <span className="text-2xl">⚕️</span>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome to SwasthyaSetu</h2>
        <p className="text-gray-600">Redirecting to your dashboard...</p>
      </div>
    </div>
  );
}
