import { useEffect, useState } from "react";
import { useParams } from "wouter";
import CursorRuleDetail from "@/components/CursorRuleDetail";
import cursorRules from "@/data/rules";

export default function CursorRuleDetailPage() {
  const { id } = useParams();
  const [rule, setRule] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Find the rule with exact matching id first
    let foundRule = cursorRules.find(rule => rule.id === id);
    
    // If not found, try matching with case insensitivity
    if (!foundRule) {
      foundRule = cursorRules.find(rule => 
        rule.id.toLowerCase() === id.toLowerCase()
      );
    }
    
    // If still not found, try matching by name
    if (!foundRule) {
      foundRule = cursorRules.find(rule => 
        rule.name.toLowerCase().replace(/\s+/g, '-') === id.toLowerCase()
      );
    }
    
    // If found a matching rule, set it
    if (foundRule) {
      setRule(foundRule);
    }
    
    setLoading(false);
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-indigo-500 rounded-full border-t-transparent"></div>
      </div>
    );
  }

  if (!rule) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 flex flex-col items-center justify-center p-4">
        <h1 className="text-3xl font-bold text-white mb-4">Rule Not Found</h1>
        <p className="text-slate-300 mb-6">The cursor rule you are looking for doesn't exist.</p>
        <a href="/mcp-rules" className="text-indigo-400 hover:text-indigo-300">
          ← Back to Rules
        </a>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900">
      {/* Background effects */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-slate-950"></div>
        <div className="absolute top-0 right-0 w-[1000px] h-[1000px] bg-indigo-600/10 rounded-full blur-[150px] -z-10 opacity-70"></div>
        <div className="absolute bottom-0 left-0 w-[800px] h-[800px] bg-purple-600/10 rounded-full blur-[120px] -z-10 opacity-70"></div>
      </div>
      
      <div className="container mx-auto px-4 pt-24 pb-16">
        <CursorRuleDetail rule={rule} />
      </div>
    </div>
  );
} 