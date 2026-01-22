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
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <div className="text-center space-y-4">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-full shadow-premium mb-4">
          <div className="w-8 h-8 rounded-full border-2 border-primary-500 border-t-transparent animate-spin" />
        </div>
        <div>
          <h2 className="text-xl font-bold font-heading text-slate-900">SwasthyaSetu</h2>
          <p className="text-slate-500 text-sm">Redirecting to your workspace...</p>
        </div>
      </div>
    </div>
  );
}
