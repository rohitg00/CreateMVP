import cursorRulesJsonData from './cursorrules.json';

export interface CursorRule {
  id: string;
  name: string;
  category: string;
  description: string;
  tags: string[];
  rule: string;
  featured?: boolean;
}

// Add missing type annotation for the JSON data to help the compiler
interface RawCursorRule {
  name: string;
  description: string;
  rule: string;
}

// Process the cursor rules data to add IDs and extract categories and tags
export const cursorRules: CursorRule[] = (cursorRulesJsonData as RawCursorRule[]).map((rule, index) => {
  // Convert the rule name to a URL-friendly ID
  const id = rule.name.toLowerCase().replace(/\s+/g, '-');
  
  // Extract category from description (first word usually indicates the category)
  const descriptionParts = rule.description.split(' ');
  const category = descriptionParts[0];
  
  // Extract meaningful tags from the description
  const tags: string[] = [];
  
  // Extract words that might be technologies
  const techTerms = rule.description.match(/\b(React|TypeScript|Python|Django|API|Next\.js|FastAPI|PostgreSQL|SQL|Database|Data|Visualization)\b/g);
  if (techTerms) {
    techTerms.forEach(term => {
      if (!tags.includes(term)) {
        tags.push(term);
      }
    });
  }
  
  // Generate tags based on the rule name and description
  if (rule.name.includes('Django')) {
    tags.push('django');
    tags.push('python');
    tags.push('web');
  } else if (rule.name.includes('Next')) {
    tags.push('nextjs');
    tags.push('react');
    tags.push('typescript');
  } else if (rule.name.includes('FastAPI')) {
    tags.push('fastapi');
    tags.push('python');
    tags.push('api');
  } else if (rule.name.includes('React Native')) {
    tags.push('expo');
    tags.push('react-navigation');
    tags.push('mobile');
  } else if (rule.name.includes('PostgreSQL')) {
    tags.push('sql');
    tags.push('database');
    tags.push('performance');
  } else if (rule.name.includes('CreateMVP')) {
    tags.push('Chrome API');
    tags.push('TypeScript');
    tags.push('Web Extension');
  } else if (rule.name.includes('Data Analysis')) {
    tags.push('pandas');
    tags.push('numpy');
    tags.push('jupyter');
    tags.push('matplotlib');
  } else if (rule.name.includes('Data Visualization')) {
    tags.push('matplotlib');
    tags.push('seaborn');
    tags.push('plotly');
    tags.push('visualization');
  } else if (rule.name.includes('shadcn')) {
    tags.push('react');
    tags.push('next.js');
    tags.push('typescript');
    tags.push('ui');
  }
  
  // Add some default tags if we didn't find any
  if (tags.length === 0) {
    if (rule.description.includes('Web')) tags.push('web');
    if (rule.description.includes('Mobile')) tags.push('mobile');
    if (rule.description.includes('TypeScript')) tags.push('typescript');
    if (rule.description.includes('Python')) tags.push('python');
  }
  
  // Feature rules based on content - just an example selection
  const featured = 
    rule.name.includes('PostgreSQL') || 
    rule.name.includes('shadcn') || 
    index === 0; // Feature the first rule
  
  // Return the rule with original content from cursorrules.json
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

// Print the number of rules to help with debugging
console.log(`Processed ${cursorRules.length} cursor rules from JSON`);

export default cursorRules; 