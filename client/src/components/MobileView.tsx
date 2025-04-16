import React from "react";
import { motion } from "framer-motion";
import { CheckCircle } from "lucide-react";

interface MobileViewProps {
  name: string;
  icon: React.ReactNode;
  description: string;
  url: string;
  type: "server" | "rule";
  features?: string[];
}

export const MobileView: React.FC<MobileViewProps> = ({
  name,
  icon,
  description,
  url,
  type,
  features = [],
}) => {
  // Determine background color based on type
  const bgGradient = type === "server" 
    ? "from-indigo-500/5 to-blue-500/5" 
    : "from-purple-500/5 to-pink-500/5";
  
  const iconColor = type === "server" ? "text-indigo-400" : "text-purple-400";
  
  const titleGradient = type === "server"
    ? "from-white to-indigo-200"
    : "from-white to-purple-200";

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
      className={`bg-slate-800/50 backdrop-blur-md rounded-xl border border-slate-700/50 overflow-hidden hover:border-${type === "server" ? "indigo" : "purple"}-500/50 hover:shadow-lg hover:shadow-${type === "server" ? "indigo" : "purple"}-500/5 transition-all h-full`}
    >
      <div className="relative p-5 sm:p-6 flex flex-col h-full">
        {/* Background decoration */}
        <div className={`absolute inset-0 bg-gradient-to-br ${bgGradient} pointer-events-none`}></div>
        
        <div className="relative z-10">
          {/* Header */}
          <div className="flex items-center gap-3 mb-4">
            {/* Icon container */}
            <div className="flex-shrink-0 h-10 w-10 sm:h-12 sm:w-12 bg-slate-700/70 rounded-lg flex items-center justify-center">
              {typeof icon === "string" ? (
                <img src={icon as string} alt={name} className="h-6 w-6 sm:h-8 sm:w-8 object-contain" />
              ) : (
                icon
              )}
            </div>
            
            {/* Title */}
            <div>
              <h3 className={`text-lg sm:text-xl font-semibold bg-clip-text text-transparent bg-gradient-to-r ${titleGradient} text-balance`}>
                {name}
              </h3>
            </div>
          </div>
          
          {/* Description */}
          <p className="text-slate-300 text-sm sm:text-base mb-5 text-pretty">
            {description}
          </p>
          
          {/* Features list - only shown if features are provided */}
          {features.length > 0 && (
            <div className="mt-auto mb-4">
              <ul className="space-y-2">
                {features.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <CheckCircle className={`mr-2 h-5 w-5 flex-shrink-0 ${iconColor}`} />
                    <span className="text-sm text-slate-300">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          {/* View button - visible on hover */}
          <div className="mt-auto pt-3">
            <div className={`text-sm font-medium text-${type === "server" ? "indigo" : "purple"}-400 flex items-center`}>
              View {type === "server" ? "server" : "rule"} details
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="ml-1"
              >
                <path d="M5 12h14"></path>
                <path d="m12 5 7 7-7 7"></path>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}; 