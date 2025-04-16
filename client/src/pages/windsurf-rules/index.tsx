import WindsurfRules from "@/components/WindsurfRules";

export default function WindsurfRulesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900">
      {/* Background effects */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-slate-950"></div>
        <div className="absolute top-0 right-0 w-[1000px] h-[1000px] bg-indigo-600/10 rounded-full blur-[150px] -z-10 opacity-70"></div>
        <div className="absolute bottom-0 left-0 w-[800px] h-[800px] bg-purple-600/10 rounded-full blur-[120px] -z-10 opacity-70"></div>
      </div>
      
      <div className="container mx-auto px-4 pt-24 pb-16">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">Windsurf Rules</h1>
          <p className="text-xl text-slate-300">
            A collection of rules for the Windsurf AI system, focused on memory persistence and effective programming across different technologies.
          </p>
        </div>
        
        <WindsurfRules />
      </div>
    </div>
  );
} 