import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import RequirementUpload from "@/components/RequirementUpload";

export default function GeneratePage() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-indigo-950 to-slate-900">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-10"
          >
            <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 mb-4">
              Generate Your MVP Plan
            </h1>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto">
              Enter your project requirements below or upload a document to generate a comprehensive MVP implementation plan.
            </p>
          </motion.div>

          <RequirementUpload />
        </div>
      </div>
    </div>
  );
} 