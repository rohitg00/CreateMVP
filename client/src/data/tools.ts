import * as Si from "react-icons/si";

export interface Tool {
  name: string;
  description: string;
  url: string;
  icon: string;
  category: CategoryType;
  pricing: string;
  features: string[];
  useCase: string;
}

export const categories = [
  "Code Generation",
  "Development Environment",
  "Testing & QA",
  "Design & UI",
  "Project Management",
  "Documentation",
  "Deployment",
  "Data Analysis",
  "Content Generation",
  "Machine Learning"
] as const;

export type CategoryType = typeof categories[number];

export const tools: Tool[] = [
  {
    name: "GitHub Copilot",
    description: "AI-powered code completion and generation",
    url: "https://github.com/features/copilot",
    icon: "SiGithub",
    category: "Code Generation",
    pricing: "Free for students, $10/month for individuals",
    features: ["Code completion", "Natural language to code", "Multiple language support"],
    useCase: "Real-time code assistance during development"
  },
  {
    name: "V0.dev",
    description: "AI-powered UI development platform",
    url: "https://v0.dev",
    icon: "SiVercel",
    category: "Design & UI",
    pricing: "Free tier available, Pro from $20/month",
    features: ["Component generation", "Responsive design", "Real-time preview"],
    useCase: "Rapid UI prototyping and development"
  },
  {
    name: "Replit",
    description: "Collaborative browser-based IDE with AI",
    url: "https://replit.com",
    icon: "SiReplit",
    category: "Development Environment",
    pricing: "Free tier, Pro from $20/month",
    features: ["AI code generation", "Real-time collaboration", "Hosted development"],
    useCase: "Full-stack development and collaboration"
  },
  {
    name: "Claude 3",
    description: "Advanced AI assistant for coding and analysis",
    url: "https://anthropic.com/claude",
    icon: "SiOpenai",
    category: "Code Generation",
    pricing: "Usage-based pricing",
    features: ["Code review", "Bug fixing", "Documentation generation"],
    useCase: "Advanced code analysis and generation"
  },
  {
    name: "Cursor",
    description: "AI-powered code editor",
    url: "https://cursor.com",
    icon: "https://images.seeklogo.com/logo-png/61/3/cursor-logo-png_seeklogo-611587.png",
    category: "Development Environment",
    pricing: "Free",
    features: ["AI code completion", "Code explanation", "Refactoring"],
    useCase: "Enhanced code editing experience"
  },
  {
    name: "Lovable.dev",
    description: "AI design system generator",
    url: "https://lovable.dev",
    icon: "SiFramer",
    category: "Design & UI",
    pricing: "Starter tier from $20/month",
    features: ["Design system generation", "Component library", "Theme customization"],
    useCase: "Creating consistent design systems"
  },
  {
    name: "Tabnine",
    description: "AI code completion assistant",
    url: "https://tabnine.com",
    icon: "SiIntellijidea",
    category: "Code Generation",
    pricing: "Free tier, Pro from $9/month",
    features: ["Code completion", "Team learning", "Security focused"],
    useCase: "Intelligent code suggestions"
  },
  {
    name: "Mintlify",
    description: "AI documentation generator",
    url: "https://mintlify.com",
    icon: "SiReadthedocs",
    category: "Documentation",
    pricing: "Free tier, Team plans available",
    features: ["Auto-documentation", "API docs", "Team collaboration"],
    useCase: "Automated documentation generation"
  },
  {
    name: "CodeWhisperer",
    description: "Amazon's AI coding companion",
    url: "https://aws.amazon.com/codewhisperer",
    icon: "SiAmazon",
    category: "Code Generation",
    pricing: "Free for individual use",
    features: ["Code suggestions", "Security scans", "AWS integration"],
    useCase: "AWS-focused development"
  },
  {
    name: "Warp",
    description: "AI-powered terminal",
    url: "https://warp.dev",
    icon: "SiIterm2",
    category: "Development Environment",
    pricing: "Free for individual use",
    features: ["AI command suggestions", "Workflow automation", "Team sharing"],
    useCase: "Enhanced terminal experience"
  },
  {
    name: "Linear",
    description: "AI-enhanced project management",
    url: "https://linear.app",
    icon: "SiLinear",
    category: "Project Management",
    pricing: "Free tier, Team plans from $8/user/month",
    features: ["AI task organization", "Roadmap planning", "Integration"],
    useCase: "Streamlined project management"
  },
  {
    name: "Bloop",
    description: "AI-powered code search",
    url: "https://bloop.ai",
    icon: "SiElasticsearch",
    category: "Development Environment",
    pricing: "Free beta",
    features: ["Natural language code search", "Semantic analysis", "Multi-repo support"],
    useCase: "Efficient code navigation"
  }
];

export const toolsByCategory = categories.reduce((acc, category) => {
  acc[category] = tools.filter(tool => tool.category === category);
  return acc;
}, {} as Record<CategoryType, Tool[]>);