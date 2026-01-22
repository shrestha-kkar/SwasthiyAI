"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { StatsCard } from "@/components/StatsCard";
import { DoctorPatientTable } from "@/components/DoctorPatientTable";

interface TodayStats {
  totalVisits: number;
  totalPatients: number;
  completedVisits: number;
  scheduledVisits: number;
  noShowVisits: number;
}

interface DoctorStat {
  doctorId: string;
  doctorName: string;
  specialization: string;
  totalPatients: number;
  scheduledVisits: number;
  completedVisits: number;
  noShowVisits: number;
}

interface DoctorWiseData {
  doctorStats: DoctorStat[];
  summary: {
    totalDoctors: number;
    totalPatients: number;
    totalVisits: number;
    averagePatientsPerDoctor: string | number;
  };
}

export default function AdminPage() {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const [todayStats, setTodayStats] = useState<TodayStats | null>(null);
  const [doctorWiseData, setDoctorWiseData] = useState<DoctorWiseData | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastRefresh, setLastRefresh] = useState<string>(
    new Date().toLocaleTimeString()
  );

  useEffect(() => {
    // Verify admin role
    if (!authLoading && user?.role !== "admin") {
      router.push("/dashboard");
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    setIsLoading(true);
    setError(null);
    try {
      // Fetch today's patient count
      const todayResponse = await fetch("/api/admin/today-patients", {
        method: "GET",
        credentials: "include",
      });

      if (!todayResponse.ok) {
        throw new Error(`Failed to fetch today's statistics: ${todayResponse.statusText}`);
      }

      const todayData = await todayResponse.json();
      setTodayStats(todayData.data);

      // Fetch doctor-wise patient count
      const doctorResponse = await fetch("/api/admin/doctor-wise-count", {
        method: "GET",
        credentials: "include",
      });

      if (!doctorResponse.ok) {
        throw new Error(`Failed to fetch doctor-wise statistics: ${doctorResponse.statusText}`);
      }

      const doctorData = await doctorResponse.json();
      setDoctorWiseData(doctorData.data);

      setLastRefresh(new Date().toLocaleTimeString());
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch data";
      setError(errorMessage);
      console.error("Error fetching admin data:", err);
    } finally {
      setIsLoading(false);
    }
  }

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  if (user?.role !== "admin") {
    return null;
  }

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-2">
            Hospital Management & Analytics
          </p>
        </div>
        <button
          onClick={fetchData}
          disabled={isLoading}
          className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg transition-colors"
        >
          {isLoading ? "Refreshing..." : "Refresh Data"}
        </button>
      </div>

      {/* Last Refresh Time */}
      <p className="text-sm text-gray-500">
        Last updated: {lastRefresh}
      </p>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {/* Today's Statistics Section */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Today's Statistics
        </h2>
        {todayStats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <StatsCard
              title="Total Visits"
              value={todayStats.totalVisits}
              variant="default"
              icon="📅"
            />
            <StatsCard
              title="Total Patients"
              value={todayStats.totalPatients}
              variant="info"
              icon="👥"
            />
            <StatsCard
              title="Scheduled"
              value={todayStats.scheduledVisits}
              variant="warning"
              icon="⏱️"
            />
            <StatsCard
              title="Completed"
              value={todayStats.completedVisits}
              variant="success"
              icon="✓"
            />
            <StatsCard
              title="No Shows"
              value={todayStats.noShowVisits}
              variant="default"
              icon="❌"
            />
          </div>
        )}
      </div>

      {/* Overall Hospital Statistics */}
      {doctorWiseData && (
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Hospital Overview
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <StatsCard
              title="Total Doctors"
              value={doctorWiseData.summary.totalDoctors}
              variant="info"
              icon="👨‍⚕️"
            />
            <StatsCard
              title="Total Patients"
              value={doctorWiseData.summary.totalPatients}
              variant="success"
              icon="👥"
            />
            <StatsCard
              title="Total Visits"
              value={doctorWiseData.summary.totalVisits}
              variant="default"
              icon="📋"
            />
            <StatsCard
              title="Avg. Patients/Doctor"
              value={
                typeof doctorWiseData.summary.averagePatientsPerDoctor ===
                "string"
                  ? parseFloat(
                      doctorWiseData.summary.averagePatientsPerDoctor
                    ).toFixed(1)
                  : doctorWiseData.summary.averagePatientsPerDoctor.toFixed(1)
              }
              variant="warning"
              icon="📊"
            />
          </div>
        </div>
      )}

      {/* Doctor-Wise Patient Count Table */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Doctor-Wise Patient Distribution
        </h2>
        {doctorWiseData && (
          <DoctorPatientTable
            doctors={doctorWiseData.doctorStats}
            isLoading={isLoading}
          />
        )}
      </div>

      {/* Read-Only Notice */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-blue-700 text-sm">
          📌 <strong>Note:</strong> This dashboard provides read-only access to
          hospital statistics and analytics. All data is automatically updated
          and refreshed on demand.
        </p>
      </div>
    </div>
  );
}
