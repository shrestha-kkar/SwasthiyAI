"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { UserRole } from "@/types/index";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const user = await login(email, password);

      if (user) {
        switch (user.role) {
          case UserRole.PATIENT:
            router.push("/dashboard/patient");
            break;
          case UserRole.DOCTOR:
            router.push("/dashboard/doctor");
            break;
          case UserRole.ADMIN:
            router.push("/dashboard/admin");
            break;
          default:
            router.push("/dashboard");
        }
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Login failed. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-50 px-4 py-12">
      <div className="w-full max-w-md space-y-10">
        {/* Header */}
        <div className="text-center space-y-6">
          <div className="inline-flex items-center justify-center w-18 h-18 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-3xl text-white shadow-lg">
            <svg className="w-9 h-9" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a9 9 0 110 18m0-18a9 9 0 100 18m0-18V4m0 2a9 9 0 110 18m0-18a9 9 0 100 18" />
            </svg>
          </div>
          <div>
            <h1 className="text-5xl font-bold text-gray-900 mb-3">SwasthyaSetu</h1>
            <p className="text-gray-600 text-lg">Modern Healthcare Management</p>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="p-6 bg-red-50 border border-red-200 rounded-xl flex items-start gap-4">
            <div className="text-red-600 pt-1">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <p className="text-red-800 font-bold text-base">Login Failed</p>
              <p className="text-red-700 text-sm mt-2">{error}</p>
            </div>
          </div>
        )}

        {/* Demo Credentials */}
        <div className="p-6 bg-blue-50 border border-blue-200 rounded-xl space-y-5">
          <p className="text-sm font-bold text-blue-900 flex items-center gap-3">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 5v8a2 2 0 01-2 2h-5l-5 4v-4H4a2 2 0 01-2-2V5a2 2 0 012-2h12a2 2 0 012 2zm-11-1H7v2h2V4zm2 4H7v2h2V8zm2-4h2v2h-2V4zm2 4h-2v2h2V8z" clipRule="evenodd" />
            </svg>
            Demo Credentials
          </p>
          <div className="space-y-5">
            <div className="text-sm text-blue-800 space-y-2">
              <p className="font-bold text-blue-900 text-base">Patient</p>
              <code className="text-xs bg-white px-4 py-2.5 rounded border border-blue-100 block font-mono">patient@example.com / password123</code>
            </div>
            <div className="text-sm text-blue-800 space-y-2">
              <p className="font-bold text-blue-900 text-base">Doctor</p>
              <code className="text-xs bg-white px-4 py-2.5 rounded border border-blue-100 block font-mono">doctor@example.com / password123</code>
            </div>
            <div className="text-sm text-blue-800 space-y-2">
              <p className="font-bold text-blue-900 text-base">Admin</p>
              <code className="text-xs bg-white px-4 py-2.5 rounded border border-blue-100 block font-mono">admin@example.com / password123</code>
            </div>
          </div>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-10 space-y-8">
          <form onSubmit={handleSubmit} className="space-y-7">
            {/* Email Input */}
            <div className="space-y-3.5">
              <label htmlFor="email" className="block text-sm font-bold text-gray-800">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute left-4 top-4 text-blue-500">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full pl-13 pr-4 py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition outline-none text-base"
                  required
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-3.5">
              <label htmlFor="password" className="block text-sm font-bold text-gray-800">
                Password
              </label>
              <div className="relative">
                <div className="absolute left-4 top-4 text-blue-500">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-13 pr-4 py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition outline-none text-base"
                  required
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-lg hover:from-blue-700 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-400 disabled:cursor-not-allowed transition text-center text-base mt-2"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="animate-spin">⏳</span> Signing in...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
                  </svg>
                  Sign In
                </span>
              )}
            </button>
          </form>
        </div>

        {/* Register Link */}
        <p className="text-center text-gray-600 text-sm">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="text-blue-600 hover:text-blue-700 font-semibold transition">
            Create one now
          </Link>
        </p>
      </div>
    </div>
  );
}
