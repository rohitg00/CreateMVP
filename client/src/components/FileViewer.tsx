import { motion } from "framer-motion";
import { X, Download, Copy, ExternalLink, FileText, Code, Layers } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import ReactMarkdown from "react-markdown";

interface FileViewerProps {
  fileName: string;
  content: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function FileViewer({ fileName, content, isOpen, onClose }: FileViewerProps) {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    
    toast({
      title: "Copied to clipboard",
      description: `${fileName} content has been copied to your clipboard.`,
    });
  };
  
  const handleDownload = () => {
    // Create a blob with the file content
    const blob = new Blob([content], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    
    // Create a temporary link and trigger download
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    
    // Clean up
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "File Downloaded",
      description: `${fileName} has been downloaded.`,
    });
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        transition={{ type: "spring", duration: 0.5 }}
        className="bg-slate-900 rounded-xl border border-indigo-500/30 w-full max-w-4xl max-h-[80vh] flex flex-col shadow-xl shadow-indigo-500/10"
      >
        <div className="flex items-center justify-between p-4 border-b border-indigo-500/20 bg-gradient-to-r from-slate-800 to-indigo-900/30">
          <h3 className="text-lg font-semibold text-white flex items-center">
            <span className="bg-gradient-to-r from-indigo-600/20 to-indigo-900/20 p-1.5 rounded mr-2 border border-indigo-500/20">
              {fileName.endsWith("md") ? (
                <FileIcon fileName={fileName} size={18} />
              ) : (
                <FileIcon fileName={fileName} size={18} />
              )}
            </span>
            {fileName}
          </h3>
          <div className="flex items-center space-x-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="border-indigo-600/30 bg-indigo-950/50 text-indigo-300 hover:bg-indigo-800/50 shadow-sm"
              onClick={handleCopy}
            >
              {copied ? (
                "Copied!"
              ) : (
                <>
                  <Copy className="h-4 w-4 mr-2 text-indigo-300" />
                  Copy
                </>
              )}
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="border-indigo-600/30 bg-indigo-950/50 text-indigo-300 hover:bg-indigo-800/50 shadow-sm"
              onClick={handleDownload}
            >
              <Download className="h-4 w-4 mr-2 text-indigo-300" />
              Download
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-white hover:text-white hover:bg-indigo-800/50"
              onClick={onClose}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>
        
        <div className="flex-1 overflow-auto p-6 bg-gradient-to-b from-slate-900 to-slate-900/90">
          <div className="prose prose-invert prose-md max-w-none">
            <ReactMarkdown>{content}</ReactMarkdown>
          </div>
        </div>
        
        <div className="p-4 border-t border-indigo-500/20 flex justify-end items-center bg-gradient-to-r from-slate-800 to-indigo-900/30">
          <Button 
            onClick={handleDownload}
            className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 shadow-md text-white"
          >
            <Download className="h-4 w-4 mr-2" />
            Download File
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// Helper component to show file icon based on file name
function FileIcon({ fileName, size = 24 }) {
  if (fileName.includes("backend")) {
    return <Code className={`h-${size/6} w-${size/6} text-indigo-400`} />;
  } else if (fileName.includes("flow")) {
    return <ExternalLink className={`h-${size/6} w-${size/6} text-purple-400`} />;
  } else if (fileName.includes("front")) {
    return <Layers className={`h-${size/6} w-${size/6} text-pink-400`} />;
  } else if (fileName.includes("tech")) {
    return <Layers className={`h-${size/6} w-${size/6} text-yellow-400`} />;
  } else {
    return <FileText className={`h-${size/6} w-${size/6} text-blue-400`} />;
  }
} 