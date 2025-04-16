import { motion } from "framer-motion";
import { FileText, Code, GitBranch, Layers, CheckCircle, Database, Activity, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";

interface GeneratedFileCardProps {
  fileName: string;
  title: string;
  delay: number;
  onViewFile?: (fileName: string) => void;
}

// Map file names to their corresponding icons
const fileIconMap: Record<string, React.ReactNode> = {
  "backend.md": <Code className="h-6 w-6 text-indigo-400" />,
  "flow.md": <GitBranch className="h-6 w-6 text-purple-400" />,
  "frontend.md": <Layers className="h-6 w-6 text-pink-400" />,
  "prd.md": <FileText className="h-6 w-6 text-blue-400" />,
  "requirements.md": <CheckCircle className="h-6 w-6 text-green-400" />,
  "status.md": <Activity className="h-6 w-6 text-orange-400" />,
  "techstack.md": <Database className="h-6 w-6 text-yellow-400" />,
};

// Map file names to their display titles
const fileTitleMap: Record<string, string> = {
  "backend.md": "Backend Implementation",
  "flow.md": "User Flow Diagram",
  "frontend.md": "Frontend Implementation",
  "prd.md": "Product Requirements Document",
  "requirements.md": "Technical Requirements",
  "status.md": "Project Status",
  "techstack.md": "Technology Stack",
};

export default function GeneratedFileCard({ fileName, title, delay, onViewFile }: GeneratedFileCardProps) {
  const icon = fileIconMap[fileName] || <FileText className="h-6 w-6 text-slate-400" />;
  const displayTitle = fileTitleMap[fileName] || title;
  
  const handleViewFile = () => {
    if (onViewFile) {
      onViewFile(fileName);
    }
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: delay, type: "spring" }}
      className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 p-6 rounded-xl border border-indigo-500/20 hover:border-indigo-500/40 transition-all hover:shadow-lg shadow-md hover:shadow-indigo-500/10 group cursor-pointer"
      onClick={handleViewFile}
    >
      <div className="flex items-start">
        <div className="bg-gradient-to-br from-indigo-900/50 to-slate-800/80 p-3 rounded-lg mr-4 shadow-inner border border-indigo-600/20">
          {icon}
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-white mb-1 group-hover:text-indigo-300 transition-colors">{displayTitle}</h3>
          <p className="text-indigo-200/60 text-sm mb-3">{fileName}</p>
          <Button 
            variant="outline" 
            size="sm" 
            className="text-sm border-indigo-500/30 bg-indigo-900/30 text-indigo-300 hover:bg-indigo-800/50 hover:border-indigo-500/50 transition-all shadow-sm"
            onClick={(e) => {
              e.stopPropagation();
              handleViewFile();
            }}
          >
            <Eye className="h-3.5 w-3.5 mr-1.5 text-indigo-300" />
            View File
          </Button>
        </div>
      </div>
    </motion.div>
  );
} 