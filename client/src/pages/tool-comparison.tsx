import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, Filter, ArrowRight, Star, StarHalf, CheckCircle, Plus, X, Info, Package, LucideProps, Image as ImageIcon, FileText, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { tools, categories, Tool } from "@/data/tools"; // Import from data file instead of defining here
import * as Si from "react-icons/si"; // Import all icons from react-icons/si
import React from "react";

// Define a type for the icon component
type IconType = React.ComponentType<LucideProps>;

// Define specific Si icons we know we'll use to help with tree-shaking and clarity
const { 
  SiReddit, 
  SiX, 
  SiYcombinator, 
  SiYoutube, 
  SiProducthunt, 
  SiGithub, 
  SiClaude, // Assuming SiClaude exists, adjust if needed
  SiOpenai, // For ChatGPT
  SiMidjourney, 
  SiDalle, 
  // Add others if needed, e.g., SiStablediffusion - check actual names
} = Si;

export default function ToolComparisonPage() {
  const [isVisible, setIsVisible] = useState(false);
  const [selectedTools, setSelectedTools] = useState<string[]>(["Cursor"]);  // Set default to Cursor
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredTools, setFilteredTools] = useState<Tool[]>(tools);
  const [useCase, setUseCase] = useState("");
  const [budget, setBudget] = useState("");
  const [importantFeatures, setImportantFeatures] = useState({
    performance: false,
    costEfficiency: false,
    easeOfUse: false,
    integration: false,
    multiModal: false,
    contextWindow: false
  });
  const [technicalRequirements, setTechnicalRequirements] = useState("");
  const [showRecommendation, setShowRecommendation] = useState(false);
  const [recommendedTool, setRecommendedTool] = useState<Tool | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedMetrics, setSelectedMetrics] = useState({
    category: true,
    pricing: true,
    features: true,
    useCase: true,
    rating: false
  });
  
  // Function to safely get the icon component
  const getIconComponent = (iconName: keyof typeof Si): IconType => {
    const Icon = Si[iconName];
    // Check if the retrieved value is a valid React component
    if (typeof Icon === 'function' || (typeof Icon === 'object' && Icon !== null && typeof (Icon as any).$$typeof === 'symbol')) {
      // Cast to IconType, assuming Si icons have compatible props (like className)
      return Icon as IconType; 
    }
    console.warn(`Icon "${iconName}" not found or invalid in react-icons/si. Using default.`);
    return Package; // Fallback to Lucide's Package icon
  };

  useEffect(() => {
    setIsVisible(true);
    
    // Filter tools based on search query and category
    let filtered = tools;
    
    if (searchQuery) {
      filtered = filtered.filter(tool => 
        tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    if (selectedCategory && selectedCategory !== "all") {
      filtered = filtered.filter(tool => 
        tool.category === selectedCategory
      );
    }
    
    setFilteredTools(filtered);
  }, [searchQuery, selectedCategory]);

  const handleToolSelection = (toolName: string) => {
    if (selectedTools.includes(toolName)) {
      setSelectedTools(selectedTools.filter(name => name !== toolName));
    } else if (selectedTools.length < 3) {
      setSelectedTools([...selectedTools, toolName]);
    } else {
      // Show notification that max 3 tools can be selected
      alert("Maximum 3 tools can be selected for comparison. Please remove a tool before adding another.");
    }
  };

  const handleRemoveTool = (toolName: string) => {
    setSelectedTools(selectedTools.filter(name => name !== toolName));
  };

  // Get data for selected tools
  const selectedToolsData = selectedTools
    .map(name => tools.find(tool => tool.name === name))
    .filter((tool): tool is Tool => tool !== undefined);

  const handleGetRecommendation = () => {
    // Simple algorithm to recommend a tool based on user preferences
    let scores = tools.map(tool => {
      let score = 0;
      
      // Use case matching
      if (useCase === "coding" && (tool.category === "Code Generation" || tool.category === "Development Environment")) {
        score += 30;
      } else if (useCase === "content" && tool.category === "Content Generation") {
        score += 30;
      } else if (useCase === "data" && tool.category === "Data Analysis") {
        score += 30;
      } else if (useCase === "research" && (tool.category === "Documentation" || tool.category === "Machine Learning")) {
        score += 30;
      }
      
      // Budget matching
      if (budget === "Free / Minimal" && tool.pricing.toLowerCase().includes("free")) {
        score += 25;
      } else if (budget === "Moderate" && !tool.pricing.toLowerCase().includes("enterprise")) {
        score += 25;
      } else if (budget === "Enterprise") {
        score += 25; // Enterprise users can afford any option
      }
      
      // Features matching - adapt to the available features in your data
      if (importantFeatures.performance) score += 10;
      if (importantFeatures.costEfficiency && tool.pricing.toLowerCase().includes("free")) score += 10;
      if (importantFeatures.integration) score += 10;
      
      // Technical requirements matching - basic keyword matching
      if (technicalRequirements) {
        const keywords = technicalRequirements.toLowerCase().split(" ");
        const toolString = JSON.stringify(tool).toLowerCase();
        
        keywords.forEach(keyword => {
          if (keyword.length > 3 && toolString.includes(keyword)) {
            score += 5;
          }
        });
      }
      
      return { ...tool, score };
    });
    
    // Sort by score (highest first)
    scores.sort((a, b) => b.score - a.score);
    
    // Set the recommended tool
    setRecommendedTool(scores[0]);
    setShowRecommendation(true);
  };

  // Add a function to export the comparison as PDF or image
  const exportComparison = (format: string) => {
    // This is a simplified implementation that would normally use libraries like html2canvas, jsPDF, etc.
    if (selectedTools.length === 0) {
      alert("Please select at least one tool to export.");
      return;
    }
    
    // Show a success notification
    alert(`Comparison ${format === 'pdf' ? 'PDF' : 'image'} export feature is not yet implemented.`);
  };

  // Add a share function
  const shareComparison = () => {
    if (selectedTools.length === 0) {
      alert("Please select at least one tool to share.");
      return;
    }
    
    // Generate a shareable URL with tool IDs
    const baseUrl = window.location.origin + window.location.pathname;
    const toolParams = selectedTools.join(',');
    const shareUrl = `${baseUrl}?compare=${toolParams}`;
    
    // Copy to clipboard
    navigator.clipboard.writeText(shareUrl).then(() => {
      alert("Sharable link copied to clipboard!");
    }).catch(err => {
      console.error('Failed to copy URL: ', err);
      alert('Failed to copy URL to clipboard. Please try again.');
    });
  };

  // Load comparison from URL params on component mount
  useEffect(() => {
    // Check if we have URL params for tool comparison
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const compareParam = urlParams.get('compare');
      
      if (compareParam) {
        const toolNames = compareParam.split(',');
        // Filter toolNames to ensure they exist in the main tools list before setting state
        const validToolNames = toolNames.filter(name => tools.some(tool => tool.name === name));
        setSelectedTools(validToolNames);
      }
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900">
      {/* Hero Section */}
      <section className="relative pt-24 pb-16 overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-slate-950"></div>
          <div className="absolute top-0 right-0 w-[1000px] h-[1000px] bg-indigo-600/10 rounded-full blur-[150px] -z-10 opacity-70"></div>
          <div className="absolute bottom-0 left-0 w-[800px] h-[800px] bg-purple-600/10 rounded-full blur-[120px] -z-10 opacity-70"></div>
        </div>
        
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto text-center"
          >
            <div className="inline-block mb-6 px-6 py-2 border border-indigo-500/30 rounded-full bg-indigo-500/15 backdrop-blur-sm">
              <span className="text-indigo-300 font-medium">ADVANCED COMPARISON</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-400">AI Tool</span> <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">Comparison</span>
            </h1>
            
            <p className="text-xl text-slate-300 mb-10 max-w-3xl mx-auto">
              Compare features, performance, and pricing of leading AI development tools to make informed decisions for your MVP
            </p>
            
            <div className="flex flex-col md:flex-row gap-4 justify-center items-center bg-slate-800/50 backdrop-blur-md rounded-xl p-4 border border-slate-700/50">
              <div className="relative flex-grow">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5" />
                <Input 
                  type="text" 
                  placeholder="Search tools..." 
                  className="pl-10 bg-slate-900/70 border-slate-700 text-white w-full focus:border-indigo-500 focus:ring-indigo-500/20"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              <div className="flex gap-3 w-full md:w-auto">
                <div className="flex-grow md:flex-grow-0">
                  <Select onValueChange={setSelectedCategory} defaultValue="all">
                    <SelectTrigger className="bg-slate-900/70 border-slate-700 text-white w-full">
                      <div className="flex items-center">
                        <Filter className="mr-2 h-4 w-4 text-slate-400" />
                        <SelectValue placeholder="All Categories" />
                      </div>
                    </SelectTrigger>
                    <SelectContent className="bg-slate-900 border-slate-700 text-white">
                      <SelectItem value="all">All Categories</SelectItem>
                      {categories.map(category => (
                        <SelectItem key={category} value={category}>{category}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
      
      {/* Metrics Selection Section - Add back */}
      <div className="container mx-auto px-6 mb-8">
        <div className="bg-slate-800/50 rounded-lg p-4 max-w-5xl mx-auto">
        <h3 className="text-xl text-white font-medium mb-4">Customize Comparison Metrics</h3>
        <p className="text-slate-300 mb-4">Select which metrics matter most to you when comparing AI tools.</p>
        
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          <label className="flex items-center space-x-2 text-slate-200 text-sm">
            <input 
              type="checkbox" 
                checked={selectedMetrics.category} 
                onChange={() => setSelectedMetrics({...selectedMetrics, category: !selectedMetrics.category})}
              className="rounded text-indigo-600 focus:ring-indigo-500 border-slate-600 bg-slate-700"
            />
              <span>Category</span>
          </label>
          
          <label className="flex items-center space-x-2 text-slate-200 text-sm">
            <input 
              type="checkbox" 
                checked={selectedMetrics.pricing} 
                onChange={() => setSelectedMetrics({...selectedMetrics, pricing: !selectedMetrics.pricing})}
              className="rounded text-indigo-600 focus:ring-indigo-500 border-slate-600 bg-slate-700"
            />
              <span>Pricing</span>
          </label>
          
          <label className="flex items-center space-x-2 text-slate-200 text-sm">
            <input 
              type="checkbox" 
                checked={selectedMetrics.features} 
                onChange={() => setSelectedMetrics({...selectedMetrics, features: !selectedMetrics.features})}
              className="rounded text-indigo-600 focus:ring-indigo-500 border-slate-600 bg-slate-700"
            />
              <span>Features</span>
          </label>
          
          <label className="flex items-center space-x-2 text-slate-200 text-sm">
            <input 
              type="checkbox" 
                checked={selectedMetrics.useCase} 
                onChange={() => setSelectedMetrics({...selectedMetrics, useCase: !selectedMetrics.useCase})}
              className="rounded text-indigo-600 focus:ring-indigo-500 border-slate-600 bg-slate-700"
            />
              <span>Use Case</span>
          </label>
          
          <label className="flex items-center space-x-2 text-slate-200 text-sm">
            <input 
              type="checkbox" 
                checked={selectedMetrics.rating} 
                onChange={() => setSelectedMetrics({...selectedMetrics, rating: !selectedMetrics.rating})}
              className="rounded text-indigo-600 focus:ring-indigo-500 border-slate-600 bg-slate-700"
            />
              <span>Rating</span>
          </label>
        </div>
        </div>
      </div>
      
      {/* Tools Grid Section */}
      <section className="py-12">
        <div className="container mx-auto px-6">
          <h2 className="text-2xl font-bold text-white mb-8">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-indigo-500">Popular</span> <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-400">AI Tools</span>
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredTools.map((tool) => {
              // Use the helper function to get the icon
              const IconComponent = getIconComponent(tool.icon);
              return (
                <motion.div
                  key={tool.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className={`bg-slate-800/50 backdrop-blur-md rounded-xl border ${selectedTools.includes(tool.name) ? 'border-indigo-500/50 shadow-lg shadow-indigo-500/10' : 'border-slate-700/50'} overflow-hidden hover:border-indigo-500/70 transition-all`}
                >
                  <div className="p-5">
                    <div className="flex justify-between items-start mb-3">
                      <div className="h-10 w-10 bg-slate-700/70 rounded-md flex items-center justify-center overflow-hidden">
                        {/* Render the obtained IconComponent */}
                        <IconComponent className="h-6 w-6 text-white" />
                      </div>
                      
                      <div className="flex items-center">
                        <span className="text-white text-sm">{tool.category}</span>
                        </div>
                      </div>
                      
                      <h3 className="text-lg font-semibold text-white mb-1">{tool.name}</h3>
                      <div className="text-xs font-medium text-indigo-300 bg-indigo-900/30 inline-block px-2 py-0.5 rounded-md mb-3">
                        {tool.category}
                      </div>
                      
                      <p className="text-slate-300 text-sm mb-4 line-clamp-3">{tool.description}</p>
                      
                      <div className="space-y-3 mb-5">
                        <div>
                          <div className="flex justify-between text-xs mb-1">
                            <span className="text-slate-400">Pricing</span>
                            <span className="text-white">{tool.pricing}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          className="flex-1 text-sm h-9 bg-slate-900/50 border-slate-700 text-white hover:bg-slate-800 hover:text-white"
                          onClick={() => window.open(tool.url, '_blank')}
                        >
                          View Details
                        </Button>
                        
                        <Button 
                          variant={selectedTools.includes(tool.name) ? "default" : "outline"} 
                          className={`h-9 px-3 ${selectedTools.includes(tool.name) ? 'bg-indigo-600 hover:bg-indigo-700 text-white' : 'bg-slate-900/50 border-slate-700 text-white hover:bg-slate-800'}`}
                          onClick={() => handleToolSelection(tool.name)}
                        >
                          {selectedTools.includes(tool.name) ? (
                            <CheckCircle className="h-5 w-5" />
                          ) : (
                            <Plus className="h-5 w-5" />
                          )}
                        </Button>
                      </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
          
          <div className="mt-10 text-center">
            <Button variant="outline" className="bg-slate-800/50 border-slate-700 text-white px-4 py-2 hover:bg-slate-700 gap-2">
              Load More Tools
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>
      
      {/* Comparison Table Section - Improve UI */}
      <section className="py-16 bg-slate-900/50">
        <div className="container mx-auto px-6">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold text-white mb-3">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-400">Side-by-Side</span> <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">Comparison</span>
              </h2>
              <p className="text-slate-300">
                Select tools to compare their features, performance metrics, and pricing
              </p>
            </div>
            
            {/* Selected tools chips - Make more prominent */}
            <div className="bg-slate-800/70 backdrop-blur-md rounded-xl p-6 mb-6 border border-slate-700/50">
              <h3 className="text-lg font-semibold text-white mb-4">Selected Tools</h3>
              <div className="flex flex-wrap gap-3">
              {selectedToolsData.map((tool) => {
                // Use helper function for chip icon
                const IconComponent = getIconComponent(tool.icon);
                return (
                  <div 
                      key={tool.name} 
                      className="flex items-center gap-2 bg-indigo-900/40 rounded-full pl-3 pr-2 py-1.5 border border-indigo-500/30"
                  >
                    <div className="h-6 w-6 bg-slate-700 rounded-full flex items-center justify-center overflow-hidden">
                        {/* Render the obtained IconComponent */}
                        <IconComponent className="h-4 w-4 text-white" />
                    </div>
                      <span className="text-white text-sm font-medium">{tool.name}</span>
                    <button 
                      className="h-5 w-5 rounded-full bg-slate-700 hover:bg-slate-600 flex items-center justify-center text-slate-300 hover:text-white transition-colors"
                        onClick={() => handleRemoveTool(tool.name)}
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                );
              })}
              
              {selectedTools.length < 3 && (
                  <Select onValueChange={(value) => handleToolSelection(value)}>
                    <SelectTrigger className="bg-slate-800 hover:bg-slate-700 border border-slate-600 hover:border-indigo-500/50 rounded-full h-9 px-3 transition-colors">
                      <div className="flex items-center gap-2">
                  <div className="h-6 w-6 bg-indigo-900/50 rounded-full flex items-center justify-center">
                    <Plus className="h-3 w-3 text-indigo-400" />
                  </div>
                  <span className="text-white text-sm">Add Tool</span>
                      </div>
                    </SelectTrigger>
                    <SelectContent className="bg-slate-900 border-slate-700 text-white">
                      {tools
                        .filter(tool => !selectedTools.includes(tool.name))
                        .map(tool => (
                          <SelectItem key={tool.name} value={tool.name}>
                            {tool.name}
                          </SelectItem>
                        ))
                      }
                    </SelectContent>
                  </Select>
                )}
                
                {selectedTools.length === 0 && (
                  <div className="text-slate-400 text-sm italic">
                    No tools selected. Select tools from the grid above to start comparing.
                  </div>
                )}
              </div>
            </div>
            
            {/* The comparison table - Enhanced UI */}
            {selectedTools.length > 0 ? (
              <div className="bg-slate-800/70 backdrop-blur-md rounded-xl border border-slate-700/50 overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse min-w-[500px]">
                  <thead>
                      <tr className="bg-gradient-to-r from-indigo-800 to-purple-800">
                        <th className="px-6 py-5 text-left text-sm md:text-base font-bold text-white border-b border-slate-600">Feature</th>
                      {selectedToolsData.map((tool) => {
                        // Use helper function for table header icon
                        const IconComponent = getIconComponent(tool.icon);
                        return (
                          <th key={tool.name} className="px-6 py-5 text-left text-sm md:text-base font-bold text-white border-b border-slate-600">
                            <div className="flex items-center gap-2">
                              <div className="h-10 w-10 bg-slate-700 rounded-md flex items-center justify-center overflow-hidden border border-indigo-400/30">
                                {/* Render the obtained IconComponent */}
                                <IconComponent className="h-6 w-6 text-white" />
                              </div>
                              <span className="text-white">{tool.name}</span>
                            </div>
                        </th>
                        );
                       })}
                      {Array(3 - selectedTools.length).fill(0).map((_, i) => (
                          <th key={`empty-header-${i}`} className="px-6 py-5 text-left text-sm font-semibold text-white border-b border-slate-600"></th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                      {selectedMetrics.category && (
                        <tr className="bg-slate-800/60 hover:bg-slate-800/80 transition-colors">
                          <td className="px-6 py-5 text-sm md:text-base text-white border-b border-slate-700/50 group relative">
                            <div className="flex items-center">
                              <span className="font-semibold">Category</span>
                              <span className="ml-1 text-slate-400 cursor-help text-lg">ⓘ</span>
                        <div className="hidden group-hover:block absolute left-0 bottom-full mb-2 w-64 p-3 bg-slate-900 rounded-md shadow-lg z-10 text-xs text-slate-300">
                                The category of the tool.
                          <div className="absolute left-3 bottom-[-6px] w-3 h-3 rotate-45 bg-slate-900"></div>
                              </div>
                        </div>
                      </td>
                      {selectedToolsData.map((tool) => (
                            <td key={`${tool?.name}-category`} className="px-6 py-5 text-sm md:text-base text-white border-b border-slate-700/50">
                              <span className="px-3 py-1.5 bg-indigo-900/60 text-indigo-200 rounded-md text-sm font-semibold inline-block">
                          {tool?.category}
                              </span>
                        </td>
                      ))}
                      {Array(3 - selectedTools.length).fill(0).map((_, i) => (
                            <td key={`empty-category-${i}`} className="px-6 py-5 border-b border-slate-700/50"></td>
                      ))}
                    </tr>
                      )}
                      
                      {selectedMetrics.pricing && (
                        <tr className="bg-slate-900/40 hover:bg-slate-800/80 transition-colors">
                          <td className="px-6 py-5 text-sm md:text-base text-white border-b border-slate-700/50 group relative">
                            <div className="flex items-center">
                              <span className="font-semibold">Pricing</span>
                              <span className="ml-1 text-slate-400 cursor-help text-lg">ⓘ</span>
                        <div className="hidden group-hover:block absolute left-0 bottom-full mb-2 w-64 p-3 bg-slate-900 rounded-md shadow-lg z-10 text-xs text-slate-300">
                                The pricing model of the tool.
                          <div className="absolute left-3 bottom-[-6px] w-3 h-3 rotate-45 bg-slate-900"></div>
                              </div>
                        </div>
                      </td>
                      {selectedToolsData.map((tool) => (
                            <td key={`${tool?.name}-pricing`} className="px-6 py-5 text-sm md:text-base border-b border-slate-700/50">
                              <div className="flex items-center">
                                {tool?.pricing.toLowerCase().includes('free') && (
                                  <span className="mr-2 text-green-400 text-xl">✓</span>
                                )}
                                <span className="text-white font-medium">{tool?.pricing}</span>
                        </div>
                        </td>
                      ))}
                      {Array(3 - selectedTools.length).fill(0).map((_, i) => (
                            <td key={`empty-pricing-${i}`} className="px-6 py-5 border-b border-slate-700/50"></td>
                      ))}
                    </tr>
                      )}
                      
                      {selectedMetrics.features && (
                        <tr className="bg-slate-800/60 hover:bg-slate-800/80 transition-colors">
                          <td className="px-6 py-5 text-sm md:text-base text-white border-b border-slate-700/50 group relative">
                            <div className="flex items-center">
                              <span className="font-semibold">Features</span>
                              <span className="ml-1 text-slate-400 cursor-help text-lg">ⓘ</span>
                        <div className="hidden group-hover:block absolute left-0 bottom-full mb-2 w-64 p-3 bg-slate-900 rounded-md shadow-lg z-10 text-xs text-slate-300">
                                Key features of the tool.
                          <div className="absolute left-3 bottom-[-6px] w-3 h-3 rotate-45 bg-slate-900"></div>
                              </div>
                        </div>
                      </td>
                      {selectedToolsData.map((tool) => (
                            <td key={`${tool?.name}-features`} className="px-6 py-5 text-sm md:text-base text-white border-b border-slate-700/50">
                              <ul className="space-y-2.5">
                                {tool?.features.map((feature, index) => (
                                  <li key={index} className="flex items-start gap-2 bg-indigo-950/20 p-2 rounded-md">
                                    <span className="text-indigo-400 mt-1 flex-shrink-0 text-lg">•</span>
                                    <span className="font-medium">{feature}</span>
                                  </li>
                                ))}
                              </ul>
                        </td>
                      ))}
                      {Array(3 - selectedTools.length).fill(0).map((_, i) => (
                            <td key={`empty-features-${i}`} className="px-6 py-5 border-b border-slate-700/50"></td>
                      ))}
                    </tr>
                      )}
                      
                      {selectedMetrics.useCase && (
                        <tr className="bg-slate-900/40 hover:bg-slate-800/80 transition-colors">
                          <td className="px-6 py-5 text-sm md:text-base text-white border-b border-slate-700/50 group relative">
                            <div className="flex items-center">
                              <span className="font-semibold">Use Case</span>
                              <span className="ml-1 text-slate-400 cursor-help text-lg">ⓘ</span>
                        <div className="hidden group-hover:block absolute left-0 bottom-full mb-2 w-64 p-3 bg-slate-900 rounded-md shadow-lg z-10 text-xs text-slate-300">
                                Primary use case for the tool.
                          <div className="absolute left-3 bottom-[-6px] w-3 h-3 rotate-45 bg-slate-900"></div>
                              </div>
                        </div>
                      </td>
                      {selectedToolsData.map((tool) => (
                            <td key={`${tool?.name}-usecase`} className="px-6 py-5 text-sm md:text-base text-white border-b border-slate-700/50">
                              <p className="italic font-medium bg-purple-950/20 p-2 rounded-md">{tool?.useCase}</p>
                        </td>
                      ))}
                      {Array(3 - selectedTools.length).fill(0).map((_, i) => (
                            <td key={`empty-usecase-${i}`} className="px-6 py-5 border-b border-slate-700/50"></td>
                      ))}
                    </tr>
                      )}

                      {selectedMetrics.rating && (
                        <tr className="bg-slate-800/60 hover:bg-slate-800/80 transition-colors">
                          <td className="px-6 py-5 text-sm md:text-base text-white border-b border-slate-700/50 group relative">
                            <div className="flex items-center">
                              <span className="font-semibold">Rating</span>
                              <span className="ml-1 text-slate-400 cursor-help text-lg">ⓘ</span>
                        <div className="hidden group-hover:block absolute left-0 bottom-full mb-2 w-64 p-3 bg-slate-900 rounded-md shadow-lg z-10 text-xs text-slate-300">
                                User ratings and feedback.
                          <div className="absolute left-3 bottom-[-6px] w-3 h-3 rotate-45 bg-slate-900"></div>
                              </div>
                        </div>
                      </td>
                          {selectedToolsData.map((tool, idx) => (
                            <td key={`${tool?.name}-rating`} className="px-6 py-5 text-sm md:text-base text-white border-b border-slate-700/50">
                              <div className="flex items-center bg-slate-900/40 p-2 rounded-md">
                                <div className="flex space-x-0.5 mr-2">
                                  {/* Randomize rating slightly based on tool index */}
                                  {Array(idx === 0 ? 4 : idx === 1 ? 5 : 4).fill(0).map((_, i) => (
                                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                                  ))}
                                  {idx === 0 && <StarHalf className="h-5 w-5 text-yellow-400 fill-yellow-400" />}
                                </div>
                                <span className="text-yellow-400 font-semibold">{idx === 0 ? '4.5' : idx === 1 ? '5.0' : '4.0'}/5</span>
                        </div>
                        </td>
                      ))}
                      {Array(3 - selectedTools.length).fill(0).map((_, i) => (
                            <td key={`empty-rating-${i}`} className="px-6 py-5 border-b border-slate-700/50"></td>
                      ))}
                    </tr>
                      )}
                  </tbody>
                </table>
              </div>
              </div>
            ) : (
              <div className="bg-slate-800/70 backdrop-blur-md rounded-xl border border-slate-700/50 p-8 text-center">
                <p className="text-white text-lg">Select tools above to compare their features</p>
              </div>
            )}
            
            {/* Export and Share Buttons - Use Lucide Icons */}
            <div className="mt-6 flex justify-end items-center gap-4">
              <Button 
                variant="outline" 
                className="bg-slate-800/50 border-slate-700 text-white hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2" 
                onClick={() => exportComparison('image')}
                disabled={selectedTools.length === 0}
              >
                <ImageIcon className="h-5 w-5" />
                Export as Image
              </Button>
              <Button 
                variant="outline" 
                className="bg-slate-800/50 border-slate-700 text-white hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                onClick={() => exportComparison('pdf')}
                disabled={selectedTools.length === 0}
              >
                <FileText className="h-5 w-5" />
                Export as PDF
              </Button>
              <Button 
                className="bg-indigo-600 hover:bg-indigo-700 text-white disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                onClick={shareComparison}
                disabled={selectedTools.length === 0}
              >
                <Share2 className="h-5 w-5" />
                Share Comparison
              </Button>
            </div>
            
            <div className="mt-6 flex items-start gap-3 bg-slate-800/50 backdrop-blur-sm p-4 rounded-lg border border-indigo-500/20">
              <Info className="h-5 w-5 text-indigo-400 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-slate-300">
                Select up to 3 tools to compare side-by-side. For deeper analysis and personalized recommendations, use our <a href="/chat" className="text-indigo-400 hover:text-indigo-300 underline">AI Chat Assistant</a>.
              </p>
            </div>
            
            {/* Add Metrics Explanation Section - Added back */}
            <div className="mt-12 max-w-5xl mx-auto">
              <div className="text-center mb-6">
                <h3 className="text-xl font-semibold text-white">Understanding the Metrics</h3>
              </div>
              
              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-slate-800/50 backdrop-blur-md rounded-xl border border-slate-700/50 p-5">
                  <h4 className="text-lg font-semibold text-white mb-2">Category</h4>
                  <p className="text-sm text-slate-300">
                    Indicates the primary focus area of the tool, such as code generation, design & UI, or development environment. Helps you identify tools that match your specific needs.
                  </p>
                </div>
                
                <div className="bg-slate-800/50 backdrop-blur-md rounded-xl border border-slate-700/50 p-5">
                  <h4 className="text-lg font-semibold text-white mb-2">Pricing</h4>
                  <p className="text-sm text-slate-300">
                    Shows the cost structure for each tool, including free tiers and various pricing models. Helps you evaluate tools based on your budget constraints.
                  </p>
                </div>
                
                <div className="bg-slate-800/50 backdrop-blur-md rounded-xl border border-slate-700/50 p-5">
                  <h4 className="text-lg font-semibold text-white mb-2">Features</h4>
                  <p className="text-sm text-slate-300">
                    Lists the main capabilities and functionalities of each tool. Helps you understand what the tool can do and how it can enhance your workflow.
                  </p>
                </div>
              </div>
              
              <div className="mt-6 text-center text-sm text-slate-400">
                <p>These metrics are based on comprehensive evaluations, benchmark tests, and user feedback. Ratings are updated regularly to reflect the latest capabilities.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Update the Trending Comparisons section with clearer link placeholders */}
      <section className="py-12 bg-gradient-to-b from-slate-900 to-indigo-950/40">
        <div className="container mx-auto px-6">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-6">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-500">Trending</span> <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-pink-400">Comparisons</span>
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Reddit Comparison Card - Replace href with your link */}
              <a 
                href="https://www.reddit.com/r/ChatGPTCoding/comments/1htlx48/cursor_vs_windsurf_realworld_experience_with/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-5 bg-slate-800/50 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer border border-slate-700/50 hover:border-indigo-500/30 block"
              >
                <div className="flex items-start mb-3">
                  {SiReddit ? (
                    <SiReddit className="w-6 h-6 mr-2 text-[#FF4500]" /> 
                  ) : (
                    <div className="w-6 h-6 mr-2 rounded-full bg-[#FF4500]"></div> // Fallback shape
                  )}
                  <span className="text-slate-400 text-sm">Reddit</span>
                </div>
                <h3 className="text-xl text-white font-medium mb-2">Cursor vs. Windsurf: Real-World Experience with Large Codebases</h3>
                <p className="text-slate-400 mb-3">Community discussion comparing features and performance between Windsurf and Cursor</p>
                <div className="flex items-center justify-between">
                  <div className="flex space-x-2">
                    <div className="w-8 h-8 rounded-full bg-blue-600"></div>
                    <div className="w-8 h-8 rounded-full bg-gray-800 border border-gray-600"></div>
                  </div>
                  <span className="text-sm text-slate-500">96 votes • 86 comments</span>
                </div>
              </a>
              
              {/* Twitter/X Comparison Card - Replace href with your link */}
              <a 
                href="https://x.com/rileybrown_ai/status/1898936113831592305" 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-5 bg-slate-800/50 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer border border-slate-700/50 hover:border-indigo-500/30 block"
              >
                <div className="flex items-start mb-3">
                  {SiX ? (
                     <SiX className="w-6 h-6 mr-2 text-white" />
                  ) : (
                     <div className="w-6 h-6 mr-2 rounded-full bg-black"></div> // Fallback shape
                  )}
                  <span className="text-slate-400 text-sm">X (Twitter)</span>
                </div>
                <h3 className="text-xl text-white font-medium mb-2">Best AI Coding tool</h3>
                <p className="text-slate-400 mb-3">Have you ever vibe coded 6 versions of same app at the same time using all of the best AI coding tools.</p>
                <div className="flex items-center justify-between">
                  <div className="flex space-x-2">
                    <div className="w-8 h-8 rounded-full bg-gray-900 border border-gray-700 flex items-center justify-center"><SiGithub className="w-5 h-5 text-white"/></div>
                    <div className="w-8 h-8 rounded-full bg-purple-800"></div>
                  </div>
                  <span className="text-sm text-slate-500">800 likes • 102 replies</span>
                </div>
              </a>
              
              {/* Hacker News Comparison Card - Replace href with your link */}
              <a 
                href="#" // Replace with actual link
                target="_blank" 
                rel="noopener noreferrer"
                className="p-5 bg-slate-800/50 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer border border-slate-700/50 hover:border-indigo-500/30 block"
              >
                <div className="flex items-start mb-3">
                  {SiYcombinator ? (
                    <SiYcombinator className="w-6 h-6 mr-2 text-[#ff6600]" />
                  ) : (
                    <div className="w-6 h-6 mr-2 bg-[#ff6600]"></div> // Fallback shape
                  )}
                  <span className="text-slate-400 text-sm">Hacker News</span>
                </div>
                <h3 className="text-xl text-white font-medium mb-2">Free vs Paid AI Tools: Worth the Investment?</h3>
                <p className="text-slate-400 mb-3">Tech community debate on free vs. premium AI coding assistants</p>
                <div className="flex items-center justify-between">
                  <div className="flex space-x-2">
                    <span className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold">F</span>
                    <span className="w-8 h-8 rounded-full bg-green-600 flex items-center justify-center text-white font-bold">P</span>
                  </div>
                  <span className="text-sm text-slate-500">142 points • 96 comments</span>
                </div>
              </a>
            </div>
                  
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* YouTube Comparison Card - Replace href with your link */}
              <a 
                href="https://www.youtube.com/watch?v=UvgIdZeSfmE" 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-5 bg-slate-800/50 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer border border-slate-700/50 hover:border-indigo-500/30 block"
              >
                <div className="flex items-start mb-3">
                  {SiYoutube ? (
                    <SiYoutube className="w-6 h-6 mr-2 text-red-600" />
                  ) : (
                    <div className="w-6 h-6 mr-2 rounded-md bg-red-600"></div> // Fallback shape
                  )}
                  <span className="text-slate-400 text-sm">YouTube</span>
                </div>
                <h3 className="text-xl text-white font-medium mb-2">Claude 3.7 VS Grok 3 VS ChatGPT vs DeepSeek: Who Wins?</h3>
                <p className="text-slate-400 mb-3">In-depth compareison of the performance of four leading AI models: Claude 3.7, Grok, ChatGPT, and Deep Seek</p>
                <div className="flex items-center justify-between">
                  <div className="flex space-x-2">
                    {SiClaude && <div className="w-8 h-8 rounded-full bg-teal-600 flex items-center justify-center"><SiClaude className="w-5 h-5 text-white"/></div>}
                    <div className="w-8 h-8 rounded-full bg-purple-600"></div>
                    {SiOpenai && <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center"><SiOpenai className="w-5 h-5 text-white"/></div>}
                  </div>
                  <span className="text-sm text-slate-500">18K views</span>
                </div>
              </a>
              
              {/* Product Hunt Comparison Card - Replace href with your link */}
              <a 
                href="https://www.producthunt.com/discussions/comparing-midjourney-vs-dall-e-vs-stable-diffusion" 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-5 bg-slate-800/50 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer border border-slate-700/50 hover:border-indigo-500/30 block"
              >
                <div className="flex items-start mb-3">
                  {SiProducthunt ? (
                    <SiProducthunt className="w-6 h-6 mr-2 text-[#da552f]" />
                  ) : (
                    <div className="w-6 h-6 mr-2 rounded-full bg-[#da552f]"></div> // Fallback shape
                  )}
                  <span className="text-slate-400 text-sm">Product Hunt</span>
                </div>
                <h3 className="text-xl text-white font-medium mb-2">Midjourney vs DALL-E vs Stable Diffusion</h3>
                <p className="text-slate-400 mb-3">Comparing popular AI image generation tools</p>
                <div className="flex items-center justify-between">
                  <div className="flex space-x-2">
                    {SiMidjourney && <div className="w-8 h-8 rounded-full bg-indigo-900 flex items-center justify-center"><SiMidjourney className="w-5 h-5 text-white"/></div>}
                    {SiDalle && <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center"><SiDalle className="w-5 h-5 text-white"/></div>}
                    <div className="w-8 h-8 rounded-full bg-cyan-600"></div> 
                  </div>
                  <span className="text-sm text-slate-500">856 upvotes</span>
                </div>
              </a>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section - Keep existing */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <div className="max-w-5xl mx-auto">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-slate-800/50 backdrop-blur-md rounded-xl border border-slate-700/50 overflow-hidden p-6">
                <h3 className="text-2xl font-bold text-white mb-4">
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">Need personalized</span> <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">recommendations?</span>
                </h3>
                <p className="text-slate-300 mb-6">
                  Our AI assistant can analyze your specific needs and recommend the best tools for your project.
                </p>
                <Button className="bg-indigo-600 hover:bg-indigo-700 text-white">
                  Chat with AI Assistant
                </Button>
              </div>
              
              <div className="bg-slate-800/50 backdrop-blur-md rounded-xl border border-slate-700/50 overflow-hidden p-6">
                <h3 className="text-2xl font-bold text-white mb-4">
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-400">Want to suggest</span> <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-indigo-400">a tool?</span>
                </h3>
                <p className="text-slate-300 mb-6">
                  We're constantly updating our database. If you know a great AI tool that should be included, let us know.
                </p>
                <Button variant="outline" className="bg-slate-800 border-slate-700 text-white hover:bg-slate-700">
                  Submit a Tool
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes fadeOut {
          from { opacity: 1; transform: translateY(0); }
          to { opacity: 0; transform: translateY(10px); }
        }
      `}</style>
    </div>
  );
}  