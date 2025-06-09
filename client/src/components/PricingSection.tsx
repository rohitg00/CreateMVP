import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Check, ArrowRight, Infinity, MessageSquare, GitCompareArrows, Library, Server } from "lucide-react"; // Added new icons
import { Link } from "wouter";

import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

// --- Refined Pricing plan features ---
const freePlanFeatures = [
  "3 AI MVP Plan Generations", // Updated wording
  "Basic MVP documentation",
  "Standard AI analysis",
  "Basic tech stack recommendations",
  "Community support",
  "Full Access to AI Chat, Tool Comparison & Rules Library" // Added free tools access
];

const proPlanFeatures = [
  "Unlimited AI MVP Plan Generations", // Updated wording
  "Comprehensive MVP documentation",
  "Advanced AI analysis",
  "Custom tech stack recommendations",
  "Priority support",
  "API documentation generation",
  "Database schema design",
  "Architecture diagrams",
  "Implementation roadmap",
  "Full Access to AI Chat, Tool Comparison & Rules Library" // Added free tools access
];

// --- Helper component for the Free Tools section ---
const FreeToolHighlight = ({ icon: Icon, title, description }: { icon: React.ElementType, title: string, description: string }) => (
  <div className="flex flex-col items-center text-center p-4">
    <div className="bg-slate-700/50 p-3 rounded-full mb-3">
      <Icon className="h-6 w-6 text-indigo-400" />
    </div>
    <h4 className="font-semibold text-white mb-1">{title}</h4>
    <p className="text-sm text-slate-400">{description}</p>
  </div>
);


interface PricingSectionProps {
  isVisible: boolean;
}

export default function PricingSection({ isVisible }: PricingSectionProps) {
  const user = { id: 1, username: 'self-hosted-user' };
  const isAuthenticated = true;
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'yearly'>('monthly'); // Type clarified



  return (
    <section className="py-20 relative overflow-hidden bg-slate-900 min-h-screen">
      {/* Decorative elements */}
      <div className="absolute top-20 left-0 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl -z-10"></div>
      <div className="absolute bottom-20 right-0 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl -z-10"></div>

      <div className="container mx-auto px-4">
        {/* Main Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12" // Reduced bottom margin slightly
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Flexible Pricing Plans</h2>
          <p className="text-slate-400 max-w-2xl mx-auto">
            Choose the plan that works best for your MVP planning needs.
          </p>
        </motion.div>

        {/* --- NEW: Free Tools Highlight Section --- */}
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
           transition={{ duration: 0.8, delay: 0.1 }} // Slight delay
           className="mb-16 bg-slate-800/30 border border-slate-700/30 rounded-xl p-6"
        >
            <h3 className="text-2xl font-semibold text-center text-white mb-6">Powerful Planning Tools Included for Everyone</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <FreeToolHighlight
                    icon={MessageSquare}
                    title="AI Chat Assistant"
                    description="Brainstorm ideas, refine concepts, and get instant feedback from advanced AI models."
                />
                <FreeToolHighlight
                    icon={GitCompareArrows} // Or use BarChart Big, Zap etc.
                    title="AI Tool Comparison"
                    description="Compare leading AI development tools side-by-side based on features, pricing, and use cases."
                />
                 <FreeToolHighlight
                    icon={Library} // Or use Server, Code, Workflow etc.
                    title="MCP & Rules Library"
                    description="Access curated MCP servers and workflow rules (Cursor, Windsurf) to enhance your development process."
                />
            </div>
        </motion.div>
        {/* --- End of Free Tools Section --- */}


        {/* Pricing Cards Grid */}
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Free Plan Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
            transition={{ duration: 0.8, delay: 0.2 }} // Adjusted delay
            className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-2xl border border-slate-700/30 overflow-hidden flex flex-col" // Added flex flex-col
          >
            <div className="p-8 flex-grow"> {/* Added flex-grow */}
              <h3 className="text-xl font-bold text-white mb-2">Free Plan</h3>
              <div className="flex items-baseline mb-6">
                <span className="text-4xl font-bold text-white">$0</span>
                <span className="text-slate-400 ml-2">/month</span>
              </div>
              <p className="text-slate-300 mb-6 h-12"> {/* Added fixed height */}
                 Perfect for individuals exploring AI-powered MVP planning and leveraging our free toolkit.
              </p>

              <Link href={user ? "/generate" : "/auth/signup?plan=free"}>
                <Button variant="outline" className="w-full mb-6 border-indigo-400 text-indigo-300 hover:bg-indigo-950">
                  {user ? "Go to Generator" : "Get Started Free"} {/* Updated button text */}
                  {!user && <ArrowRight className="ml-2 h-4 w-4" />}
                </Button>
              </Link>

              <div className="space-y-3">
                <p className="text-sm font-semibold text-slate-200 mb-2">Includes:</p> {/* Added sub-header */}
                {freePlanFeatures.map((feature, index) => (
                  <div key={index} className="flex items-start">
                    <Check className="h-5 w-5 text-indigo-400 mr-2 flex-shrink-0 mt-0.5" />
                    <p className="text-slate-300 text-sm">{feature}</p> {/* Smaller text */}
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Pro Plan Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
            transition={{ duration: 0.8, delay: 0.4 }} // Adjusted delay
            className="bg-gradient-to-br from-indigo-900/30 to-purple-900/30 rounded-2xl border border-indigo-700/30 overflow-hidden relative flex flex-col" // Added flex flex-col
          >
            <div className="absolute top-0 right-0 bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-xs font-bold px-4 py-1 rounded-bl-lg z-10">
              RECOMMENDED
            </div>

            <div className="p-8 flex-grow"> {/* Added flex-grow */}
              <h3 className="text-xl font-bold text-white mb-2">Pro Plan</h3>
              <div className="flex items-center mb-4">
                {/* Pricing and Toggle */}
                <div className="flex-grow">
                  <div className="flex items-baseline mb-1">
                    <span className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">
                       ${selectedPlan === 'monthly' ? '12' : '120'} {/* Simplified */}
                    </span>
                    <span className="text-slate-400 ml-2">/{selectedPlan}</span>
                  </div>
                  {selectedPlan === 'yearly' && (
                     <p className="text-xs text-indigo-300 font-medium">Billed annually ($10/month equivalent)</p>
                  )}
                </div>
                 {/* Monthly/Yearly Toggle Buttons */}
                 <div className="flex space-x-1 bg-slate-800/50 p-1 rounded-lg">
                    <button
                        onClick={() => setSelectedPlan('monthly')}
                        className={`px-3 py-1 text-sm rounded-md ${selectedPlan === 'monthly' ? 'bg-indigo-600 text-white font-semibold' : 'text-slate-400 hover:text-white'}`}
                    >
                        Monthly
                    </button>
                    <button
                        onClick={() => setSelectedPlan('yearly')}
                        className={`px-3 py-1 text-sm rounded-md ${selectedPlan === 'yearly' ? 'bg-indigo-600 text-white font-semibold' : 'text-slate-400 hover:text-white'}`}
                    >
                        Yearly
                    </button>
                 </div>
              </div>
              <p className="text-slate-300 mb-6 h-12"> {/* Added fixed height */}
                 For professionals and teams needing unlimited, in-depth MVP documentation and planning capabilities.
              </p>

                {/* Action Button (Simplified for self-hosted) */}
              <Link href={user ? "/generate" : "/auth/signup"}>
                <Button className="w-full mb-6 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white">
                  {user ? "Start Generating" : "Get Started"}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>

               {/* Feature List */}
              <div className="space-y-3">
                <p className="text-sm font-semibold text-slate-200 mb-2">Everything in Free, plus:</p> {/* Added sub-header */}
                {proPlanFeatures.map((feature, index) => {
                  const isUnlimited = feature.toLowerCase().includes("unlimited");
                  const isFreeToolAccess = feature.toLowerCase().includes("full access"); // Check for the shared feature
                  // Don't render the "Full Access..." line again if it was in free plan features already shown implicitly
                  // Or explicitly render it differently if needed, but here we skip it as it's implied by "Everything in Free, plus:"
                  if (isFreeToolAccess) return null;

                  return (
                    <div key={index} className="flex items-start">
                       {isUnlimited ? (
                         <Infinity className="h-5 w-5 text-purple-400 mr-2 flex-shrink-0 mt-0.5" />
                       ) : (
                         <Check className="h-5 w-5 text-indigo-400 mr-2 flex-shrink-0 mt-0.5" />
                       )}
                       <p className={`text-slate-300 text-sm ${isUnlimited ? 'font-medium text-purple-300' : ''}`}>
                           {/* Optionally remove "AI MVP Plan Generations" part if using Infinity icon */}
                           {isUnlimited ? feature.replace("AI MVP Plan Generations", "").trim() : feature}
                        </p>
                    </div>
                  );
                 })}
              </div>
            </div>
          </motion.div>
        </div> {/* End of Grid */}

        {/* Payment Processing Note */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
          transition={{ duration: 0.8, delay: 0.6 }} // Adjusted delay
          className="text-center mt-12 max-w-2xl mx-auto"
        >
          <p className="text-slate-400 text-sm"> {/* Smaller text */}
            Secure payment processing through Polar.
            <a href="mailto:createmvp@devrelasservice.com" className="text-indigo-400 hover:text-indigo-300 ml-1 underline decoration-dotted hover:decoration-solid">
              Need help or have questions?
            </a>
          </p>
        </motion.div>
      </div>
    </section>
  );
}
