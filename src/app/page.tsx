import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="text-center max-w-2xl">
        <h1 className="text-5xl font-bold text-gray-900 mb-4">
          SwasthyaSetu
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          A comprehensive role-based healthcare management system
        </p>
        <div className="flex gap-4 justify-center">
          <Link
            href="/login"
            className="btn-primary"
          >
            Login
          </Link>
          <Link
            href="/register"
            className="btn-secondary"
          >
            Register
          </Link>
        </div>
      </div>
    </div>
  );
}
