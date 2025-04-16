import { useEffect } from "react";
import { useParams, useLocation } from "wouter";
import WindsurfRuleDetail from "@/components/WindsurfRuleDetail";

export default function WindsurfRuleDetailPage() {
  const { id } = useParams();
  const [, setLocation] = useLocation();

  // Don't redirect immediately to allow the detail page to render
  useEffect(() => {
    console.log('WindsurfRuleDetailPage mounted with ID:', id);
    
    // We'll keep this commented out to stop the redirect
    // setLocation(`/mcp-rules#windsurf-rules/${id}`);
  }, [id, setLocation]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900">
      {/* Background effects */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-slate-950"></div>
        <div className="absolute top-0 right-0 w-[1000px] h-[1000px] bg-indigo-600/10 rounded-full blur-[150px] -z-10 opacity-70"></div>
        <div className="absolute bottom-0 left-0 w-[800px] h-[800px] bg-purple-600/10 rounded-full blur-[120px] -z-10 opacity-70"></div>
      </div>
      
      <div className="container mx-auto px-4 pt-24 pb-16">
        <WindsurfRuleDetail ruleId={id} />
      </div>
    </div>
  );
} 