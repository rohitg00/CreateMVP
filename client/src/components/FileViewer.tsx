import { motion } from "framer-motion";
import { X, Download, Copy, ExternalLink, FileText, Code, Layers } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import ReactMarkdown from "react-markdown";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DialogClose } from "@/components/ui/dialog";

interface FileViewerProps {
  fileName: string;
  content: string;
  isOpen: boolean;
  onClose: () => void;
  isOriginalContent?: boolean;
}

export default function FileViewer({
  fileName,
  content,
  isOpen,
  onClose,
  isOriginalContent = true
}: FileViewerProps) {
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
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl h-[80vh] p-0 bg-slate-900 border-slate-700">
        <DialogHeader className="p-4 border-b border-slate-800 flex flex-row items-center justify-between">
          <div className="flex items-center gap-3">
            <DialogTitle className="text-white flex items-center gap-2">
              <FileText className="h-5 w-5 text-indigo-400" />
              {fileName}
            </DialogTitle>
            
            {isOriginalContent ? (
              <span className="px-2 py-0.5 text-xs rounded-full bg-green-900/60 text-green-300 border border-green-700/50">
                Original Quality
              </span>
            ) : (
              <span className="px-2 py-0.5 text-xs rounded-full bg-amber-900/60 text-amber-300 border border-amber-700/50">
                Regenerated
              </span>
            )}
          </div>
          
          <div className="flex gap-2">
            <Button 
              variant="ghost" 
              size="sm"
              className="text-slate-300 hover:text-white hover:bg-slate-800"
              onClick={() => {
                navigator.clipboard.writeText(content);
                toast({
                  title: "Copied to clipboard",
                  description: "The file content has been copied to your clipboard",
                });
              }}
            >
              <Copy className="h-4 w-4 mr-2" />
              Copy
            </Button>
            <DialogClose asChild>
              <Button 
                variant="ghost" 
                size="sm"
                className="text-slate-300 hover:text-white hover:bg-slate-800"
              >
                <X className="h-4 w-4" />
              </Button>
            </DialogClose>
          </div>
        </DialogHeader>
        
        <div className="flex-1 overflow-auto p-6 bg-gradient-to-b from-slate-900 to-slate-900/90">
          <div className="prose prose-invert prose-md max-w-none prose-headings:text-indigo-300 prose-h1:text-2xl prose-h1:border-b prose-h1:border-indigo-500/20 prose-h1:pb-2 prose-h2:text-xl prose-h2:text-indigo-400 prose-h3:text-lg prose-h3:text-pink-300 prose-a:text-blue-400 prose-strong:text-yellow-300 prose-em:text-indigo-200 prose-code:text-green-300 prose-pre:bg-slate-800 prose-pre:border prose-pre:border-indigo-800/30 prose-pre:rounded-md prose-blockquote:border-l-indigo-500 prose-blockquote:bg-indigo-950/20 prose-blockquote:px-4 prose-blockquote:py-1 prose-blockquote:rounded-r-md prose-li:marker:text-indigo-400">
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
      </DialogContent>
    </Dialog>
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