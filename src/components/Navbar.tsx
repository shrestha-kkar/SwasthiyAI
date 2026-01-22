"use client";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <nav
            className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled
                ? "bg-white/80 backdrop-blur-md shadow-sm py-4 border-b border-white/20"
                : "bg-transparent py-6"
                }`}
        >
            <div className="container-main flex items-center justify-between">
                <Link href="/" className="flex items-center gap-2 group">
                    <div className="w-10 h-10 bg-gradient-to-tr from-primary-600 to-secondary-600 rounded-xl flex items-center justify-center text-white shadow-lg group-hover:shadow-primary-500/30 transition-shadow">
                        <svg
                            className="w-6 h-6"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 6V4m0 2a9 9 0 110 18m0-18a9 9 0 100 18m0-18V4m0 2a9 9 0 110 18m0-18a9 9 0 100 18"
                            />
                        </svg>
                    </div>
                    <span className={`text-2xl font-bold font-heading track-tight ${scrolled ? 'text-slate-900' : 'text-slate-900'}`}>
                        Swasthiy<span className="text-primary-600">AI</span>
                    </span>
                </Link>

                {/* Desktop Menu */}
                <div className="hidden md:flex items-center gap-8">
                    {["Features", "About", "Contact"].map((item) => (
                        <Link
                            key={item}
                            href={`#${item.toLowerCase()}`}
                            className="text-slate-600 font-medium hover:text-primary-600 transition-colors"
                        >
                            {item}
                        </Link>
                    ))}
                </div>

                {/* Auth Buttons */}
                <div className="hidden md:flex items-center gap-4">
                    <Link
                        href="/login"
                        className="text-slate-600 font-medium hover:text-primary-600 transition-colors"
                    >
                        Log in
                    </Link>
                    <Link
                        href="/register"
                        className="px-6 py-2.5 bg-slate-900 text-white rounded-full font-medium shadow-lg shadow-slate-900/20 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300"
                    >
                        Get Started
                    </Link>
                </div>
            </div>
        </nav>
    );
}
