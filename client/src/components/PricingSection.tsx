import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Check, ArrowRight, Infinity } from "lucide-react";
import { Link } from "wouter";
import { useUser } from "@/lib/userContext";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

// Pricing plan features
const freePlanFeatures = [
  "5 free MVP generations",
  "Basic MVP documentation",
  "Standard AI analysis",
  "Basic tech stack recommendations",
  "Community support"
];

const proPlanFeatures = [
  "Unlimited MVP generations",
  "Comprehensive MVP documentation",
  "Advanced AI analysis",
  "Custom tech stack recommendations",
  "Priority support",
  "API documentation generation",
  "Database schema design",
  "Architecture diagrams",
  "Implementation roadmap"
];

interface PricingSectionProps {
  isVisible: boolean;
}

export default function PricingSection({ isVisible }: PricingSectionProps) {
  const { user } = useUser();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  
  // Handle upgrade to Pro plan
  const handleUpgrade = async () => {
    if (!user) return;
    
    setIsLoading(true);
    
    try {
      // Call API to get Polar checkout URL
      console.log("Fetching checkout URL...");
      const response = await fetch("/api/subscription/checkout");
      
      console.log("Response status:", response.status);
      const contentType = response.headers.get("content-type");
      
      if (!contentType || !contentType.includes("application/json")) {
        const text = await response.text();
        console.error("Non-JSON response:", text.substring(0, 100) + "...");
        throw new Error("Invalid response format");
      }
      
      const data = await response.json();
      console.log("Response data:", data);
      
      if (response.ok && data.checkoutUrl) {
        // Redirect to Polar checkout
        window.location.href = data.checkoutUrl;
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to create checkout session",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Checkout error:", error);
      toast({
        title: "Error",
        description: "Failed to connect to payment provider. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="py-20 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-20 left-0 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl -z-10"></div>
      <div className="absolute bottom-20 right-0 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl -z-10"></div>
      
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Flexible Pricing Plans</h2>
          <p className="text-slate-400 max-w-2xl mx-auto">
            Choose the plan that works best for your needs and start building your MVP today
          </p>
        </motion.div>
        
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Free Plan */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-2xl border border-slate-700/30 overflow-hidden"
          >
            <div className="p-8">
              <h3 className="text-xl font-bold text-white mb-2">Free Plan</h3>
              <div className="flex items-baseline mb-6">
                <span className="text-4xl font-bold text-white">$0</span>
                <span className="text-slate-400 ml-2">/month</span>
              </div>
              <p className="text-slate-300 mb-6">Perfect for individuals just getting started with AI-powered MVP development.</p>
              
              <Link href={user ? "/generate" : "/auth/signup?plan=free"}>
                <Button variant="outline" className="w-full mb-6 border-indigo-400 text-indigo-300 hover:bg-indigo-950">
                  {user ? "Generate Plan" : "Get Started"}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              
              <div className="space-y-3">
                {freePlanFeatures.map((feature, index) => (
                  <div key={index} className="flex items-start">
                    <Check className="h-5 w-5 text-indigo-400 mr-2 flex-shrink-0 mt-0.5" />
                    <p className="text-slate-300">{feature}</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
          
          {/* Pro Plan */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="bg-gradient-to-br from-indigo-900/30 to-purple-900/30 rounded-2xl border border-indigo-700/30 overflow-hidden relative"
          >
            <div className="absolute top-0 right-0 bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-xs font-bold px-4 py-1 rounded-bl-lg">
              RECOMMENDED
            </div>
            
            <div className="p-8">
              <h3 className="text-xl font-bold text-white mb-2">Pro Plan</h3>
              <div className="flex items-baseline mb-6">
                <span className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">$5</span>
                <span className="text-slate-400 ml-2">/month</span>
              </div>
              <p className="text-slate-300 mb-6">For professionals and teams who need comprehensive MVP documentation and planning.</p>
              
              {user ? (
                user.plan === "pro" ? (
                  <Button 
                    className="w-full mb-6 bg-gradient-to-r from-indigo-500/50 to-purple-600/50 text-white cursor-not-allowed opacity-80"
                    disabled={true}
                  >
                    Pro Plan Active
                    <Check className="ml-2 h-4 w-4" />
                  </Button>
                ) : (
                  <Button 
                    className="w-full mb-6 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700"
                    onClick={handleUpgrade}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <span className="mr-2">Processing</span>
                        <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                      </>
                    ) : (
                      <>
                        Upgrade to Pro
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
                )
              ) : (
                <Link href="/auth/signup?plan=pro">
                  <Button className="w-full mb-6 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700">
                    Get Started
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              )}
              
              <div className="space-y-3">
                {proPlanFeatures.map((feature, index) => (
                  <div key={index} className="flex items-start">
                    <Check className="h-5 w-5 text-indigo-400 mr-2 flex-shrink-0 mt-0.5" />
                    <p className="text-slate-300">{feature}</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-center mt-12 max-w-2xl mx-auto"
        >
          <p className="text-slate-400">
            Secure payment through Polar. Cancel anytime.
            <Link href="/contact" className="text-indigo-400 hover:text-indigo-300 ml-1">
              Need help?
            </Link>
          </p>
        </motion.div>
      </div>
    </section>
  );
} 