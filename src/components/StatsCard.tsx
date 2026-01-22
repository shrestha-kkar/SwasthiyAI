"use client";

import React from "react";

interface StatsCardProps {
  title: string;
  value: number | string;
  description?: string;
  icon?: React.ReactNode;
  variant?: "default" | "success" | "warning" | "info";
}

export function StatsCard({
  title,
  value,
  description,
  icon,
  variant = "default",
}: StatsCardProps) {
  const variantClasses = {
    default: "bg-white border-l-4 border-blue-500",
    success: "bg-white border-l-4 border-green-500",
    warning: "bg-white border-l-4 border-yellow-500",
    info: "bg-white border-l-4 border-purple-500",
  };

  const valueClasses = {
    default: "text-blue-600",
    success: "text-green-600",
    warning: "text-yellow-600",
    info: "text-purple-600",
  };

  return (
    <div className={`${variantClasses[variant]} rounded-lg p-6 shadow-md`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className={`text-3xl font-bold ${valueClasses[variant]} mt-2`}>
            {value}
          </p>
          {description && (
            <p className="text-xs text-gray-500 mt-2">{description}</p>
          )}
        </div>
        {icon && <div className="text-3xl opacity-20">{icon}</div>}
      </div>
    </div>
  );
}
