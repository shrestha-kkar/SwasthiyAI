import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import { AuthProvider } from "@/context/AuthContext";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });

export const metadata: Metadata = {
  title: "SwasthyaSetu - Healthcare Management System",
  description: "Role-based healthcare system for seamless patient care management",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${outfit.variable} font-sans bg-slate-50 text-slate-900 antialiased`}>
        <AuthProvider>
          <main className="min-h-screen flex flex-col">{children}</main>
        </AuthProvider>
      </body>
    </html>
  );
}
