import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import rulesData from '@/data/windsurfrules.json';

// Define the structure of the rule
export interface WindsurfRule {
  id: string;
  name: string;
  category: string;
  description: string;
  tags: string[];
  rule: string;
  featured?: boolean;
}

// Process the rules from the JSON file
function processRules(rawRules: any[]): WindsurfRule[] {
  return rawRules.map((rule) => {
    // Convert the rule name to a URL-friendly ID
    const id = rule.name.toLowerCase().replace(/\s+/g, '-');
    
    // Extract categories and tags from the rule content
    const ruleContent = rule.rule;

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
    
    return {
      id,
      name: rule.name,
      category,
      description: rule.description,
      tags: Array.from(new Set(tags)), // Remove duplicates
      rule: rule.rule,
      featured
    };
  });
}

interface WindsurfRuleDetailProps {
  rule?: WindsurfRule;
  ruleId?: string;
}

export default function WindsurfRuleDetail({ rule: propRule, ruleId }: WindsurfRuleDetailProps) {
  const [rule, setRule] = useState<WindsurfRule | null>(propRule || null);
  const [loading, setLoading] = useState(!propRule && Boolean(ruleId));
  
  // If we don't have a rule but we have an ID, try to find the rule
  useEffect(() => {
    if (!propRule && ruleId) {
      setLoading(true);
      console.log('Looking for rule with ID:', ruleId);
      
      // Process the rules to find the matching one
      const rules = processRules(rulesData as any[]);
      console.log('Available rule IDs:', rules.map(r => r.id));
      
      const foundRule = rules.find(r => 
        r.id === ruleId || 
        r.id.includes(ruleId) || 
        ruleId.includes(r.id)
      );
      
      console.log('Found rule:', foundRule);
      
      if (foundRule) {
        setRule(foundRule);
      }
      
      setLoading(false);
    }
  }, [propRule, ruleId]);
  
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
  
  if (loading) {
    return (
      <div className="py-10 flex justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-indigo-500 rounded-full border-t-transparent"></div>
      </div>
    );
  }
  
  if (!rule) {
    return (
      <div className="py-10 text-center">
        <h2 className="text-2xl font-bold text-white mb-4">Rule Not Found</h2>
        <p className="text-slate-300 mb-6">The rule you're looking for doesn't seem to exist or hasn't loaded correctly.</p>
        <Link to="/mcp-rules#windsurf-rules">
          <Button className="bg-indigo-600 hover:bg-indigo-700">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to All Rules
          </Button>
        </Link>
      </div>
    );
  }
  
  return (
    <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 shadow-xl max-w-4xl mx-auto">
      <div className="mb-4">
        <Link to="/mcp-rules#windsurf-rules">
          <Button variant="ghost" className="text-indigo-400 hover:text-indigo-300 hover:bg-slate-700 mb-4 -ml-2">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to All Rules
          </Button>
        </Link>
      </div>
      
      <div className="flex items-center mb-2">
        <h1 className="text-3xl font-bold text-white mr-3">{rule.name}</h1>
        {rule.featured && (
          <Badge className="bg-indigo-600 text-white">Featured</Badge>
        )}
      </div>
      
      <div className="flex items-center mb-4">
        <Badge className="bg-slate-700 text-slate-200">{rule.category}</Badge>
      </div>
      
      <div className="flex flex-wrap gap-1 mb-6">
        {rule.tags.map(tag => (
          <Badge key={tag} variant="outline" className="text-xs text-indigo-300 border-indigo-500/50 hover:bg-indigo-950/50">
            {tag}
          </Badge>
        ))}
      </div>
      
      <p className="text-slate-300 text-lg mb-8">{rule.description}</p>
      
      <div className="mt-4 text-slate-200 border-t border-slate-700 pt-6">
        {formatRuleContent(rule.rule)}
      </div>
      
      <div className="text-slate-400 text-sm mt-10 pt-6 border-t border-slate-700">
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
    </div>
  );
} 