import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-100 px-4 py-12">
      <div className="text-center max-w-3xl space-y-14">
        {/* Icon */}
        <div className="flex justify-center">
          <div className="w-24 h-24 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-3xl flex items-center justify-center text-white shadow-2xl">
            <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a9 9 0 110 18m0-18a9 9 0 100 18m0-18V4m0 2a9 9 0 110 18m0-18a9 9 0 100 18" />
            </svg>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-8">
          <h1 className="text-7xl font-bold text-gray-900 leading-tight tracking-tight">
            SwasthyaSetu
          </h1>
          <div className="space-y-4">
            <p className="text-2xl text-gray-600 leading-relaxed font-medium">
              A comprehensive role-based healthcare management system
            </p>
            <p className="text-lg text-gray-500 leading-relaxed">
              Streamline patient care, appointments, and medical records with our integrated platform
            </p>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-8 justify-center pt-6">
          <Link
            href="/login"
            className="px-10 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-indigo-700 transition shadow-lg hover:shadow-xl text-center"
          >
            Sign In
          </Link>
          <Link
            href="/register"
            className="px-10 py-4 bg-white text-gray-900 font-semibold rounded-xl border-2 border-gray-200 hover:border-indigo-300 hover:bg-indigo-50 transition shadow-md hover:shadow-lg text-center"
          >
            Create Account
          </Link>
        </div>
      </div>
    </div>
  );
}
