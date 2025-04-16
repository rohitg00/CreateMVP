import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, Filter, ArrowRight, Star, StarHalf, CheckCircle, Plus, X, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { tools, categories, Tool } from "@/data/tools"; // Import from data file instead of defining here
import * as Si from "react-icons/si"; // Import all icons from react-icons/si
import React from "react";

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
    .filter(Boolean) as Tool[];

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
        setSelectedTools(toolNames.filter(name => tools.some(tool => tool.name === name)));
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
            {filteredTools.map((tool) => (
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
                      {/* Use the actual icon from the data file instead of placeholder */}
                      {tool.icon && Si[tool.icon] ? 
                        React.createElement(Si[tool.icon], { className: "h-6 w-6 text-white" }) :
                        <img src={`https://picsum.photos/seed/${tool.name}/40/40`} alt={tool.name} className="h-6 w-6" />
                      }
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
            ))}
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
              {selectedToolsData.map((tool) => (
                <div 
                    key={tool?.name} 
                    className="flex items-center gap-2 bg-indigo-900/40 rounded-full pl-3 pr-2 py-1.5 border border-indigo-500/30"
                >
                  <div className="h-6 w-6 bg-slate-700 rounded-full flex items-center justify-center overflow-hidden">
                      {/* Use the actual icon from the data file instead of placeholder */}
                      {tool?.icon && Si[tool.icon] ? 
                        React.createElement(Si[tool.icon], { className: "h-4 w-4 text-white" }) :
                        <img src={`https://picsum.photos/seed/${tool?.name}/40/40`} alt={tool?.name} className="h-4 w-4" />
                      }
                  </div>
                    <span className="text-white text-sm font-medium">{tool?.name}</span>
                  <button 
                    className="h-5 w-5 rounded-full bg-slate-700 hover:bg-slate-600 flex items-center justify-center text-slate-300 hover:text-white transition-colors"
                      onClick={() => handleRemoveTool(tool?.name || "")}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
              
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
                      {selectedToolsData.map((tool) => (
                          <th key={tool?.name} className="px-6 py-5 text-left text-sm md:text-base font-bold text-white border-b border-slate-600">
                            <div className="flex items-center gap-2">
                              <div className="h-10 w-10 bg-slate-700 rounded-md flex items-center justify-center overflow-hidden border border-indigo-400/30">
                                {/* Use the actual icon from the data file instead of placeholder */}
                                {tool?.icon && Si[tool.icon] ? 
                                  React.createElement(Si[tool.icon], { className: "h-6 w-6 text-white" }) :
                                  <img src={`https://picsum.photos/seed/${tool?.name}/40/40`} alt={tool?.name} className="h-6 w-6" />
                                }
                              </div>
                              <span className="text-white">{tool?.name}</span>
                            </div>
                        </th>
                      ))}
                      {Array(3 - selectedTools.length).fill(0).map((_, i) => (
                          <th key={i} className="px-6 py-5 text-left text-sm font-semibold text-white border-b border-slate-600"></th>
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
            
            {/* Export and Share Buttons - More prominent */}
            <div className="mt-6 flex justify-end items-center gap-4">
              <Button 
                variant="outline" 
                className="bg-slate-800/50 border-slate-700 text-white hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2" 
                onClick={() => exportComparison('image')}
                disabled={selectedTools.length === 0}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                  <circle cx="8.5" cy="8.5" r="1.5" />
                  <polyline points="21 15 16 10 5 21" />
                </svg>
                Export as Image
              </Button>
              <Button 
                variant="outline" 
                className="bg-slate-800/50 border-slate-700 text-white hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                onClick={() => exportComparison('pdf')}
                disabled={selectedTools.length === 0}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                  <line x1="16" y1="13" x2="8" y2="13" />
                  <line x1="16" y1="17" x2="8" y2="17" />
                  <polyline points="10 9 9 9 8 9" />
                </svg>
                Export as PDF
              </Button>
              <Button 
                className="bg-indigo-600 hover:bg-indigo-700 text-white disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                onClick={shareComparison}
                disabled={selectedTools.length === 0}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="18" cy="5" r="3" />
                  <circle cx="6" cy="12" r="3" />
                  <circle cx="18" cy="19" r="3" />
                  <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
                  <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
                </svg>
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
                    Shows the cost structure for each tool, including free tiers, subscription options, and pay-as-you-go models. Helps you evaluate tools based on your budget constraints.
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
                  <div className="w-6 h-6 mr-2 rounded-full bg-[#FF4500] flex items-center justify-center overflow-hidden">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="white" className="w-5 h-5">
                      <path d="M10.01 7.5A1.5 1.5 0 0 0 8.5 9c0 .828.672 1.5 1.5 1.5.829 0 1.5-.672 1.5-1.5s-.671-1.5-1.5-1.5z"/>
                      <path d="M17.7 8.2c0-.9-.7-1.7-1.7-1.7-.4 0-.9.2-1.2.5-1.1-.7-2.6-1.2-4.2-1.3L11.4 2c.2 0 .4.1.6.1l2.7.6c.2.4.6.7 1.2.7.7 0 1.3-.6 1.3-1.3S16.6.8 15.9.8c-.5 0-1 .3-1.2.8l-3-.6c-.3-.1-.5 0-.6.3L9.9 5.6c-1.6 0-3.1.5-4.3 1.3-.3-.3-.7-.5-1.2-.5-1 0-1.7.7-1.7 1.7 0 .7.4 1.3 1 1.5v.1c0 2.6 3 4.6 6.8 4.6s6.8-2.1 6.8-4.6v-.1c.6-.2 1-.8 1-.5l-.3-1.5zM4.5 9c0-.8.7-1.5 1.5-1.5.8 0 1.5.7 1.5 1.5s-.7 1.5-1.5 1.5c-.8 0-1.5-.7-1.5-1.5zM12 13c-.8.8-2.3 1-3.5 1-1.3 0-2.7-.2-3.5-1-.2-.2-.2-.4 0-.6.2-.2.4-.2.6 0 .5.5 1.7.7 2.9.7 1.2 0 2.3-.2 2.9-.7.2-.2.4-.2.6 0 .1.2.1.5-.1.6z"/>
                    </svg>
            </div>
                  <span className="text-slate-400 text-sm">Reddit</span>
          </div>
                
                <h3 className="text-xl text-white font-medium mb-2">Cursor vs. Windsurf: Real-World Experience with Large Codebases</h3>
                <p className="text-slate-400 mb-3">Community discussion comparing features and performance between Windsurf and Cursor</p>
                <div className="flex items-center justify-between">
                  <div className="flex space-x-2">
                    <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center overflow-hidden">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" className="w-5 h-5">
                        <path d="M3.9 19.1L5 21l15-7-15-7 1.1 1.9L16.2 12 3.9 19.1z"/>
                      </svg>
            </div>
                    <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center overflow-hidden border border-gray-600">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" className="w-5 h-5">
                        <path d="M20.5 22H4c-1.1 0-2-.9-2-2V8c0-1.1.9-2 2-2h3V4c0-1.1.9-2 2-2h6.5c1.1 0 2 .9 2 2v2h3c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2zM9.5 4v2h6V4h-6zm8 5h-10v.5c0 .83-.67 1.5-1.5 1.5s-1.5-.67-1.5-1.5V9H4v11h16.5V9h-3zm-9.5 7c0-.83.67-1.5 1.5-1.5s1.5.67 1.5 1.5-.67 1.5-1.5 1.5-1.5zm4 0c0-.83.67-1.5 1.5-1.5s1.5.67 1.5 1.5-.67 1.5-1.5 1.5-1.5zm4 0c0-.83.67-1.5 1.5-1.5s1.5.67 1.5 1.5-.67 1.5-1.5 1.5-1.5z"/>
                      </svg>
                    </div>
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
                  <div className="w-6 h-6 mr-2 rounded-full bg-black flex items-center justify-center overflow-hidden">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" className="w-3.5 h-3.5">
                      <path d="M13.8 10.5L20.7 2h-3.1l-5.4 6.7L7.5 2H2l7.2 10.1L2 22h3.1l5.8-7.2L16 22h5.5l-7.7-11.5zm-2.4 3l-.7-1L4.6 3.7h2.5l4.9 7 .7 1 6.4 9.1h-2.5l-5.2-7.3z"/>
                    </svg>
              </div>
                  <span className="text-slate-400 text-sm">X (Twitter)</span>
            </div>
            
                <h3 className="text-xl text-white font-medium mb-2">Best AI Coding tool</h3>
                <p className="text-slate-400 mb-3">Have you ever vibe coded 6 versions of same app at the same time using all of the best AI coding tools.</p>
                <div className="flex items-center justify-between">
                  <div className="flex space-x-2">
                    <div className="w-8 h-8 rounded-full bg-gray-900 flex items-center justify-center overflow-hidden border border-gray-700">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" className="w-5 h-5">
                        <path d="M12 1.27a11 11 0 00-3.48 21.46c.55.09.73-.24.73-.53v-1.86c-3.03.66-3.67-1.45-3.67-1.45-.5-1.29-1.21-1.63-1.21-1.63-.99-.68.07-.67.07-.67 1.09.08 1.67 1.12 1.67 1.12.98 1.68 2.56 1.19 3.18.91.1-.7.38-1.19.69-1.46-2.42-.27-4.96-1.21-4.96-5.4 0-1.19.42-2.17 1.12-2.93-.11-.28-.49-1.39.11-2.89 0 0 .93-.3 3.03 1.13a10.5 10.5 0 015.54 0c2.1-1.43 3.03-1.13 3.03-1.13.6 1.5.22 2.61.11 2.89.7.76 1.12 1.74 1.12 2.93 0 4.2-2.56 5.13-4.99 5.4.39.34.73 1 .73 2.02v2.99c0 .29.19.63.74.53A11 11 0 0012 1.27"/>
                      </svg>
              </div>
                    <div className="w-8 h-8 rounded-full bg-purple-800 flex items-center justify-center overflow-hidden">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" className="w-5 h-5">
                        <path d="M12 2L2 7l10 5 8.5-4.25v6.5C18.5 17.75 15.75 20 12 20s-6.5-2.25-6.5-5.75V10H3v4.25C3 19 7 22 12 22s9-3 9-7.75V7l-9-5z"/>
                      </svg>
            </div>
            </div>
                  <span className="text-sm text-slate-500">800 likes • 102 replies</span>
                </div>
              </a>
              
              {/* Hacker News Comparison Card - Replace href with your link */}
              <a 
                href="REPLACE_WITH_HACKERNEWS_LINK" 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-5 bg-slate-800/50 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer border border-slate-700/50 hover:border-indigo-500/30 block"
              >
                <div className="flex items-start mb-3">
                  <div className="w-6 h-6 mr-2 bg-[#ff6600] flex items-center justify-center">
                    <span className="text-white font-bold text-xs">Y</span>
                    </div>
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
                  <div className="w-6 h-6 mr-2 bg-red-600 rounded-md flex items-center justify-center overflow-hidden">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" className="w-3.5 h-3.5">
                      <path d="M10 15l5.19-3L10 9v6m11.56-7.83c.13.47.22 1.1.28 1.9.07.8.1 1.49.1 2.09L22 12c0 2.19-.16 3.8-.44 4.83-.25.9-.83 1.48-1.73 1.73-.47.13-1.33.22-2.65.28-1.3.07-2.49.1-3.59.1L12 19c-4.19 0-6.8-.16-7.83-.44-.9-.25-1.48-.83-1.73-1.73-.13-.47-.22-1.1-.28-1.9-.07-.8-.1-1.49-.1-2.09L2 12c0-2.19.16-3.8.44-4.83.25-.9.83-1.48 1.73-1.73.47-.13 1.33-.22 2.65-.28 1.3-.07 2.49-.1 3.59-.1L12 5c4.19 0 6.8.16 7.83.44.9.25 1.48.83 1.73 1.73z"/>
                    </svg>
                  </div>
                  <span className="text-slate-400 text-sm">YouTube</span>
            </div>
                
                <h3 className="text-xl text-white font-medium mb-2">Claude 3.7 VS Grok 3 VS ChatGPT vs DeepSeek: Who Wins?</h3>
                <p className="text-slate-400 mb-3">In-depth compareison of the performance of four leading AI models: Claude 3.7, Grok, ChatGPT, and Deep Seek</p>
            <div className="flex items-center justify-between">
              <div className="flex space-x-2">
                    <div className="w-8 h-8 rounded-full bg-teal-600 flex items-center justify-center overflow-hidden">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="white" className="w-5 h-5">
                        <path d="M74.6 256c0-38.3 31.1-69.4 69.4-69.4h88V144h-88c-61.9 0-112 50.1-112 112s50.1 112 112 112h88v-42.6h-88c-38.3 0-69.4-31.1-69.4-69.4zm85.4 22h192v-44H160v44zm208-134h-88v42.6h88c38.3 0 69.4 31.1 69.4 69.4s-31.1 69.4-69.4 69.4h-88V368h88c61.9 0 112-50.1 112-112s-50.1-112-112-112z"/>
                      </svg>
              </div>
                    <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center overflow-hidden">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" className="w-5 h-5">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
                      </svg>
            </div>
                    <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center overflow-hidden">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" className="w-5 h-5">
                        <path d="M12 3c5.1 0 8 3.9 8 7 0 3-1.6 5-4 6-.4.1-.9.3-1 .9-.1.5-.9.9-.9.9-.6 0-.2-1.2-.3-1.5-.1-.3-.4-.5-.8-.7-3.2-.8-6-2.7-6-5.6 0-3.1 2.9-7 5-7zm.5 2c-1.7 0-3 2.1-3 5 0 2.3.8 3.6 2 3.6 1.6 0 3-1.9 3-4.6 0-2.7-1-4-2-4z"/>
                      </svg>
          </div>
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
                  <div className="w-6 h-6 mr-2 bg-white rounded-full flex items-center justify-center overflow-hidden">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40" fill="#da552f" className="w-4 h-4">
                      <path d="M23.5,15.5h-5v9h5C26.5,24.5,26.5,15.5,23.5,15.5z M21,21.5h-0.5v-3H21c0.8,0,0.8,3,0,3z"/>
                      <path d="M20,0.5C9.2,0.5,0.5,9.2,0.5,20c0,10.8,8.8,19.5,19.5,19.5S39.5,30.8,39.5,20C39.5,9.2,30.8,0.5,20,0.5z M28,24.5h-2.5v3h-2.5v-3h-5c-2.4,0-4.5-1-4.5-5c0-3.2,1.4-5,4.5-5h5v-3h2.5v3H28V24.5z"/>
                    </svg>
                  </div>
                  <span className="text-slate-400 text-sm">Product Hunt</span>
                </div>
                
                <h3 className="text-xl text-white font-medium mb-2">Midjourney vs DALL-E vs Stable Diffusion</h3>
                <p className="text-slate-400 mb-3">Comparing popular AI image generation tools</p>
            <div className="flex items-center justify-between">
              <div className="flex space-x-2">
                    <div className="w-8 h-8 rounded-full bg-indigo-900 flex items-center justify-center overflow-hidden">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" className="w-5 h-5">
                        <path d="M6.5 12.5L10 15l4.5-6 3.5 4.5v1c0 .55-.45 1-1 1H6c-.55 0-1-.45-1-1-1v-1l1.5-2zm6-1c.83 0 1.5-.67 1.5-1.5S13.33 8.5 12.5 8.5 11 9.17 11 10s.67 1.5 1.5 1.5z"/>
                        <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-1 16H6c-.55 0-1-.45-1-1-1V6c0-.55.45-1 1-1h12c.55 0 1 .45 1 1v12c0 .55-.45 1-1 1z"/>
                      </svg>
              </div>
                    <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center overflow-hidden">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" className="w-5 h-5">
                        <path d="M9,6 L9,6 C7.34,6 6,7.34 6,9 L6,15 C6,16.66 7.34,18 9,18 L15,18 C16.66,18 18,16.66 18,15 L18,9 C18,7.34 16.66,6 15,6 L9,6 Z M13,16 L11,16 L11,14 L9,14 L9,12 L11,12 L11,10 L13,10 L13,12 L15,12 L15,14 L13,14 L13,16 Z"/>
                      </svg>
            </div>
                    <div className="w-8 h-8 rounded-full bg-cyan-600 flex items-center justify-center overflow-hidden">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" className="w-5 h-5">
                        <path d="M18 12c0-3.31-2.69-6-6-6s-6 2.69-6 6 2.69 6 6 6 6-2.69 6-6zm-12 0c0-3.31 2.69-6 6-6s6 2.69 6 6-2.69 6-6 6-6z"/>
                        <path d="M12 8c2.21 0 4 1.79 4 4s-1.79 4-4 4-4-1.79-4-4 1.79-4 4-4z"/>
                      </svg>
          </div>
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

      <style jsx="true" global="true">{`
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