import { Link, useLocation } from "wouter";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { MessageSquare, Home, Menu, X, Sparkles, Github, Layers, Code } from "lucide-react";
import { useState } from "react";


export default function Navbar() {
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);


  return (
    <nav className="sticky top-0 z-50 bg-slate-900/90 backdrop-blur-md border-b border-indigo-900/50 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, type: "spring", stiffness: 120 }}
            className="flex items-center"
          >
            <Link href="/">
              <div className="flex items-center gap-3">
                <img 
                  src="/logo.png" 
                  alt="CreateMVP Guide Logo" 
                  className="h-9 w-9 rounded-md"
                />
                <div className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 hover:from-indigo-300 hover:to-pink-300 transition-all">
                  CreateMVP
                </div>
              </div>
            </Link>
          </motion.div>

          {/* Desktop navigation & User Actions combined */}
          <div className="hidden md:flex items-center gap-1">
            {/* Main Nav Links */}
            <Link href="/">
              <Button
                variant={location === "/" ? "default" : "ghost"}
                className={`inline-flex flex-row items-center text-white ${location === "/" ? "bg-indigo-600 hover:bg-indigo-700" : "hover:bg-slate-800"}`}
                leftIcon={<Home className="w-4 h-4" />}
              >
                Home
              </Button>
            </Link>
            <Link href="/chat">
              <Button
                variant={location === "/chat" ? "default" : "ghost"}
                className={`inline-flex flex-row items-center text-white ${location === "/chat" ? "bg-indigo-600 hover:bg-indigo-700" : "hover:bg-slate-800"}`}
                leftIcon={<MessageSquare className="w-4 h-4" />}
                rightIcon={<Sparkles className="w-3.5 h-3.5 text-yellow-300" />}
              >
                AI Chat
              </Button>
            </Link>
            <Link href="/tool-comparison">
              <Button
                variant={location === "/tool-comparison" ? "default" : "ghost"}
                className={`inline-flex flex-row items-center text-white ${location === "/tool-comparison" ? "bg-indigo-600 hover:bg-indigo-700" : "hover:bg-slate-800"}`}
                leftIcon={<Layers className="w-4 h-4" />}
              >
                Tool Comparison
              </Button>
            </Link>
            <Link href="/mcp-rules">
              <Button
                variant={location === "/mcp-rules" ? "default" : "ghost"}
                className={`inline-flex flex-row items-center text-white ${location === "/mcp-rules" ? "bg-indigo-600 hover:bg-indigo-700" : "hover:bg-slate-800"}`}
                leftIcon={<Code className="w-4 h-4" />}
              >
                MCP & Rules
              </Button>
            </Link>

            {/* GitHub Link */}
             <a href="https://github.com/rohitg00/createmvp-oss" target="_blank" rel="noopener noreferrer">
               <Button 
                 variant="ghost" 
                 className="inline-flex flex-row items-center text-white hover:bg-slate-800"
                 leftIcon={<Github className="w-4 h-4" />}
               >
                 GitHub
               </Button>
             </a>

            {/* User account options (moved into this div) */}

          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <Button
              variant="ghost"
              className="md:hidden text-white hover:bg-slate-800"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle mobile menu"
              leftIcon={mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            />
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
          className="md:hidden bg-slate-900 border-b border-indigo-800/30 shadow-lg"
        >
          <div className="px-4 py-3 space-y-2">
            <Link href="/">
              <Button
                variant={location === "/" ? "default" : "ghost"}
                className={`w-full inline-flex flex-row items-center justify-start gap-2 text-white ${location === "/" ? "bg-indigo-600 hover:bg-indigo-700" : "hover:bg-slate-800"}`}
                onClick={() => setMobileMenuOpen(false)}
                leftIcon={<Home className="w-4 h-4" />}
              >
                Home
              </Button>
            </Link>
            <Link href="/chat">
              <Button
                variant={location === "/chat" ? "default" : "ghost"}
                className={`w-full inline-flex flex-row items-center justify-start gap-2 text-white ${location === "/chat" ? "bg-indigo-600 hover:bg-indigo-700" : "hover:bg-slate-800"}`}
                onClick={() => setMobileMenuOpen(false)}
                leftIcon={<MessageSquare className="w-4 h-4" />}
                rightIcon={<Sparkles className="w-3.5 h-3.5 text-yellow-300" />}
              >
                AI Chat
              </Button>
            </Link>
            
            {/* Add Tool Comparison to mobile menu */}
            <Link href="/tool-comparison">
              <Button
                variant={location === "/tool-comparison" ? "default" : "ghost"}
                className={`w-full inline-flex flex-row items-center justify-start gap-2 text-white ${location === "/tool-comparison" ? "bg-indigo-600 hover:bg-indigo-700" : "hover:bg-slate-800"}`}
                onClick={() => setMobileMenuOpen(false)}
                leftIcon={<Layers className="w-4 h-4" />}
              >
                Tool Comparison
              </Button>
            </Link>
            
            {/* Add MCP & Rules to mobile menu */}
            <Link href="/mcp-rules">
              <Button
                variant={location === "/mcp-rules" ? "default" : "ghost"}
                className={`w-full inline-flex flex-row items-center justify-start gap-2 text-white ${location === "/mcp-rules" ? "bg-indigo-600 hover:bg-indigo-700" : "hover:bg-slate-800"}`}
                onClick={() => setMobileMenuOpen(false)}
                leftIcon={<Code className="w-4 h-4" />}
              >
                MCP & Rules
              </Button>
            </Link>
            
            {/* GitHub button for mobile menu */}
            <a href="https://github.com/rohitg00/createmvp-oss" target="_blank" rel="noopener noreferrer">
              <Button
                variant="ghost"
                className="w-full inline-flex flex-row items-center justify-start gap-2 text-white hover:bg-slate-800"
                onClick={() => setMobileMenuOpen(false)}
                leftIcon={<Github className="w-4 h-4" />}
              >
                GitHub
              </Button>
            </a>
            

          </div>
        </motion.div>
      )}
    </nav>
  );
}
