"use client";

import React from "react";

interface DoctorStat {
  doctorId: string;
  doctorName: string;
  specialization: string;
  totalPatients: number;
  scheduledVisits: number;
  completedVisits: number;
  noShowVisits: number;
}

interface DoctorPatientTableProps {
  doctors: DoctorStat[];
  isLoading: boolean;
}

export function DoctorPatientTable({
  doctors,
  isLoading,
}: DoctorPatientTableProps) {
  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="text-center py-8">
          <p className="text-gray-600">Loading doctor statistics...</p>
        </div>
      </div>
    );
  }

  if (doctors.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="text-center py-8">
          <p className="text-gray-600">No doctors found in the system.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                Doctor Name
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                Specialization
              </th>
              <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700">
                Total Patients
              </th>
              <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700">
                Scheduled
              </th>
              <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700">
                Completed
              </th>
              <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700">
                No Show
              </th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {doctors.map((doctor, index) => (
              <tr
                key={doctor.doctorId}
                className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
              >
                <td className="px-6 py-4">
                  <p className="font-medium text-gray-900">{doctor.doctorName}</p>
                </td>
                <td className="px-6 py-4">
                  <span className="inline-block bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">
                    {doctor.specialization}
                  </span>
                </td>
                <td className="px-6 py-4 text-center">
                  <span className="font-semibold text-gray-900 text-lg">
                    {doctor.totalPatients}
                  </span>
                </td>
                <td className="px-6 py-4 text-center">
                  <span className="inline-block bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-sm font-medium">
                    {doctor.scheduledVisits}
                  </span>
                </td>
                <td className="px-6 py-4 text-center">
                  <span className="inline-block bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
                    {doctor.completedVisits}
                  </span>
                </td>
                <td className="px-6 py-4 text-center">
                  <span className="inline-block bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-medium">
                    {doctor.noShowVisits}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
