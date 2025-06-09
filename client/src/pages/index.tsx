import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowRight, Code, FileText, Zap, Layers, Sparkles, CheckCircle, ChevronRight, Download, Plus, AlertTriangle } from "lucide-react";
import { Link } from "wouter";
import Testimonials from "@/components/Testimonials";
import PricingSection from "@/components/PricingSection";


// Logos for compatible AI tools
const aiTools = [
  { name: "OpenAI", icon: "https://upload.wikimedia.org/wikipedia/commons/0/04/ChatGPT_logo.svg" },
  { name: "Claude", icon: "https://www.mescomputing.com/news/ai/media_13b863a9243381ff7394de5430fa38774577c1a90.png?width=750&format=png&optimize=medium" },
  { name: "Gemini", icon: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Google_Gemini_logo.svg/1280px-Google_Gemini_logo.svg.png" },
  { name: "GitHub Copilot", icon: "https://github.githubassets.com/images/modules/site/copilot/copilot.png" },
  { name: "Cursor", icon: "https://images.seeklogo.com/logo-png/61/3/cursor-logo-png_seeklogo-611587.png" },
  { name: "WinSurf", icon: "https://exafunction.github.io/public/images/windsurf/windsurf-app-icon.svg" },
  { name: "Replit", icon: "https://mediaresource.sfo2.digitaloceanspaces.com/wp-content/uploads/2024/04/20181734/replit-icon-logo-A666709FE9-seeklogo.com.png" },
  { name: "Bolt.new", icon: "https://cdn-1.webcatalog.io/catalog/bolt-new/bolt-new-icon-filled-256.png?v=1730692903154" },
  { name: "Lovable.dev", icon: "https://lovable.dev/icon.svg?3d7ac3d2bb57ecbe" }
];

// Create a combined array for smooth animation
const allLogos = [...aiTools, ...aiTools, ...aiTools];

// Stats for the results section
const stats = [
  { value: "85%", label: "Faster MVP Development" },
  { value: "70%", label: "Reduced Planning Time" },
  { value: "3x", label: "More Comprehensive Documentation" },
];

// Add FAQ data
interface FaqItem {
  question: string;
  answer: string;
  list?: string[];
}

const faqData: FaqItem[] = [
  {
    question: "What is CreateMVP?",
    answer: "CreateMVP is an AI-powered platform that helps you generate comprehensive implementation plans for your Minimum Viable Product (MVP) in minutes. It leverages advanced AI to create detailed technical documentation based on your product requirements.",
  },
  {
    question: "How does the implementation plan generator work?",
    answer: "Our implementation plan generator works in three simple steps:",
    list: [
      "Describe your product idea or requirements in plain language",
      "Our AI analyzes your description and generates a comprehensive plan",
      "Download your complete implementation plan as a ZIP file with all the necessary documentation"
    ]
  },
  {
    question: "What kind of documentation does it generate?",
    answer: "The platform generates various types of documentation including:",
    list: [
      "Technical requirements and specifications",
      "System architecture overview",
      "Backend implementation details",
      "Frontend implementation details",
      "API design and documentation",
      "Deployment instructions"
    ]
  },
  {
    question: "Is there a limit to how many plans I can generate?",
    answer: "Free users can generate up to 3 implementation plans. Pro subscribers have unlimited access to all features including unlimited plan generation."
  },
  {
    question: "Can I customize the generated plans?",
    answer: "Yes, once the AI generates your implementation plan, you can download it and modify it to fit your specific needs. You can also use our AI Chat to ask questions and get additional details to enhance your plan."
  }
];

export default function HomePage() {
  const [isVisible, setIsVisible] = useState(false);

  const [openFaq, setOpenFaq] = useState<number | null>(null);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  // Add toggleFaq function
  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-indigo-950 to-slate-900 overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-10">
        {/* Background effects */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-slate-950"></div>
          <div className="absolute top-0 right-0 w-[1000px] h-[1000px] bg-indigo-600/10 rounded-full blur-[150px] -z-10 opacity-70"></div>
          <div className="absolute bottom-0 left-0 w-[800px] h-[800px] bg-purple-600/10 rounded-full blur-[120px] -z-10 opacity-70"></div>
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:64px_64px]"></div>
        </div>

        <div className="container mx-auto px-6 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
            transition={{ duration: 0.8 }}
            className="max-w-6xl mx-auto text-center"
          >
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-6">
              <a href="https://www.producthunt.com/posts/createmvp-build-apps-faster-with-ai?embed=true&utm_source=badge-featured&utm_medium=badge&utm_souce=badge-createmvp-build-apps-faster-with-ai" target="_blank" rel="noopener noreferrer">
                <img 
                  src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=956027&theme=light&t=1745322386388" 
                  alt="CreateMVP: Build Apps Faster with AI - Create MVPs with AI in seconds | Product Hunt" 
                  style={{ width: '250px', height: '54px' }} 
                  width="250" 
                  height="54" 
                />
              </a>
              <a href="https://startupfa.me/s/createmvp?utm_source=createmvps.app" target="_blank" rel="noopener noreferrer">
                <img 
                  src="https://startupfa.me/badges/featured-badge.webp" 
                  alt="Featured on Startup Fame" 
                  style={{ width: '171px', height: '54px' }} 
                  width="171" 
                  height="54" 
                />
              </a>
            </div>
            <div className="inline-block mb-6 px-8 py-3 border border-indigo-500/30 rounded-full bg-indigo-500/15 backdrop-blur-sm">
              <span className="text-indigo-300 font-medium text-lg flex items-center">
                <Sparkles className="h-5 w-5 mr-2 text-indigo-400" />
                AI-Powered MVP Documentation Generator
              </span>
            </div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6 leading-tight">
              <span className="relative">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">
                  Create MVPs with AI
                </span>
                <span className="absolute bottom-0 left-0 w-full h-[8px] bg-gradient-to-r from-indigo-400/60 via-purple-400/60 to-pink-400/60 blur-sm opacity-50 rounded-full"></span>
              </span>
              <br />
              <span className="text-white">in seconds</span>
            </h1>

            <p className="text-xl md:text-2xl text-slate-300 mb-10 max-w-4xl mx-auto leading-relaxed">
              A comprehensive guide to building Minimum Viable Products using the latest AI
              tools and technologies. Generate complete implementation plans in minutes.
            </p>

            <div className="flex items-center justify-center mb-8">
              <div className="w-full max-w-4xl px-6 py-4 bg-gradient-to-r from-indigo-600/20 via-purple-600/20 to-pink-600/20 rounded-xl border border-indigo-500/30 shadow-lg shadow-indigo-500/10 backdrop-blur-sm transform hover:scale-[1.02] transition-all duration-300">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center">
                    <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white text-sm font-bold px-3 py-1.5 rounded-lg shadow-md mr-4">
                      OPEN SOURCE
                    </div>
                    <div className="text-white font-bold text-lg">
                      Self-hosted MVP generator with unlimited usage!
                    </div>
                  </div>
                  <a 
                    href="https://github.com/rohitg00/createmvp-oss" 
                    className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg text-white font-semibold transition-all duration-200" 
                    target="_blank" 
                    rel="noreferrer"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.237 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                    </svg>
                    Available on GitHub
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* AI Tools logos - completely revised for reliability */}
      <div className="relative w-full border-y border-slate-800/80 mb-10">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-indigo-500/30 to-transparent"></div>
        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-purple-500/30 to-transparent"></div>

        <div className="logos-container">
          <div className="logos-slider">
            {/* All logos in a single row */}
            {allLogos.map((tool, index) => (
              <div key={`logo-${index}`} className="logo-item">
                <img src={tool.icon} alt={tool.name} />
                <span>{tool.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Buttons - Conditionally Rendered */}
      <section className="pb-20">
        <div className="container mx-auto px-6">
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link href="/generate">
              <Button size="lg" className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-600/90 hover:to-purple-600/90 text-white px-8 py-6 rounded-xl shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40 transition-all text-lg font-medium">
                Generate MVP Plan
                <ArrowRight className="ml-2 h-6 w-6" />
              </Button>
            </Link>

            {/* Try AI Chat Button (remains the same) */}
            <Link href="/chat">
              <Button size="lg" variant="outline" className="bg-white/5 backdrop-blur-sm border-2 border-white/10 text-white px-8 py-6 rounded-xl hover:bg-white/10 hover:border-white/20 transition-all text-lg font-medium">
                Try AI Chat
                <Sparkles className="ml-2 h-6 w-6 text-yellow-400" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Results Section */}
      <section className="py-24 relative overflow-hidden">
        {/* Background elements */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-slate-950/90"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-slate-900/0 via-indigo-950/20 to-slate-900/0"></div>

          {/* Add decorative elements */}
          <div className="absolute top-20 left-[10%] w-[400px] h-[400px] rounded-full bg-indigo-600/5 blur-3xl"></div>
          <div className="absolute bottom-20 right-[10%] w-[300px] h-[300px] rounded-full bg-purple-600/5 blur-3xl"></div>
        </div>

        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-center mb-10"
          >
            <div className="inline-block mb-3">
              <div className="px-3 py-1 rounded-full bg-slate-800 text-indigo-400 text-xs font-medium tracking-wider uppercase">
                Industry-Leading Results
              </div>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
              The Results Speak <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">For Themselves</span>
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto text-lg">
              Our AI-powered platform transforms your requirements into comprehensive implementation plans
            </p>
          </motion.div>

          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-3 gap-5">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
                transition={{ duration: 0.8, delay: 0.8 + index * 0.2 }}
                  className="relative group"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/20 to-purple-600/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-70 transition-opacity duration-500"></div>

                  <div className="relative z-10 h-full bg-gradient-to-br from-slate-800/70 to-slate-900/70 backdrop-blur-xl p-8 rounded-2xl border border-slate-700/30 group-hover:border-indigo-500/30 transition-all duration-300">
                    <div className="mb-3">
                      <div className="w-12 h-12 rounded-lg flex items-center justify-center bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-500/20">
                        {index === 0 && (
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-indigo-400 w-6 h-6">
                            <polyline points="13 17 18 12 13 7"></polyline>
                            <polyline points="6 17 11 12 6 7"></polyline>
                          </svg>
                        )}
                        {index === 1 && (
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-purple-400 w-6 h-6">
                            <circle cx="12" cy="12" r="10"></circle>
                            <polyline points="12 6 12 12 16 14"></polyline>
                          </svg>
                        )}
                        {index === 2 && (
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-pink-400 w-6 h-6">
                            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                            <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
                          </svg>
                        )}
                      </div>
                    </div>

                    <div className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400 mb-2">
                  {stat.value}
                </div>

                    <p className="text-slate-300 text-lg">{stat.label}</p>

                    <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500/0 via-indigo-500/70 to-purple-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  </div>
              </motion.div>
            ))}
            </div>
          </div>

          <div className="mt-10 text-center">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 10 }}
              transition={{ duration: 0.6, delay: 1.4 }}
            >
              <Link href="/generate">
                <button className="text-indigo-400 hover:text-indigo-300 transition-colors flex items-center mx-auto">
                  <span className="mr-2">See how it works</span>
                  <svg width="18" height="18" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M6 12L10 8L6 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section / How It Works */}
      <section className="py-14 relative overflow-hidden">
        {/* Background elements */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-slate-950 to-slate-950"></div>
          <div className="absolute top-1/2 right-1/4 w-[500px] h-[500px] bg-indigo-600/5 rounded-full blur-[100px]"></div>
          <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-purple-600/5 rounded-full blur-[80px]"></div>
        </div>

        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
            transition={{ duration: 0.8, delay: 1.0 }}
            className="text-center mb-10"
          >
            <div className="inline-block mb-3">
              <div className="flex items-center justify-center w-14 h-14 mx-auto rounded-full bg-indigo-900/20 border border-indigo-500/20 mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-indigo-400 w-6 h-6">
                  <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path>
                </svg>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
                How It <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">Works</span>
              </h2>
            </div>
            <p className="text-slate-400 max-w-2xl mx-auto text-lg">
              Our AI-powered platform transforms your requirements into comprehensive implementation plans
            </p>
          </motion.div>

          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-3 gap-8 relative">
              {/* Connecting line */}
              <div className="hidden md:block absolute top-24 left-[calc(16.666%-8px)] right-[calc(16.666%-8px)] h-0.5 bg-gradient-to-r from-indigo-500/0 via-indigo-500/50 to-indigo-500/0"></div>

            {[
              {
                icon: <FileText className="h-10 w-10 text-indigo-400" />,
                title: "Define Requirements",
                description: "Enter your project requirements or upload a PDF document with your specifications.",
                step: "01"
              },
              {
                icon: <Zap className="h-10 w-10 text-purple-400" />,
                title: "AI Analysis",
                description: "Our AI analyzes your requirements and generates a comprehensive implementation plan.",
                step: "02"
              },
              {
                icon: <Code className="h-10 w-10 text-pink-400" />,
                title: "Complete Documentation",
                description: "Get detailed technical documentation, architecture plans, and implementation guides.",
                step: "03"
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
                transition={{ duration: 0.8, delay: 1.2 + index * 0.2 }}
                className="relative group"
              >
                <div className="bg-gradient-to-br from-slate-800/70 to-slate-900/70 backdrop-blur-sm p-8 rounded-2xl border border-slate-700/50 hover:border-indigo-500/30 transition-all duration-300 h-full">
                  <div className="absolute -top-5 -right-5 w-12 h-12 rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center text-white font-bold shadow-lg shadow-indigo-600/20">
                    {feature.step}
                  </div>

                  <div className="bg-gradient-to-br from-slate-800 to-slate-900 p-5 rounded-xl inline-block mb-6 border border-slate-700/50">
                    {feature.icon}
                  </div>

                  <h3 className="text-xl font-semibold text-white mb-4 group-hover:text-indigo-300 transition-colors">
                    {feature.title}
                  </h3>

                  <p className="text-slate-400 group-hover:text-slate-300 transition-colors">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
              transition={{ duration: 0.8, delay: 1.8 }}
              className="mt-16 text-center"
            >
              <Link href="/generate">
                <Button size="lg" className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 rounded-xl group">
                  <span>Start creating your MVP</span>
                  <svg width="20" height="20" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="ml-2 group-hover:translate-x-1 transition-transform">
                    <path d="M3.33337 8H12.6667" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M8 3.33334L12.6667 8.00001L8 12.6667" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <Testimonials />

      {/* Pricing Section */}
      <PricingSection isVisible={isVisible} />

      {/* Benefits Section */}
      <section className="py-20 bg-slate-900/50">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: isVisible ? 1 : 0, x: isVisible ? 0 : -20 }}
              transition={{ duration: 0.8, delay: 1.4 }}
              className="space-y-8"
            >
              <div>
                <div className="inline-flex items-center px-4 py-2 bg-indigo-500/10 rounded-full border border-indigo-500/20 mb-5">
                  <Sparkles className="h-4 w-4 text-indigo-400 mr-2" />
                  <span className="text-indigo-300 text-sm font-medium">Featured in the Demo</span>
                </div>
                <h2 className="text-4xl md:text-5xl font-bold leading-none mb-3">
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 block mb-2">
                    Supercharge
                  </span>
                  <span className="text-white">Your AI Development</span>
                </h2>
              </div>

              <p className="text-slate-300 text-lg leading-relaxed">
                Our platform transforms vague ideas into detailed implementation plans, providing the structure AI needs to build exactly what you envision.
              </p>

              <div className="space-y-4">
                {[
                  {
                    icon: <FileText className="h-5 w-5 text-indigo-400" />,
                    title: "Technical Specifications",
                    desc: "Generate detailed technical docs that any AI can follow"
                  },
                  {
                    icon: <Layers className="h-5 w-5 text-purple-400" />,
                    title: "Architecture Blueprints",
                    desc: "Get complete system architecture diagrams and flows"
                  },
                  {
                    icon: <Code className="h-5 w-5 text-pink-400" />,
                    title: "API Documentation",
                    desc: "Define endpoints, data models, and integration points"
                  },
                  {
                    icon: <Zap className="h-5 w-5 text-yellow-400" />,
                    title: "Implementation Guide",
                    desc: "Step-by-step development roadmap showcased in the demo"
                  }
                ].map((feature, index) => (
                  <div key={index} className="flex items-start group">
                    <div className="p-2 mr-4 rounded-lg bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700/50 group-hover:border-indigo-500/30 transition-all duration-300">
                      {feature.icon}
                    </div>
                    <div>
                      <h3 className="text-white font-semibold text-lg group-hover:text-indigo-300 transition-colors">
                        {feature.title}
                      </h3>
                      <p className="text-slate-400 group-hover:text-slate-300 transition-colors">
                        {feature.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <Link href="/generate">
                <Button className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl px-6 py-3 text-lg font-medium hover:shadow-lg hover:shadow-indigo-500/20 transition-all duration-300 group">
                  <span>Experience it yourself</span>
                  <ArrowRight className="ml-2 h-5 w-5 inline-flex transform group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: isVisible ? 1 : 0, x: isVisible ? 0 : 20 }}
              transition={{ duration: 0.8, delay: 1.6 }}
              className="relative z-10"
            >
              {/* YouTube video container */}
              <div className="overflow-hidden rounded-xl shadow-xl">
                {/* Direct YouTube iframe with proper parameters */}
                <div className="relative aspect-video">
                  <iframe 
                    className="absolute top-0 left-0 w-full h-full"
                    src="https://www.youtube.com/embed/Kgy-Mbw0Elo?rel=0&modestbranding=1&iv_load_policy=3&playsinline=1" 
                    title="AI MVP Guide Demo"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                    frameBorder="0"
                    loading="lazy"
                    allowFullScreen
                  ></iframe>
                </div>

                {/* Info bar below video - matches screenshot exactly */}
                <div className="flex items-center justify-between bg-slate-900 px-6 py-4">
                  <div className="text-white font-semibold text-xl">AI MVP Guide Demo</div>
                  <a 
                    href="https://www.youtube.com/watch?v=Kgy-Mbw0Elo" 
                    className="text-indigo-300 hover:text-indigo-200 flex items-center gap-2 transition-colors" 
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    <span className="text-lg">Full tutorial</span>
                    <ChevronRight className="h-5 w-5" />
                  </a>
                </div>
              </div>

              {/* Feature buttons in card style matching screenshot exactly */}
              <div className="grid grid-cols-2 gap-6 mt-6">
                <div className="bg-slate-800/90 rounded-xl p-5 border border-slate-700/50 flex items-center shadow-lg">
                  <div className="bg-indigo-900/60 p-3 rounded-full mr-4 flex-shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 text-indigo-400">
                      <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/>
                      <path d="m9 12 2 2 4-4"/>
                    </svg>
                  </div>
                  <span className="text-white font-medium text-lg">2-min generation</span>
                </div>
                <div className="bg-slate-800/90 rounded-xl p-5 border border-slate-700/50 flex items-center shadow-lg">
                  <div className="bg-purple-900/60 p-3 rounded-full mr-4 flex-shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 text-purple-400">
                      <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/>
                      <path d="M12 16v-4M12 8h.01"/>
                    </svg>
                  </div>
                  <span className="text-white font-medium text-lg">Demo walkthrough</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 relative overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-slate-950"></div>
          <div className="absolute top-1/2 right-1/2 w-[500px] h-[500px] bg-purple-500/5 rounded-full blur-[100px] opacity-70"></div>
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f0a_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f0a_1px,transparent_1px)] bg-[size:64px_64px]"></div>
        </div>

        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <div className="inline-block px-3 py-1 mb-4 text-xs font-semibold text-indigo-400 bg-indigo-950/60 rounded-full backdrop-blur-sm border border-indigo-800/30">
              Common Questions
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Frequently Asked Questions
            </h2>
            <p className="text-slate-400 text-lg">
              Everything you need to know about our AI-powered platform. Can't find the answer you're looking for? Feel free to contact us.
            </p>
          </div>

          <div className="max-w-4xl mx-auto divide-y divide-slate-800">
            {faqData.map((faq, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="py-5"
              >
                <div 
                  className="flex justify-between items-start cursor-pointer"
                  onClick={() => toggleFaq(index)}
                >
                  <h3 className="text-xl font-medium text-white pr-8">{faq.question}</h3>
                  <div className={`p-1 rounded-full transition-transform ${openFaq === index ? 'rotate-45 bg-indigo-900/30' : 'bg-slate-800/50'}`}>
                    <Plus className="h-5 w-5 text-indigo-400" />
                  </div>
                </div>
                <div className={`transition-all duration-300 ease-in-out overflow-hidden ${openFaq === index ? 'max-h-96 opacity-100 mt-4' : 'max-h-0 opacity-0'}`}>
                  <div className="prose prose-slate prose-invert max-w-none">
                    <p className="text-slate-400">{faq.answer}</p>
                    {faq.list && (
                      <ul className="mt-2 space-y-1">
                        {faq.list.map((item, i) => (
                          <li key={i} className="text-slate-400 flex items-start">
                            <span className="mr-2 mt-1 text-indigo-400">•</span> {item}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="mt-16 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center text-indigo-400 hover:text-indigo-300 transition-colors"
            >
              <Link href="/help" className="flex items-center">
                <span>Still have questions? Contact us</span>
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Open Source Section */}
      <section className="py-16 relative overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-slate-950"></div>
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[900px] h-[300px] bg-indigo-600/10 rounded-[100%] blur-[80px] opacity-20"></div>
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f0a_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f0a_1px,transparent_1px)] bg-[size:64px_64px]"></div>
        </div>

        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-block px-3 py-1 mb-4 text-xs font-semibold text-indigo-400 bg-indigo-950/60 rounded-full backdrop-blur-sm border border-indigo-800/30">
                Community-Driven
              </div>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">
                  Open Source
                </span> and Free to Use
              </h2>
              <p className="text-slate-300 text-lg mb-8 max-w-lg">
              CreateMVP is completely open source and free to use. We believe in the power of community and collaborative development. Check out our GitHub repository and contribute to the project.
              </p>

              <div className="flex flex-wrap gap-4">
                <a href="https://github.com/rohitg00/CreateMVP" target="_blank" rel="noreferrer" className="group">
                  <div className="flex items-center gap-2 px-5 py-2.5 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-200">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" className="h-5 w-5 text-white">
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.237 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                    </svg>
                    <span className="text-white">View on GitHub</span>
                  </div>
                </a>
                <a href="https://github.com/rohitg00/CreateMVP/stargazers" target="_blank" rel="noreferrer" className="group">
                  <div className="flex items-center gap-2 px-5 py-2.5 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-200">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 text-yellow-300">
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                    </svg>
                    <span className="text-white">Star the Repo</span>
                  </div>
                </a>
              </div>

              <p className="text-slate-400 text-sm mt-5">
                See the GitHub repository for contribution guidelines
              </p>
            </div>

            <div className="hidden lg:block">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/10 to-purple-500/10 rounded-xl blur-xl transform scale-95 opacity-50"></div>
                <div className="relative bg-slate-900/50 backdrop-blur-sm border border-slate-700/60 rounded-xl p-1 shadow-xl">
                  <div className="border border-slate-700/30 rounded-lg overflow-hidden">
                    <div className="flex items-center bg-slate-800/60 px-4 py-2 border-b border-slate-700/30">
                      <div className="flex space-x-1.5">
                        <div className="w-3 h-3 rounded-full bg-red-400"></div>
                        <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                        <div className="w-3 h-3 rounded-full bg-green-400"></div>
                      </div>
                      <div className="ml-4 text-xs text-slate-400">
                        README.md - ai-mvp-guide
                      </div>
                    </div>

                    <div className="p-4 bg-slate-950/50 text-sm text-slate-300 font-mono overflow-hidden">
                      <div className="flex mb-2">
                        <span className="text-slate-500 mr-2"># </span>
                        <span className="text-indigo-400">CreateMVP</span>
                      </div>
                      <div className="flex mb-4">
                        <span className="text-green-400 mr-2">[![</span>
                        <span className="text-blue-400">Stars</span>
                        <span className="text-green-400">](https://img.shields.io/github/stars/rohitg00/CreateMVP)</span>
                      </div>
                      <div className="mb-4 pl-2 border-l-2 border-slate-700 py-1">
                        An AI-powered platform to generate complete MVP implementation plans in minutes.
                      </div>
                      <div className="flex mb-2">
                        <span className="text-slate-500 mr-2">## </span>
                        <span className="text-indigo-400">Features</span>
                      </div>
                      <ul className="list-disc list-inside mb-4 space-y-1 pl-4">
                        <li><span className="text-slate-300">AI-generated MVP documentation</span></li>
                        <li><span className="text-slate-300">Technical specifications</span></li>
                        <li><span className="text-slate-300">Implementation plans</span></li>
                        <li><span className="text-slate-300">AI chat assistance</span></li>
                      </ul>
                      <div className="flex mb-2">
                        <span className="text-slate-500 mr-2">## </span>
                        <span className="text-indigo-400">Get Started</span>
                      </div>
                      <div className="bg-slate-800/40 p-2 rounded text-slate-300 font-mono text-xs mb-2">
                        npm install<br />
                        npm run dev
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-slate-950"></div>

        {/* Background gradient */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-[800px] h-[800px] bg-indigo-600/10 rounded-full blur-[120px] opacity-60"></div>
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f1a_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f1a_1px,transparent_1px)] bg-[size:64px_64px]"></div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
          transition={{ duration: 0.8, delay: 1.8 }}
          className="container mx-auto px-4"
        >
          <div className="max-w-6xl mx-auto overflow-hidden rounded-3xl bg-gradient-to-b from-slate-900 to-indigo-950 shadow-xl shadow-indigo-500/10 relative">
            {/* Background elements */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-20"></div>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,theme(colors.indigo.500/0.15),transparent_70%)]"></div>

            <div className="relative p-12 md:p-16 lg:p-20 overflow-hidden">
              {/* Decoration */}
              <div className="absolute -bottom-16 -right-16 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl"></div>
              <div className="absolute top-0 right-0 -mt-16 -mr-16 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl"></div>

              <div className="grid md:grid-cols-2 gap-12 items-center">
                <div>
                  <div className="text-indigo-400 font-semibold tracking-wide mb-2">Ready to build your MVP?</div>
                  <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
                    Transform your ideas into reality <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">faster</span>
                  </h2>
                  <p className="text-slate-300 text-lg mb-8 max-w-lg">
                    Generate a complete implementation plan in minutes and start building your product today. Our AI-powered platform handles the documentation so you can focus on building.
                  </p>

                  <div className="flex flex-col sm:flex-row gap-4">
                    <Link href="/generate">
                      <Button size="lg" className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white px-8 rounded-xl shadow-lg shadow-indigo-500/20">
                        Generate MVP Plan
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
                    <Link href="/chat">
                      <Button size="lg" variant="outline" className="bg-white/5 backdrop-blur-sm border-2 border-white/10 text-white px-6 rounded-xl hover:bg-white/10 hover:border-white/20">
                        Learn More
                      </Button>
                    </Link>
                  </div>
                </div>

                <div className="hidden md:block">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-xl blur-xl transform scale-95 opacity-50"></div>
                    <div className="relative bg-slate-800/80 backdrop-blur-sm border border-slate-700/60 rounded-xl p-6 shadow-xl">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex space-x-1.5">
                          <div className="w-3 h-3 rounded-full bg-red-400"></div>
                          <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                          <div className="w-3 h-3 rounded-full bg-green-400"></div>
                        </div>
                        <div className="text-slate-500 text-xs">implementation-plan.zip</div>
                      </div>

                      <div className="space-y-3 mb-6">
                        <div className="flex items-center space-x-3">
                          <div className="bg-indigo-500/20 p-2 rounded-md">
                            <FileText className="h-5 w-5 text-indigo-400" />
                          </div>
                          <div className="text-slate-300 text-sm font-medium">requirements.md</div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <div className="bg-purple-500/20 p-2 rounded-md">
                            <Code className="h-5 w-5 text-purple-400" />
                          </div>
                          <div className="text-slate-300 text-sm font-medium">backend.md</div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <div className="bg-pink-500/20 p-2 rounded-md">
                            <Layers className="h-5 w-5 text-pink-400" />
                          </div>
                          <div className="text-slate-300 text-sm font-medium">frontend.md</div>
                        </div>
                      </div>

                      <div className="flex justify-end">
                        <div className="inline-flex items-center px-3 py-1.5 bg-indigo-500/10 text-indigo-400 text-xs font-medium rounded-full">
                          <Download className="h-3.5 w-3.5 mr-1" />
                          Generated in 38 seconds
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
