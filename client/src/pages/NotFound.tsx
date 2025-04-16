import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-slate-800/50 backdrop-blur-md rounded-xl border border-slate-700/50 p-8 text-center">
        <div className="inline-flex justify-center items-center w-16 h-16 bg-red-900/20 rounded-full mb-6">
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-400">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
        </div>
        <h1 className="text-4xl font-bold text-white mb-4">404 Page Not Found</h1>
        <p className="text-slate-300 mb-8">
          The page you're looking for doesn't exist or has been moved. Please check the URL or navigate to another page.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/">
            <Button className="bg-indigo-600 hover:bg-indigo-700 text-white w-full">
              Go to Home
            </Button>
          </Link>
          <Button 
            variant="outline" 
            className="bg-slate-800/50 border-slate-700 text-white w-full"
            onClick={() => window.history.back()}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Go Back
          </Button>
        </div>
      </div>
    </div>
  );
} 