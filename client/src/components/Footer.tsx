
import { Link } from "wouter";

export default function Footer() {
  return (
    <footer className="bg-slate-900 py-12 border-t border-slate-800">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center">
          <div className="flex items-center mb-6">
            <img src="/logo.png" alt="CreateMVP Logo" className="h-8 mr-3" />
            <span className="text-white font-bold text-xl">CreateMVP</span>
          </div>
          <p className="text-slate-400 mb-2">© {new Date().getFullYear()} CreateMVP. All rights reserved.</p>
          <p className="text-slate-500 mb-6 text-sm">
            Open source on <a href="https://github.com/rohitg00/CreateMVP" target="_blank" rel="noreferrer" className="text-indigo-400 hover:text-indigo-300 transition-colors">GitHub</a> - 
            See repository for contribution guidelines
          </p>
          
          <div className="w-full max-w-2xl mx-auto border-t border-slate-800 pt-6 mt-2"></div>
          
          <div className="flex flex-wrap justify-center gap-6 mt-4">
            <Link href="/public/privacy-policy.html" className="text-slate-400 hover:text-indigo-400 transition-colors text-sm">
              Privacy Policy
            </Link>
            <Link href="/public/terms-and-conditions.html" className="text-slate-400 hover:text-indigo-400 transition-colors text-sm">
              Terms & Conditions
            </Link>
            <Link href="/public/refund-policy.html" className="text-slate-400 hover:text-indigo-400 transition-colors text-sm">
              Refund Policy
            </Link>
            <a href="mailto:createmvp@devrelasservice.com" className="text-slate-400 hover:text-indigo-400 transition-colors text-sm">
              Contact Us
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
