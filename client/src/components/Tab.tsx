import React from "react";
import { motion } from "framer-motion";
import { cn } from "../lib/utils";

interface TabProps {
  value: string;
  title: string;
  isActive: boolean;
  onClick: (value: string) => void;
  className?: string;
}

export const Tab: React.FC<TabProps> = ({
  value,
  title,
  isActive,
  onClick,
  className,
}) => {
  return (
    <motion.button
      whileHover={{ scale: isActive ? 1 : 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={() => onClick(value)}
      className={cn(
        "relative px-3 py-2 text-sm sm:text-base font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 rounded-t-md",
        isActive 
          ? "text-white" 
          : "text-slate-400 hover:text-slate-300",
        className
      )}
    >
      {title}
      
      {/* Active indicator underline */}
      {isActive && (
        <motion.div
          layoutId="activeTab"
          className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-500"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        />
      )}
    </motion.button>
  );
}; 