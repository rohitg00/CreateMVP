import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Loader2, CheckCircle, AlertCircle } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface GenerationProcessProps {
  isGenerating: boolean;
  onComplete: () => void;
}

const generationSteps = [
  "Analyzing requirements...",
  "Determining optimal tech stack...",
  "Creating product requirements document...",
  "Designing user flow...",
  "Planning frontend implementation...",
  "Planning backend implementation...",
  "Finalizing project status and timeline..."
];

export default function GenerationProcess({ isGenerating, onComplete }: GenerationProcessProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isGenerating) return;

    const interval = setInterval(() => {
      setCurrentStep(prev => {
        if (prev < generationSteps.length - 1) {
          return prev + 1;
        } else {
          clearInterval(interval);
          // Simulate completion after the last step
          setTimeout(() => {
            onComplete();
          }, 1000);
          return prev;
        }
      });
    }, 1500); // Each step takes 1.5 seconds

    return () => clearInterval(interval);
  }, [isGenerating, onComplete]);

  useEffect(() => {
    if (!isGenerating) return;
    
    // Update progress based on current step
    setProgress(Math.round((currentStep / (generationSteps.length - 1)) * 100));
  }, [currentStep, isGenerating]);

  if (!isGenerating) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 p-8 rounded-2xl border border-slate-700/30 mb-8"
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-white">Generating MVP Plan</h2>
        <div className="text-indigo-400 font-medium">{progress}%</div>
      </div>

      <Progress value={progress} className="h-2 mb-8 bg-slate-700" indicatorClassName="bg-gradient-to-r from-indigo-500 to-purple-600" />

      <div className="space-y-4">
        {generationSteps.map((step, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -10 }}
            animate={{ 
              opacity: index <= currentStep ? 1 : 0.4,
              x: 0 
            }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className={`flex items-center ${index <= currentStep ? 'text-white' : 'text-slate-500'}`}
          >
            <div className="mr-3 flex-shrink-0">
              {index < currentStep ? (
                <CheckCircle className="h-5 w-5 text-green-500" />
              ) : index === currentStep ? (
                <Loader2 className="h-5 w-5 text-indigo-400 animate-spin" />
              ) : (
                <div className="h-5 w-5 rounded-full border-2 border-slate-600" />
              )}
            </div>
            <p>{step}</p>
          </motion.div>
        ))}
      </div>

      {error && (
        <div className="mt-6 flex items-center text-red-400">
          <AlertCircle className="h-5 w-5 mr-2" />
          <p>{error}</p>
        </div>
      )}
    </motion.div>
  );
} 