import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ArrowDown, Filter, Grid3X3, Grid2X2, Search, X, Plus } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import rulesData from '@/data/cursorrules.json';

// Define the structure of the rules in the JSON file
interface RawCursorRule {
  name: string;
  description: string;
  rule: string;
}

// Define the structure we'll use in the component
interface CursorRule {
  id: string;
  name: string;
  category: string;
  description: string;
  tags: string[];
  rule: string;
  featured?: boolean;
}

// Function to extract categories and tags from rule content
const processRules = (rawRules: RawCursorRule[]): CursorRule[] => {
  return rawRules.map((rawRule, index) => {
    // Extract category from the description or use a default
    const category = rawRule.description.split(' ')[0]; // Use first word as category
    
    // Extract tags from the rule content
    const tags: string[] = [];
    const lines = rawRule.rule.split('\n');
    
    // Look for section headers and add them as tags
    lines.forEach(line => {
      if (line.endsWith(':') && !line.startsWith('-') && line.length < 50) {
        const tag = line.replace(':', '').trim();
        if (tag && !tags.includes(tag)) {
          tags.push(tag);
        }
      }
    });
    
    // If no tags were found, add some default ones based on the description
    if (tags.length === 0) {
      const descWords = rawRule.description.split(' ');
      descWords.forEach(word => {
        if (word.length > 3 && !tags.includes(word)) {
          tags.push(word);
        }
      });
    }
    
    // Create a unique ID from the name
    const id = rawRule.name.toLowerCase().replace(/\s+/g, '-');
    
    // Mark some rules as featured (you can customize this logic)
    const featured = index < 2;
    
    return {
      id,
      name: rawRule.name,
      category,
      description: rawRule.description,
      tags,
      rule: rawRule.rule,
      featured
    };
  });
};

interface CursorRulesProps {
  rules?: CursorRule[];
}

export default function CursorRules({ rules: propRules }: CursorRulesProps) {
  // Process the rules from the JSON file if not provided as props
  const rules = propRules || processRules(rulesData as RawCursorRule[]);
  
  const [visibleCount, setVisibleCount] = useState(6);
  const [compact, setCompact] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRule, setSelectedRule] = useState<CursorRule | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  
  // Get all unique categories
  const categories = Array.from(new Set(rules.map(rule => rule.category)));
  
  // Filter rules based on category and search query
  const filteredRules = rules.filter(rule => {
    // Filter by category if one is selected
    if (selectedCategory && rule.category !== selectedCategory) {
      return false;
    }
    
    // Filter by search query if one exists
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        rule.name.toLowerCase().includes(query) ||
        rule.description.toLowerCase().includes(query) ||
        rule.category.toLowerCase().includes(query) ||
        rule.tags.some(tag => tag.toLowerCase().includes(query)) ||
        rule.rule.toLowerCase().includes(query) // Also search in the rule content
      );
    }
    
    return true;
  });
  
  // Sort featured rules first
  const sortedRules = [...filteredRules].sort((a, b) => {
    if (a.featured && !b.featured) return -1;
    if (!a.featured && b.featured) return 1;
    return 0;
  });
  
  // Show more rules when the button is clicked
  const handleShowMore = () => {
    if (visibleCount < filteredRules.length) {
      setVisibleCount(prev => prev + 6);
    } else {
      setVisibleCount(6);
    }
  };
  
  // Toggle between compact and expanded view
  const toggleView = () => {
    setCompact(prev => !prev);
  };
  
  const clearSearch = () => {
    setSearchQuery('');
  };

  // Handle viewing a rule
  const handleViewRule = (rule: CursorRule) => {
    setSelectedRule(rule);
    setDialogOpen(true);
  };

  // Format rule content for display
  const formatRuleContent = (content: string) => {
    return content.split('\n\n').map((paragraph, index) => (
      <div key={index} className="mb-4">
        {paragraph.split('\n').map((line, lineIndex) => {
          // Check if this is a section header
          if (line.endsWith(':') && !line.startsWith('-')) {
            return <h4 key={lineIndex} className="text-lg font-semibold text-white mt-4 mb-2">{line}</h4>;
          }
          // Check if this is a bullet point
          else if (line.startsWith('- ')) {
            return <p key={lineIndex} className="text-gray-300 ml-4 flex items-start"><span className="mr-2">•</span>{line.substring(2)}</p>;
          }
          // Regular text
          else {
            return <p key={lineIndex} className="text-gray-300">{line}</p>;
          }
        })}
      </div>
    ));
  };

  return (
    <div className="w-full p-6 space-y-6 bg-gray-900 rounded-lg">
      <div className="flex flex-wrap justify-between gap-4">
        <div className="flex flex-wrap gap-2">
          <Button 
            variant={showFilters ? "secondary" : "outline"} 
            onClick={() => setShowFilters(prev => !prev)}
            className="hover:bg-indigo-600 hover:text-white"
          >
            <div className="flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
              </svg>
              <span>Filters</span>
            </div>
          </Button>
          <Button 
            variant={showSearch ? "secondary" : "outline"} 
            onClick={() => setShowSearch(prev => !prev)}
            className="hover:bg-indigo-600 hover:text-white"
          >
            <div className="flex items-center gap-2">
              <Search size={16} />
              <span>Search</span>
            </div>
          </Button>
        </div>
        <div className="flex flex-wrap gap-2 items-center">
          <Button 
            variant="outline" 
            onClick={toggleView}
            className="hover:bg-indigo-600 hover:text-white"
          >
            <div className="flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              <span>{compact ? 'Expanded View' : 'Compact View'}</span>
            </div>
          </Button>
          <div className="text-sm text-gray-300">
            Showing <span className="font-medium text-indigo-400">{Math.min(visibleCount, filteredRules.length)}</span> of <span className="font-medium text-indigo-400">{filteredRules.length}</span> rules
          </div>
        </div>
      </div>
      
      <AnimatePresence mode="sync">
        {showFilters && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="flex flex-wrap gap-2 p-4 bg-gray-800 rounded-lg border border-gray-700">
              <Badge 
                className={`cursor-pointer hover:bg-indigo-600 ${selectedCategory === null ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-gray-700 hover:bg-indigo-600'}`}
                onClick={() => setSelectedCategory(null)}
              >
                All Rules
              </Badge>
              {categories.map(category => (
                <Badge 
                  key={category}
                  className={`cursor-pointer hover:bg-indigo-600 ${selectedCategory === category ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-gray-700 hover:bg-indigo-600'}`}
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </Badge>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      <AnimatePresence mode="sync">
        {showSearch && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search rules by name, category, or content..."
                className="pl-10 pr-10 py-2 w-full bg-gray-800 border border-gray-700 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-200"
              />
              {searchQuery && (
                <button 
                  onClick={clearSearch}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-200"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      <div className={`grid ${compact ? 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5' : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'} gap-4`}>
        {sortedRules.slice(0, visibleCount).map((rule, index) => (
          <motion.div
            key={rule.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
          >
            <Card className={`h-full flex flex-col relative overflow-hidden transition-all duration-300 hover:scale-[1.02] ${rule.featured ? 'border-indigo-400 bg-indigo-900/20' : 'border-gray-700 bg-gray-800'} hover:shadow-lg hover:shadow-indigo-500/20`}>
              <div className="p-4 flex flex-col h-full">
                <div className="mb-2">
                  <Badge className="bg-gray-700 text-gray-200 hover:bg-gray-600">{rule.category}</Badge>
                  {rule.featured && (
                    <Badge className="absolute top-2 right-2 bg-indigo-600 hover:bg-indigo-700 text-white">Featured</Badge>
                  )}
                </div>
                <h3 className="text-lg font-semibold text-gray-100 mb-2">{rule.name}</h3>
                <p className="text-gray-300 text-sm mb-4 flex-grow">{rule.description}</p>
                <div className="flex flex-wrap gap-1 mb-3">
                  {rule.tags.slice(0, 3).map(tag => (
                    <Badge key={tag} variant="outline" className="bg-gray-700 text-gray-300 border-gray-600">{tag}</Badge>
                  ))}
                  {rule.tags.length > 3 && (
                    <Badge variant="outline" className="bg-gray-700 text-gray-300 border-gray-600">+{rule.tags.length - 3} more</Badge>
                  )}
                </div>
                <Button
                  variant="link"
                  onClick={() => handleViewRule(rule)}
                  className="text-indigo-400 hover:text-indigo-300 text-sm font-medium p-0 h-auto flex items-center transition-transform hover:translate-x-1"
                >
                  View Rule
                  <span className="ml-1">→</span>
                </Button>
              </div>
            </Card>
          </motion.div>
        ))}
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: (sortedRules.length * 0.05) + 0.1 }}
        >
          <Card className="h-full flex flex-col items-center justify-center p-6 text-center bg-gray-800/50 border border-dashed border-indigo-500/50 hover:border-indigo-500 hover:bg-indigo-900/10 transition-all duration-300">
            <div className="w-12 h-12 flex items-center justify-center bg-indigo-500/20 rounded-full mb-4">
              <span className="text-indigo-400 text-xl font-bold">+</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-100 mb-2">Create Custom Rule</h3>
            <p className="text-gray-300 text-sm mb-4">Create your own custom rule for specialized workflows</p>
            <Button 
              className="bg-indigo-600 hover:bg-indigo-700 text-white"
              onClick={() => window.open('https://github.com/rohitg00/CreateMVP?tab=readme-ov-file#mcp-server-template', '_blank')}
            >
              Create Rule
            </Button>
          </Card>
        </motion.div>
      </div>
      
      {filteredRules.length > visibleCount && (
        <div className="flex justify-center mt-4">
          <Button 
            onClick={handleShowMore}
            className="bg-indigo-600 hover:bg-indigo-700 text-white"
          >
            Show More Rules
          </Button>
        </div>
      )}
      
      {visibleCount > 6 && filteredRules.length <= visibleCount && (
        <div className="flex justify-center mt-4">
          <Button 
            onClick={handleShowMore}
            className="bg-indigo-600 hover:bg-indigo-700 text-white"
          >
            Show Less
          </Button>
        </div>
      )}

      {/* Rule Details Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        {selectedRule && (
          <DialogContent className="bg-gray-800 border-gray-700 text-white max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-white flex items-center gap-2">
                {selectedRule.name}
                {selectedRule.featured && (
                  <Badge className="bg-indigo-600 text-white ml-2">Featured</Badge>
                )}
              </DialogTitle>
              <Badge className="bg-gray-700 text-gray-200 self-start mt-1">{selectedRule.category}</Badge>
            </DialogHeader>
            
            <div className="space-y-6 mt-4">
              <div>
                <h4 className="text-lg font-semibold text-white mb-2">Description</h4>
                <p className="text-gray-300">{selectedRule.description}</p>
              </div>
              
              <div>
                <h4 className="text-lg font-semibold text-white mb-2">Tags</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedRule.tags.map(tag => (
                    <Badge key={tag} variant="outline" className="bg-gray-700 text-gray-300 border-gray-600">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
              
              <div className="bg-gray-900 p-4 rounded-md border border-gray-700">
                <h4 className="text-lg font-semibold text-white mb-4">Rule Content</h4>
                <div className="text-gray-300">
                  {formatRuleContent(selectedRule.rule)}
                </div>
              </div>
              
              <div className="pt-4 border-t border-gray-700 flex gap-3">
                <Button className="bg-indigo-600 hover:bg-indigo-700 text-white flex-1">
                  Use This Rule
                </Button>
                <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700">
                  Copy to Clipboard
                </Button>
              </div>
            </div>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
} 