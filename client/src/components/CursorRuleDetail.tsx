import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { Link } from "wouter";
import { ArrowLeft, Copy, Check } from "lucide-react";

interface CursorRuleDetailProps {
  rule: {
    id: string;
    name: string;
    category: string;
    description: string;
    tags: string[];
    rule: string;
    featured?: boolean;
  };
}

// Improved function to parse rule content into sections
function parseRuleContent(content: string) {
  const sections: { title: string; items: string[] }[] = [];
  const lines = content.split("\n");
  
  let currentSection: { title: string; items: string[] } | null = null;
  let skipLine = false;
  
  // First extract the first line as the main intro
  if (lines.length > 0) {
    // Add an initial section for the first line
    currentSection = {
      title: "Overview",
      items: []
    };
    
    sections.push(currentSection);
  }
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    // Skip empty lines
    if (line === "") {
      continue;
    }
    
    // If we find a line that doesn't start with a dash and has content
    // and it's not a continuation from a previous line, it might be a section header
    if (!line.startsWith("-") && !skipLine) {
      // Don't create a new section for the very first line (overview)
      if (i > 0) {
        // Start a new section
        currentSection = {
          title: line,
          items: []
        };
        sections.push(currentSection);
      }
      
      // The next line might be for this section
      skipLine = true;
    } 
    // If this is a bullet point
    else if (line.startsWith("-") && currentSection) {
      currentSection.items.push(line.substring(1).trim());
      skipLine = false;
    }
    // If this is content for the current section but not a bullet point
    else if (currentSection && !skipLine) {
      // For content lines that aren't bullet points or section titles,
      // add them to the current section's items
      currentSection.items.push(line);
    } else {
      skipLine = false;
    }
  }
  
  return sections;
}

const CursorRuleDetail = ({ rule }: CursorRuleDetailProps) => {
  const [visible, setVisible] = useState(false);
  const [copied, setCopied] = useState(false);
  const sections = parseRuleContent(rule.rule);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(true);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);
  
  const copyToClipboard = () => {
    navigator.clipboard.writeText(rule.rule);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: visible ? 1 : 0, y: visible ? 0 : 20 }}
      transition={{ duration: 0.5 }}
      className="max-w-4xl mx-auto"
    >
      <div className="mb-8">
        <Link href="/mcp-rules" className="text-indigo-400 hover:text-indigo-300 flex items-center gap-1 mb-6">
          <ArrowLeft size={16} />
          Back to Rules
        </Link>
        
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">{rule.name}</h1>
            <p className="text-slate-300 mb-4">{rule.description}</p>
            
            <div className="flex items-center flex-wrap gap-2 mb-6">
              <Badge variant="outline" className="bg-indigo-500/20 text-indigo-300 border-indigo-500/30">
                {rule.category}
              </Badge>
              
              {rule.tags.map((tag, index) => (
                <Badge key={index} variant="outline" className="bg-slate-500/20 text-slate-300 border-slate-500/30">
                  {tag}
                </Badge>
              ))}
              
              {rule.featured && (
                <Badge variant="outline" className="bg-amber-500/20 text-amber-300 border-amber-500/30">
                  Featured
                </Badge>
              )}
            </div>
          </div>
          
          <button
            onClick={copyToClipboard}
            className="flex items-center gap-1 bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 px-3 py-2 rounded-md transition-colors"
          >
            {copied ? <Check size={16} /> : <Copy size={16} />}
            {copied ? "Copied" : "Copy Rule"}
          </button>
        </div>
      </div>
      
      <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-6 mb-8">
        <h2 className="text-xl font-semibold text-white mb-4">Rule Content</h2>
        
        <pre className="text-slate-300 whitespace-pre-wrap font-mono text-sm bg-slate-950/50 p-4 rounded-md overflow-auto mb-6">
          {rule.rule}
        </pre>
      </div>
      
      <div className="text-slate-400 text-sm mt-8">
        <p>
          To use this rule in Cursor, copy the entire rule content and paste it into your preferences under "Custom Rules".
        </p>
        <p className="mt-2">
          For more information on how to use custom rules in Cursor, visit the{" "}
          <a href="https://cursor.sh/docs/custom-rules" target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:text-indigo-300">
            Cursor documentation
          </a>.
        </p>
      </div>
    </motion.div>
  );
};

export default CursorRuleDetail; 