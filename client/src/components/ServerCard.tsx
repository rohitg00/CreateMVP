import React from "react";
import { motion } from "framer-motion";
import { CheckCircle } from "lucide-react";
import { Badge } from "./ui/badge";

interface ServerCardProps {
  name: string;
  logo: string;
  description: string;
  features?: string[];
  official?: boolean;
  githubUrl?: string;
  websiteUrl?: string;
}

export const ServerCard: React.FC<ServerCardProps> = ({
  name,
  logo,
  description,
  features = [],
  official = true,
  githubUrl,
  websiteUrl,
}) => {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
      className="bg-slate-800/50 backdrop-blur-md rounded-xl border border-slate-700/50 overflow-hidden hover:border-indigo-500/50 hover:shadow-lg hover:shadow-indigo-500/5 transition-all h-full"
    >
      <div className="relative p-5 sm:p-6 flex flex-col h-full">
        {/* Background decoration */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-blue-500/5 pointer-events-none"></div>
        
        <div className="relative z-10">
          {/* Header */}
          <div className="flex items-center gap-4 mb-4">
            {/* Logo container */}
            <div className="flex-shrink-0 h-10 w-10 sm:h-12 sm:w-12 bg-slate-700/70 rounded-lg flex items-center justify-center overflow-hidden">
              <img src={logo} alt={name} className="h-6 w-6 sm:h-8 sm:w-8 object-contain" />
            </div>
            
            {/* Title and badge */}
            <div>
              <h3 className="text-lg sm:text-xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-white to-indigo-200 mb-1 text-balance">
                {name}
              </h3>
              
              {official !== undefined && (
                <Badge className={official ? 
                  "bg-indigo-600/70 text-indigo-100 text-[10px] font-normal" : 
                  "bg-emerald-600/70 text-emerald-100 text-[10px] font-normal"}>
                  {official ? "Official" : "Community"}
                </Badge>
              )}
            </div>
          </div>
          
          {/* Description */}
          <p className="text-slate-300 text-sm sm:text-base mb-5 text-pretty line-clamp-3">
            {description}
          </p>
          
          {/* Features list */}
          {features && features.length > 0 && (
            <div className="mt-auto mb-4">
              <ul className="space-y-2">
                {features.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <CheckCircle className="mr-2 h-5 w-5 flex-shrink-0 text-indigo-400" />
                    <span className="text-sm text-slate-300">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          {/* Links section */}
          <div className="flex items-center gap-3 mt-auto pt-4">
            {githubUrl && (
              <a 
                href={githubUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-xs bg-slate-700 hover:bg-slate-600 text-slate-300 py-1 px-2 rounded-md flex items-center gap-1 transition-colors"
                onClick={(e) => e.stopPropagation()}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
                </svg>
                GitHub
              </a>
            )}
            
            {websiteUrl && (
              <a 
                href={websiteUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-xs bg-slate-700 hover:bg-slate-600 text-slate-300 py-1 px-2 rounded-md flex items-center gap-1 transition-colors"
                onClick={(e) => e.stopPropagation()}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
                  <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
                </svg>
                Website
              </a>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}; 