import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-primary-50/50 to-transparent" />
          <div className="absolute -top-20 right-0 w-[600px] h-[600px] bg-primary-200/30 rounded-full blur-3xl animate-pulse-slow" />
          <div className="absolute top-40 left-0 w-[400px] h-[400px] bg-secondary-200/30 rounded-full blur-3xl animate-pulse-slow delay-1000" />
        </div>

        <div className="container-main grid lg:grid-cols-2 gap-12 items-center">
          <div className="text-center lg:text-left space-y-8 animate-fade-in-up">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full border border-slate-200 shadow-sm">
              <span className="w-2 h-2 bg-primary-500 rounded-full animate-pulse" />
              <span className="text-sm font-medium text-slate-600">Now live validation in v2.0</span>
            </div>

            <h1 className="text-5xl lg:text-7xl font-bold font-heading text-slate-900 leading-tight">
              The Future of <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-secondary-600">Healthcare</span> Management
            </h1>

            <p className="text-xl text-slate-600 leading-relaxed max-w-2xl mx-auto lg:mx-0">
              SwasthyaSetu seamlessly connects doctors, patients, and administrators in one intelligent, secure, and user-friendly platform.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-4">
              <Link href="/login" className="btn-primary">
                Get Started
              </Link>
              <Link href="#features" className="btn-secondary">
                Learn More
              </Link>
            </div>

            <div className="pt-8 flex items-center justify-center lg:justify-start gap-8 opacity-70 grayscale hover:grayscale-0 transition-all duration-300">
              <div className="text-sm font-semibold text-slate-400">TRUSTED BY 50+ HOSPITALS</div>
            </div>
          </div>

          <div className="relative mx-auto lg:mr-0 max-w-lg w-full">
            <div className="relative rounded-2xl bg-white shadow-2xl border border-slate-100 p-2 z-10 rotate-2 hover:rotate-0 transition-transform duration-500">
              <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl opacity-10 blur-xl -z-10" />
              <div className="bg-slate-50 rounded-xl p-6 space-y-6">
                {/* Mock UI */}
                <div className="flex items-center justify-between border-b border-slate-200 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary-100" />
                    <div className="h-4 w-24 bg-slate-200 rounded" />
                  </div>
                  <div className="h-8 w-8 bg-slate-100 rounded" />
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <div className="h-4 w-32 bg-slate-200 rounded" />
                    <div className="h-4 w-12 bg-primary-100 rounded" />
                  </div>
                  <div className="h-24 w-full bg-slate-100 rounded-lg border border-slate-200 border-dashed flex items-center justify-center text-slate-400 text-sm">
                    Patient Analytics Graph
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="h-16 bg-white rounded-lg shadow-sm p-3" />
                    <div className="h-16 bg-white rounded-lg shadow-sm p-3" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-slate-50">
        <div className="container-main">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-sm font-bold text-primary-600 tracking-wider uppercase mb-3">Key Features</h2>
            <h3 className="text-3xl md:text-4xl font-bold font-heading text-slate-900 mb-6">Designed for Modern Healthcare</h3>
            <p className="text-lg text-slate-600">Everything you need to manage your medical practice efficiently.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "AI-Powered Insights",
                desc: "Get intelligent summaries and diagnostic suggestions powered by advanced AI models.",
                icon: (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                )
              },
              {
                title: "Secure Records",
                desc: "Enterprise-grade security ensures patient data is always protected and compliant.",
                icon: (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                )
              },
              {
                title: "Real-time Dashboard",
                desc: "Live updates on patient queues, appointments, and critical alerts.",
                icon: (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
                )
              }
            ].map((feature, i) => (
              <div key={i} className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-premium hover:-translate-y-1 transition-all duration-300">
                <div className="w-12 h-12 bg-primary-50 text-primary-600 rounded-xl flex items-center justify-center mb-6">
                  {feature.icon}
                </div>
                <h4 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h4>
                <p className="text-slate-600 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Roles Section */}
      <section className="py-24">
        <div className="container-main">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <div>
                <h3 className="text-3xl font-bold font-heading text-slate-900 mb-4">Empowering Every Role</h3>
                <p className="text-lg text-slate-600">Tailored interfaces for every stakeholder in the ecosystem.</p>
              </div>

              <div className="space-y-6">
                {[
                  { role: "Doctors", desc: "Manage appointments, view history, and write AI-assisted prescriptions." },
                  { role: "Patients", desc: "Book slots, view diagnosis history, and access reports securely." },
                  { role: "Admins", desc: "Oversee hospital operations, manage staff, and analyze performance." }
                ].map((item, i) => (
                  <div key={i} className="flex gap-4 items-start">
                    <div className="w-6 h-6 rounded-full bg-secondary-100 text-secondary-600 flex items-center justify-center flex-shrink-0 mt-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900">{item.role}</h4>
                      <p className="text-slate-600 text-sm">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-tr from-secondary-500 to-primary-500 rounded-2xl blur-2xl opacity-20 transform rotate-3" />
              <div className="relative bg-white border border-slate-200 rounded-2xl p-8 shadow-xl">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-slate-100 rounded-full overflow-hidden" />
                  <div>
                    <div className="h-4 w-32 bg-slate-200 rounded mb-2" />
                    <div className="h-3 w-20 bg-slate-100 rounded" />
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="h-3 w-full bg-slate-100 rounded" />
                  <div className="h-3 w-5/6 bg-slate-100 rounded" />
                  <div className="h-3 w-4/6 bg-slate-100 rounded" />
                </div>
                <div className="mt-6 flex gap-3">
                  <div className="h-10 flex-1 bg-primary-600 rounded-lg opacity-90" />
                  <div className="h-10 flex-1 bg-slate-100 rounded-lg" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24">
        <div className="container-main">
          <div className="bg-slate-900 rounded-3xl p-12 md:p-20 text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-primary-600/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary-600/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

            <div className="relative z-10 max-w-3xl mx-auto space-y-8">
              <h2 className="text-3xl md:text-5xl font-bold font-heading text-white">Ready to Transform Your Practice?</h2>
              <p className="text-slate-300 text-lg">Join thousands of healthcare providers delivering better care with SwasthyaSetu.</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/register" className="px-8 py-4 bg-white text-slate-900 rounded-xl font-bold hover:bg-slate-100 transition shadow-lg hover:sahdow-xl hover:-translate-y-1">
                  Create Free Account
                </Link>
                <Link href="/contact" className="px-8 py-4 bg-transparent border border-slate-700 text-white rounded-xl font-bold hover:bg-slate-800 transition">
                  Contact Sales
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
