import { Link, useLocation } from "wouter";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { MessageSquare, Home, Menu, X, Sparkles, LogIn, User, LogOut, CreditCard, Infinity, Github, Layers, Code } from "lucide-react";
import { useState } from "react";
import { useUser } from "@/lib/userContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Navbar() {
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, logout } = useUser();

  // Function to display credits based on user plan
  const renderCredits = () => {
    if (!user) return null;
    
    // For pro users, show infinity symbol
    if (user.plan === "pro") {
      return (
        <div className="flex items-center gap-2">
          <CreditCard className="w-4 h-4 text-indigo-300" />
          <Infinity className="w-5 h-5 text-indigo-300" />
          <span className="text-sm text-indigo-200">unlimited</span>
        </div>
      );
    }
    
    // For free users, show credits
    return (
      <div className="flex items-center gap-2">
        <CreditCard className="w-4 h-4 text-indigo-300" />
        <span className="font-medium text-base">{user.credits}</span>
        <span className="text-sm text-indigo-200">credits</span>
      </div>
    );
  };

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

          {/* Desktop navigation */}
          <div className="hidden md:flex items-center gap-1">
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
            <a href="https://github.com/amm0nite/ai-mvp-guide" target="_blank" rel="noopener noreferrer">
              <Button 
                variant="ghost" 
                className="inline-flex flex-row items-center text-white hover:bg-slate-800"
                leftIcon={<Github className="w-4 h-4" />}
              >
                GitHub
              </Button>
            </a>
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

          {/* User account options */}
          <div className="hidden md:flex items-center gap-2">
            {user ? (
              <>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      variant="ghost" 
                      className="inline-flex flex-row items-center text-white hover:bg-slate-800"
                      leftIcon={<User className="w-4 h-4" />}
                    >
                      {user.name || "Account"}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56 bg-slate-800 border-indigo-600/40 shadow-lg shadow-indigo-900/20">
                    <DropdownMenuLabel className="text-white">My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator className="bg-indigo-700/30" />
                    <DropdownMenuItem className="text-white focus:bg-indigo-700/50 cursor-pointer">
                      <span className="text-indigo-300 font-medium mr-1">{user.plan}</span> plan
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-white focus:bg-indigo-700/50 cursor-pointer">
                      <CreditCard className="w-4 h-4 mr-2 text-indigo-300" />
                      {user.credits} credits
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="bg-indigo-700/30" />
                    <DropdownMenuItem 
                      className="text-white focus:bg-indigo-700/50 cursor-pointer"
                      onClick={() => logout()}
                    >
                      <LogOut className="w-4 h-4 mr-2 text-indigo-300" />
                      Log out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <>
                <Link href="/auth/login">
                  <Button
                    className="inline-flex flex-row items-center bg-indigo-600 hover:bg-indigo-700 text-white"
                    leftIcon={<LogIn className="w-4 h-4" />}
                  >
                    Log In
                  </Button>
                </Link>
                <Link href="/auth/signup">
                  <Button
                    variant="outline"
                    className="inline-flex flex-row items-center bg-slate-800/50 border-slate-700 text-white hover:bg-slate-800 hover:border-slate-600"
                    leftIcon={<User className="w-4 h-4" />}
                  >
                    Sign Up
                  </Button>
                </Link>
              </>
            )}
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
            
            {/* Add GitHub button to mobile menu */}
            <a href="https://github.com/amm0nite/ai-mvp-guide" target="_blank" rel="noopener noreferrer">
              <Button
                variant="ghost"
                className="w-full inline-flex flex-row items-center justify-start gap-2 text-white hover:bg-slate-800"
                onClick={() => setMobileMenuOpen(false)}
                leftIcon={<Github className="w-4 h-4" />}
              >
                GitHub
              </Button>
            </a>
            
            {user ? (
              <>
                <div className="py-2 px-4 text-sm text-white flex items-center justify-between bg-indigo-900/40 rounded-md border border-indigo-700/30">
                  {user.plan === "pro" ? (
                    <>
                      <span className="font-medium">Pro Plan</span>
                      <div className="flex items-center gap-1.5">
                        <CreditCard className="w-3.5 h-3.5 text-indigo-300" />
                        <Infinity className="w-4 h-4 text-indigo-300" />
                      </div>
                    </>
                  ) : (
                    <>
                      <span className="font-medium">Free Plan</span>
                      <div className="flex items-center gap-1.5">
                        <CreditCard className="w-3.5 h-3.5 text-indigo-300" />
                        <span className="font-medium">5</span>
                        <span className="text-xs text-indigo-200">credits</span>
                      </div>
                    </>
                  )}
                </div>
                <Button
                  variant="ghost"
                  className="w-full inline-flex flex-row items-center justify-start gap-2 text-white hover:bg-indigo-900/40"
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  leftIcon={<LogOut className="w-4 h-4" />}
                >
                  Log out
                </Button>
              </>
            ) : (
              <>
                <Link href="/auth/login">
                  <Button
                    className="w-full inline-flex flex-row items-center justify-start gap-2 bg-indigo-600 hover:bg-indigo-700 text-white"
                    onClick={() => setMobileMenuOpen(false)}
                    leftIcon={<LogIn className="w-4 h-4" />}
                  >
                    Log In
                  </Button>
                </Link>
                <Link href="/auth/signup">
                  <Button
                    variant="outline"
                    className="w-full inline-flex flex-row items-center justify-start gap-2 bg-slate-800/50 border-slate-700 text-white hover:bg-slate-800 hover:border-slate-600"
                    onClick={() => setMobileMenuOpen(false)}
                    leftIcon={<User className="w-4 h-4" />}
                  >
                    Sign Up
                  </Button>
                </Link>
              </>
            )}
          </div>
        </motion.div>
      )}
    </nav>
  );
}