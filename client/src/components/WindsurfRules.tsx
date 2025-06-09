import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ArrowDown, Filter, Grid3X3, Grid2X2, Search, X, Plus } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import rulesData from '@/data/windsurfrules.json';

// Define the structure of the rules in the JSON file
interface RawWindsurfRule {
  name: string;
  description: string;
  rule: string;
}

// Define the structure we'll use in the component
interface WindsurfRule {
  id: string;
  name: string;
  category: string;
  description: string;
  tags: string[];
  rule: string;
  featured?: boolean;
}

// Process the rules from the JSON file
function processRules(rawRules: RawWindsurfRule[]): WindsurfRule[] {
  return rawRules.map((rule, index) => {
    // Convert the rule name to a URL-friendly ID
    const id = rule.name.toLowerCase().replace(/\s+/g, '-');
    
    // Extract categories and tags from the rule content
    const ruleContent = rule.rule;
    const lines = ruleContent.split('\n');

    // Try to extract a category from the first heading
    let category = '';
    const headingMatch = ruleContent.match(/^#\s(.+)/);
    if (headingMatch) {
      category = headingMatch[1].replace('with Windsurf Memory System', '').replace('with Windsurf Memory', '').trim();
    } else {
      category = 'General';
    }

    // Extract potential tags from the rule content
    const tags: string[] = [];
    
    // Look for key terms that could be tags
    const potentialTags = [
      'Memory Bank', 'Documentation', 'Architecture', 'Components', 'State Management',
      'TypeScript', 'React', 'Next.js', 'Node.js', 'Database', 'DevOps', 'UI/UX', 'Mobile'
    ];
    
    potentialTags.forEach(tag => {
      if (ruleContent.includes(tag)) {
        tags.push(tag);
      }
    });
    
    // If we have no tags yet, add some based on the category
    if (tags.length === 0) {
      if (category.includes('React')) tags.push('React');
      if (category.includes('Next')) tags.push('Next.js');
      if (category.includes('Node')) tags.push('Node.js');
      if (category.includes('Type')) tags.push('TypeScript');
      if (category.includes('Database')) tags.push('Database');
      if (category.includes('DevOps')) tags.push('DevOps');
      if (category.includes('UI')) tags.push('UI/UX');
      if (category.includes('Mobile')) tags.push('Mobile');
    }
    
    // Ensure we have some basic tags if none were found
    if (tags.length === 0) {
      tags.push('Windsurf', 'Memory Bank');
    }
    
    // Feature rules other than "General Windsurf Rule"
    const featured = rule.name !== "General Windsurf Rule";
    
    // Return the rule with original content from windsurfrules.json
    return {
      id,
      name: rule.name,
      category,
      description: rule.description,
      tags: Array.from(new Set(tags)), // Remove duplicates
      rule: rule.rule, // Keep the original rule content
      featured
    };
  });
}

interface WindsurfRulesProps {
  rules?: WindsurfRule[];
}

export default function WindsurfRules({ rules: propRules }: WindsurfRulesProps) {
  // Process the rules from the JSON file if not provided as props
  const rules = propRules || processRules(rulesData as RawWindsurfRule[]);
  
  const [visibleCount, setVisibleCount] = useState(6);
  const [compact, setCompact] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRule, setSelectedRule] = useState<WindsurfRule | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  
  // Check for rule ID in URL hash on mount
  useEffect(() => {
    const hash = window.location.hash;
    console.log('Current URL hash:', hash);
    
    // Handle both formats: direct rule URLs and nested paths
    if (hash.includes('typescript-development') || hash.includes('windsurf-rules/')) {
      // Extract the rule ID from the URL
      let ruleId;
      if (hash.includes('/')) {
        // Format: #windsurf-rules/rule-id
        ruleId = hash.split('/').pop();
      } else {
        // Format: /rule-id at end of URL
        ruleId = window.location.pathname.split('/').pop();
      }
      
      console.log('Extracted rule ID:', ruleId);
      
      if (ruleId) {
        // Try to find the rule
        const rule = rules.find(r => r.id === ruleId || r.id.includes(ruleId));
        console.log('Found rule:', rule);
        
        if (rule) {
          setSelectedRule(rule);
          setDialogOpen(true);
        } else {
          console.log('No matching rule found. Available IDs:', rules.map(r => r.id));
        }
      }
    }
    
    // Add hashchange listener to handle direct links
    const handleHashChange = () => {
      const newHash = window.location.hash;
      console.log('Hash changed to:', newHash);
      
      if (newHash.includes('typescript-development') || newHash.includes('windsurf-rules/')) {
        let ruleId;
        if (newHash.includes('/')) {
          ruleId = newHash.split('/').pop();
        } else {
          ruleId = window.location.pathname.split('/').pop();
        }
        
        console.log('Hash change - extracted rule ID:', ruleId);
        
        if (ruleId) {
          const rule = rules.find(r => r.id === ruleId || r.id.includes(ruleId));
          console.log('Hash change - found rule:', rule);
          
          if (rule) {
            setSelectedRule(rule);
            setDialogOpen(true);
          }
        }
      } else if (newHash === '#windsurf-rules') {
        // Close dialog if we navigate back to just the windsurf-rules section
        setDialogOpen(false);
      }
    };
    
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [rules]);
  
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
  
  // Toggle compact view
  const toggleView = () => {
    setCompact(prev => !prev);
  };
  
  // Toggle filters
  const toggleFilters = () => {
    setShowFilters(prev => !prev);
  };
  
  // Toggle search
  const toggleSearch = () => {
    setShowSearch(prev => !prev);
    if (showSearch) {
      setSearchQuery('');
    }
  };
  
  // Clear search query
  const clearSearch = () => {
    setSearchQuery('');
  };
  
  const resetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('');
  };
  
  // Handle category selection
  const handleCategorySelect = (category: string) => {
    if (selectedCategory === category) {
      setSelectedCategory(null); // Deselect if already selected
    } else {
      setSelectedCategory(category);
    }
  };
  
  // Open the dialog with the selected rule
  const openRuleDialog = (rule: WindsurfRule) => {
    setSelectedRule(rule);
    setDialogOpen(true);
  };
  
  // Format rule content for display
  const formatRuleContent = (content: string) => {
    // Split the content into paragraphs
    const paragraphs = content.split('\n\n');
    
    return paragraphs.map((paragraph, index) => {
      // If the paragraph is a heading
      if (paragraph.startsWith('#')) {
        const level = paragraph.match(/^(#+)/)?.[0].length || 1;
        const text = paragraph.replace(/^#+\s/, '');
        
        switch (level) {
          case 1:
            return <h2 key={index} className="text-2xl font-bold mt-8 mb-3 text-white">{text}</h2>;
          case 2:
            return <h3 key={index} className="text-xl font-bold mt-6 mb-2 text-white">{text}</h3>;
          case 3:
            return <h4 key={index} className="text-lg font-semibold mt-5 mb-2 text-slate-100">{text}</h4>;
          default:
            return <h5 key={index} className="text-base font-semibold mt-4 mb-1 text-slate-100">{text}</h5>;
        }
      }
      
      // If the paragraph is a list
      if (paragraph.includes('\n- ')) {
        const listItems = paragraph.split('\n- ');
        const title = listItems.shift() || '';
        
        return (
          <div key={index} className="my-4">
            {title && <p className="mb-2 text-slate-200">{title}</p>}
            <ul className="list-disc pl-6 space-y-2">
              {listItems.map((item, itemIndex) => (
                <li key={itemIndex} className="text-slate-300">{item}</li>
              ))}
            </ul>
          </div>
        );
      }
      
      // If the paragraph is code
      if (paragraph.includes('```')) {
        const parts = paragraph.split('```');
        return (
          <div key={index} className="my-5">
            {parts.map((part, partIndex) => {
              if (partIndex % 2 === 1) { // This is code
                return (
                  <pre key={partIndex} className="bg-slate-900 p-4 rounded-md overflow-x-auto text-sm text-slate-300 border border-slate-700 my-3">
                    <code>{part.replace(/^mermaid\n/, '')}</code>
                  </pre>
                );
              } else {
                return part && <p key={partIndex} className="mb-3 text-slate-300">{part}</p>;
              }
            })}
          </div>
        );
      }
      
      // Regular paragraph
      return <p key={index} className="mb-4 text-slate-300">{paragraph}</p>;
    });
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-white">Windsurf Rules</h1>
        
        <div className="flex flex-wrap gap-2 items-center">
          <Button 
            variant="outline" 
            onClick={toggleView}
            className="hover:bg-indigo-600 hover:text-white"
          >
            <div className="flex items-center gap-2">
              {compact ? <Grid3X3 className="h-4 w-4" /> : <Grid2X2 className="h-4 w-4" />}
              <span>{compact ? 'Expanded View' : 'Compact View'}</span>
            </div>
          </Button>
          <div className="text-sm text-gray-300">
            Showing <span className="font-medium text-indigo-400">{Math.min(visibleCount, filteredRules.length)}</span> of <span className="font-medium text-indigo-400">{filteredRules.length}</span> rules
          </div>
        </div>
      </div>
      
      <div className="flex flex-wrap gap-3 mb-4">
        <Button 
          variant="outline" 
          onClick={toggleFilters}
          className="hover:bg-indigo-600 hover:text-white"
        >
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            <span>Filters</span>
            {selectedCategory && <Badge className="bg-indigo-600 ml-1">1</Badge>}
          </div>
        </Button>
        
        <Button 
          variant="outline" 
          onClick={toggleSearch}
          className="hover:bg-indigo-600 hover:text-white"
        >
          <div className="flex items-center gap-2">
            <Search className="h-4 w-4" />
            <span>Search</span>
          </div>
        </Button>
      </div>
      
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
                className="pl-10 pr-10 py-2 w-full bg-slate-800 border border-slate-700 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-200"
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
      
      <AnimatePresence mode="sync">
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden mb-4"
          >
            <div className="bg-slate-800 border border-slate-700 rounded-md p-4 my-3">
              <h3 className="text-sm font-semibold mb-3 text-gray-200">Categories</h3>
              <div className="flex flex-wrap gap-2">
                {categories.map(category => (
                  <Badge
                    key={category}
                    onClick={() => handleCategorySelect(category)}
                    className={`cursor-pointer ${
                      selectedCategory === category 
                        ? 'bg-indigo-600 hover:bg-indigo-700' 
                        : 'bg-slate-700 hover:bg-slate-600'
                    }`}
                  >
                    {category}
                  </Badge>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {filteredRules.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-4xl mb-4">🔍</div>
          <h3 className="text-xl font-semibold text-white mb-2">No rules found</h3>
          <p className="text-slate-400">Try adjusting your search or filters</p>
          {(searchQuery || selectedCategory) && (
            <Button 
              onClick={resetFilters}
              variant="outline" 
              className="mt-4 hover:bg-indigo-600 hover:text-white"
            >
              Reset Filters
            </Button>
          )}
        </div>
      ) : (
        <div className={`grid gap-6 ${compact ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3' : 'grid-cols-1 lg:grid-cols-2'}`}>
          {sortedRules.slice(0, visibleCount).map(rule => (
            <motion.div
              key={rule.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Link to={`/windsurf-rules/${rule.id}`}>
                <div 
                  className={`h-full flex flex-col cursor-pointer rounded-lg border border-slate-700/70 bg-slate-800/80 backdrop-blur-sm p-5 hover:shadow-md hover:shadow-indigo-500/10 hover:border-indigo-500/50 transition-all ${
                    rule.featured ? 'border-indigo-500/70 bg-indigo-950/30' : ''
                  }`}
                >
                  <div>
                    <div className="flex items-center mb-1">
                      <Badge variant="secondary" className="bg-slate-700 text-xs font-normal text-slate-300">
                        {rule.category}
                      </Badge>
                      {rule.featured && (
                        <Badge className="ml-2 bg-indigo-600 text-xs font-normal text-white">
                          Featured
                        </Badge>
                      )}
                    </div>
                    
                    <h3 className="text-xl font-bold text-white mt-3 mb-2">{rule.name}</h3>
                    <p className="text-slate-300 text-sm mb-4 line-clamp-2">{rule.description}</p>
                  </div>
                  
                  <div className="mt-auto">
                    <div className="flex flex-wrap gap-1 mb-4">
                      {rule.tags.slice(0, 3).map(tag => (
                        <Badge key={tag} variant="outline" className="text-xs font-normal text-slate-300 border-slate-600">
                          {tag}
                        </Badge>
                      ))}
                      {rule.tags.length > 3 && (
                        <Badge variant="outline" className="text-xs font-normal text-slate-300 border-slate-600">
                          +{rule.tags.length - 3} more
                        </Badge>
                      )}
                    </div>
                    
                    <div className="flex items-center text-indigo-400 text-sm pt-2 border-t border-slate-700">
                      View Rule
                      <ArrowRight className="ml-1 h-4 w-4" />
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}

          {/* Add Custom Windsurf Rule Card */}
          <motion.div
            className="bg-slate-900/50 border-2 border-dashed border-slate-700 rounded-2xl p-8 flex flex-col items-center justify-center text-center hover:border-purple-500/50 transition-all duration-300"
          >
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center mb-4 border border-purple-500/20">
              <Plus className="w-8 h-8 text-purple-400" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Add Custom Windsurf Rule</h3>
            <p className="text-sm text-slate-400 mb-4">Create your own custom Windsurf rule for AI Flow</p>
            <Button 
              className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700"
              onClick={() => window.open('https://github.com/rohitg00/CreateMVP?tab=readme-ov-file#mcp-server-template', '_blank')}
            >
              Add Rule
            </Button>
          </motion.div>
        </div>
      )}
      
      {filteredRules.length > visibleCount && (
        <div className="flex justify-center mt-8">
          <Button 
            onClick={handleShowMore}
            className="bg-indigo-600 hover:bg-indigo-700 text-white"
          >
            Show More Rules
          </Button>
        </div>
      )}
      
      {visibleCount > 6 && filteredRules.length <= visibleCount && (
        <div className="flex justify-center mt-8">
          <Button 
            onClick={handleShowMore}
            className="bg-indigo-600 hover:bg-indigo-700 text-white"
          >
            Show Less
          </Button>
        </div>
      )}

      {/* Rule Details Dialog */}
      <Dialog open={dialogOpen} onOpenChange={(open) => {
        setDialogOpen(open);
        if (!open && window.location.hash.includes('/')) {
          // When closing the dialog, update the URL to remove the rule ID
          window.location.hash = '#windsurf-rules';
        }
      }}>
        {selectedRule && (
          <DialogContent className="bg-slate-800 border-slate-700 text-white max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-white flex items-center gap-2">
                {selectedRule.name}
                {selectedRule.featured && (
                  <Badge className="bg-indigo-600 text-white ml-2">Featured</Badge>
                )}
              </DialogTitle>
              <Badge className="bg-slate-700 text-slate-200 self-start mt-1">{selectedRule.category}</Badge>
            </DialogHeader>
            
            <div className="flex flex-wrap gap-1 mb-4">
              {selectedRule.tags.map(tag => (
                <Badge key={tag} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
            
            <DialogDescription className="text-slate-300">
              {selectedRule.description}
            </DialogDescription>
            
            <div className="mt-4 text-slate-200">
              {formatRuleContent(selectedRule.rule)}
            </div>
            
            <div className="text-slate-400 text-sm mt-8">
              <p>
                To use this rule in Windsurf, copy the entire rule content and paste it into your Memory Bank.
              </p>
              <p className="mt-2">
                For more information on how to use Windsurf Memory Bank system, refer to the{" "}
                <a href="https://docs.codeium.com/windsurf/getting-started" target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:text-indigo-300">
                  Windsurf documentation
                </a>.
              </p>
            </div>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
} 