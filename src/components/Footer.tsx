import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-slate-50 pt-20 pb-10 border-t border-slate-200">
      <div className="container-main">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-tr from-primary-600 to-secondary-600 rounded-lg flex items-center justify-center text-white">
                <svg
                  className="w-5 h-5"
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
              <span className="text-xl font-bold font-heading text-slate-900">
                Swasthya<span className="text-primary-600">Setu</span>
              </span>
            </div>
            <p className="text-slate-500 leading-relaxed">
              Empowering healthcare providers with intelligent tools for better patient outcomes.
            </p>
          </div>

          <div>
            <h3 className="font-bold text-slate-900 mb-6">Product</h3>
            <ul className="space-y-4">
              {['Features', 'Security', 'Pricing', 'Resources'].map((item) => (
                <li key={item}>
                  <Link href="#" className="text-slate-500 hover:text-primary-600 transition-colors">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-slate-900 mb-6">Company</h3>
            <ul className="space-y-4">
              {['About Us', 'Careers', 'Showcase', 'Contact'].map((item) => (
                <li key={item}>
                  <Link href="#" className="text-slate-500 hover:text-primary-600 transition-colors">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-slate-900 mb-6">Legal</h3>
            <ul className="space-y-4">
              {['Terms', 'Privacy', 'Cookies', 'Licenses'].map((item) => (
                <li key={item}>
                  <Link href="#" className="text-slate-500 hover:text-primary-600 transition-colors">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-200 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-slate-500 text-sm">
            &copy; {new Date().getFullYear()} SwasthyaSetu. All rights reserved.
          </p>
          <div className="flex gap-6">
            {/* Social Placeholders */}
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="w-5 h-5 bg-slate-300 rounded-full hover:bg-primary-600 transition-colors cursor-pointer" />
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
