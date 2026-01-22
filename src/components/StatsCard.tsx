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
  const variantStyles = {
    default: { bg: "bg-blue-50", text: "text-blue-600", border: "border-blue-100" },
    success: { bg: "bg-emerald-50", text: "text-emerald-600", border: "border-emerald-100" },
    warning: { bg: "bg-amber-50", text: "text-amber-600", border: "border-amber-100" },
    info: { bg: "bg-violet-50", text: "text-violet-600", border: "border-violet-100" },
  };

  const style = variantStyles[variant];

  return (
    <div className="bg-white rounded-2xl p-6 shadow-[0_2px_10px_rgba(0,0,0,0.03)] border border-slate-100 hover:shadow-premium hover:-translate-y-0.5 transition-all duration-300">
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-sm font-semibold text-slate-500 tracking-wide uppercase">{title}</p>
          <p className="text-3xl font-bold text-slate-900 tracking-tight">
            {value}
          </p>
          {description && (
            <p className="text-xs font-medium text-slate-400">{description}</p>
          )}
        </div>
        {icon && (
          <div className={`p-3 rounded-xl ${style.bg} ${style.text} flex items-center justify-center`}>
            {/* Render icon directly, assuming it has appropriate size or inherits */}
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}
