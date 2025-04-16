import { motion } from "framer-motion";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import GeneratedFileCard from "./GeneratedFileCard";

interface GeneratedFilesProps {
  isVisible?: boolean;
  files?: string[];
  onViewFile?: (fileName: string) => void;
  onDownloadAll?: () => void;
}

// Map of file names to titles
const fileTitles: Record<string, string> = {
  "prd.md": "Product Requirements Document",
  "requirements.md": "Technical Requirements",
  "techstack.md": "Technology Stack",
  "flow.md": "User Flow Diagram",
  "frontend.md": "Frontend Implementation",
  "backend.md": "Backend Implementation",
  "status.md": "Project Status",
};

export default function GeneratedFiles({ isVisible = true, files = [], onViewFile, onDownloadAll }: GeneratedFilesProps) {
  if (!isVisible) return null;

  // If no files provided, use defaults
  const filesToRender = files.length > 0 ? files : Object.keys(fileTitles);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, type: "spring" }}
      className="bg-gradient-to-br from-slate-800/80 to-indigo-900/30 p-8 rounded-2xl border border-indigo-500/20 mb-8 shadow-lg"
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white">Generated MVP Plan</h2>
        <Button 
          size="sm" 
          className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 shadow-md text-white"
          onClick={(e) => {
            e.preventDefault();
            onDownloadAll?.();
          }}
        >
          <Download className="h-4 w-4 mr-2" />
          Download All
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filesToRender.map((fileName, index) => (
          <GeneratedFileCard
            key={fileName}
            fileName={fileName}
            title={fileTitles[fileName] || fileName}
            delay={index * 0.1}
            onViewFile={onViewFile}
          />
        ))}
      </div>
    </motion.div>
  );
} 