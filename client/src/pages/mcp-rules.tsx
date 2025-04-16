import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Layers, Code, ArrowRight, Plus, Check, Wind } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import CursorRules from "@/components/CursorRules";
import WindsurfRules from "@/components/WindsurfRules";
import cursorRules from "@/data/rules";
import { useLocation } from "wouter";

// Updated MCP servers data from cursor.directory and modelcontextprotocol-servers repository
export const mcpServers = [
  // Original servers
  {
    id: "linear",
    name: "Linear",
    logo: "https://cdn.brandfetch.io/iduDa181eM/theme/light/symbol.svg",
    description: "Integration with Linear's issue tracking system through MCP, allowing LLMs to interact with Linear issues. Manage tasks, sprints, and projects directly from Cursor.",
    githubUrl: "https://github.com/linear",
    websiteUrl: "https://linear.app"
  },
  {
    id: "github",
    name: "GitHub",
    logo: "https://cdn.brandfetch.io/idZAyF9rlg/theme/light/symbol.svg",
    description: "Integration with Github's API through MCP, allowing LLMs to interact with repositories, issues, pull requests, and more. Create files, search code, and manage issues directly from Cursor.",
    githubUrl: "https://github.com/octokit/octokit.js",
    websiteUrl: "https://github.com"
  },
  {
    id: "resend",
    name: "Resend",
    logo: "https://pbs.twimg.com/profile_images/1749861436074151936/MPN32ysD_400x400.jpg",
    description: "Send emails using Resend's API directly from Cursor or Claude Desktop without copy-pasting. Create and send professional emails with AI assistance.",
    githubUrl: "https://github.com/resendlabs/resend-node",
    websiteUrl: "https://resend.com"
  },
  {
    id: "postgresql",
    name: "PostgreSQL",
    logo: "https://cdn.brandfetch.io/idjSeCeMle/theme/dark/logo.svg",
    description: "Read-only access to PostgreSQL databases. Inspect schemas and execute read-only queries. Analyze data and generate reports with AI assistance.",
    githubUrl: "https://github.com/postgres/postgres",
    websiteUrl: "https://www.postgresql.org"
  },
  {
    id: "supabase",
    name: "Supabase",
    logo: "https://cdn.brandfetch.io/idsSceG8fK/w/436/h/449/theme/dark/symbol.svg",
    description: "MCP server for PostgREST. Perform database queries and operations on Postgres databases via PostgREST. Build and manage your database with AI assistance.",
    githubUrl: "https://github.com/supabase/supabase",
    websiteUrl: "https://supabase.com"
  },
  {
    id: "vercel",
    name: "Vercel",
    logo: "https://cdn.brandfetch.io/idDpCfN4VD/theme/light/symbol.svg",
    description: "Integrates with Vercel's serverless infrastructure for AI model interactions like chatbots and content generation. Deploy and manage your applications with AI assistance.",
    githubUrl: "https://github.com/vercel/vercel",
    websiteUrl: "https://vercel.com"
  },
  {
    id: "stripe",
    name: "Stripe",
    logo: "https://cdn.brandfetch.io/idxAg10C0L/theme/light/logo.svg",
    description: "Interact with the Stripe API to manage payments, subscriptions, and other financial operations. Process payments and manage customer subscriptions with AI assistance.",
    githubUrl: "https://github.com/stripe/stripe-node",
    websiteUrl: "https://stripe.com"
  },
  {
    id: "figma",
    name: "Figma",
    logo: "https://cdn.brandfetch.io/idZHcZ_i7F/theme/dark/symbol.svg",
    description: "Provide coding agents with design data direct from Figma for far more accurate design implementations. Turn designs into code with AI assistance.",
    githubUrl: "https://github.com/figma",
    websiteUrl: "https://figma.com"
  },
  {
    id: "memory",
    name: "Memory",
    logo: "https://cdn-icons-png.flaticon.com/512/7838/7838457.png",
    description: "Store and retrieve conversation history and user preferences. Maintain context across multiple sessions and create conversation summaries for improved context.",
    githubUrl: "https://github.com/anthropic-ai/claude-api",
    websiteUrl: "https://claude.ai"
  },
  {
    id: "filesystem",
    name: "Filesystem",
    logo: "https://cdn-icons-png.flaticon.com/512/2965/2965335.png",
    description: "Access and modify files on your local filesystem. Search through files using regex patterns and use semantic search to find relevant code.",
    githubUrl: "https://github.com/modelcontextprotocol/servers/tree/main/src/filesystem",
    websiteUrl: "https://modelcontextprotocol.io"
  },
  {
    id: "firecrawl",
    name: "FireCrawl",
    logo: "https://bookface-images.s3.amazonaws.com/small_logos/1d81916c7376f47ef6d8a6a498411483e26238a8.png",
    description: "Web scraping, crawling, and search capabilities for AI. Extract content from web pages and perform deep research across multiple sources.",
    githubUrl: "https://github.com/FireCrawl/firecrawl",
    websiteUrl: "https://firecrawl.dev"
  },
  {
    id: "brave-search",
    name: "Brave Search",
    logo: "https://brave.com/static-assets/images/brave-logo-dark.svg",
    description: "Web and local search using Brave's Search API. Get relevant search results without tracking and access web content with context and summaries.",
    githubUrl: "https://github.com/modelcontextprotocol/servers/tree/main/src/brave-search",
    websiteUrl: "https://search.brave.com"
  },
  {
    id: "everart",
    name: "EverArt",
    logo: "https://pbs.twimg.com/profile_images/1717719314369789952/AmXarABn_400x400.png",
    description: "AI image generation using various models. Create variations of existing images and edit images with text prompts.",
    githubUrl: "https://github.com/modelcontextprotocol/servers/tree/main/src/everart",
    websiteUrl: "https://everart.io"
  },
  {
    id: "fetch",
    name: "Fetch",
    logo: "https://cdn-icons-png.flaticon.com/512/2432/2432572.png",
    description: "Web content fetching and conversion for efficient LLM usage. Automatically convert web content to formats optimized for LLMs.",
    githubUrl: "https://github.com/modelcontextprotocol/servers/tree/main/src/fetch",
    websiteUrl: "https://modelcontextprotocol.io"
  },
  {
    id: "git",
    name: "Git",
    logo: "https://git-scm.com/images/logos/downloads/Git-Icon-1788C.svg",
    description: "Tools to read, search, and manipulate Git repositories. View commit history, search through code, and manage branches.",
    githubUrl: "https://github.com/modelcontextprotocol/servers/tree/main/src/git",
    websiteUrl: "https://git-scm.com"
  },
  
  // New servers from modelcontextprotocol-servers repository
  {
    id: "aws-kb-retrieval-server",
    name: "AWS KB Retrieval",
    logo: "https://upload.wikimedia.org/wikipedia/commons/9/93/Amazon_Web_Services_Logo.svg",
    description: "Retrieval from AWS Knowledge Base using Bedrock Agent Runtime. Query Bedrock Agent Runtime and extract structured data.",
    githubUrl: "https://github.com/modelcontextprotocol/servers/tree/main/src/aws-kb-retrieval-server",
    websiteUrl: "https://aws.amazon.com/bedrock/"
  },
  {
    id: "everything",
    name: "Everything",
    logo: "https://cdn-icons-png.flaticon.com/512/2965/2965282.png",
    description: "Ultra-fast file indexing and search for Windows. Quick access to files and folders using advanced search patterns.",
    githubUrl: "https://github.com/modelcontextprotocol/servers/tree/main/src/everything",
    websiteUrl: "https://www.voidtools.com/"
  },
  {
    id: "firebase",
    name: "Firebase",
    logo: "https://www.vectorlogo.zone/logos/firebase/firebase-icon.svg",
    description: "Interact with Firebase services including Firestore, Realtime Database, Authentication, and Storage. Manage your Firebase applications with AI assistance.",
    githubUrl: "https://github.com/modelcontextprotocol/servers/tree/main/src/firebase",
    websiteUrl: "https://firebase.google.com/"
  },
  {
    id: "google-calendar",
    name: "Google Calendar",
    logo: "https://upload.wikimedia.org/wikipedia/commons/a/a5/Google_Calendar_icon_%282020%29.svg",
    description: "Interact with Google Calendar to manage events and schedules. Create, update, delete and retrieve calendar events with AI assistance.",
    githubUrl: "https://github.com/nspady/google-calendar-mcp",
    websiteUrl: "https://calendar.google.com/"
  },
  {
    id: "google-drive",
    name: "Google Drive",
    logo: "https://upload.wikimedia.org/wikipedia/commons/1/12/Google_Drive_icon_%282020%29.svg",
    description: "File access and update capabilities for Google Drive. Create, read, and update files and folders in your Google Drive.",
    githubUrl: "https://github.com/modelcontextprotocol/servers/tree/main/src/google-drive",
    websiteUrl: "https://drive.google.com/"
  },
  {
    id: "google-maps",
    name: "Google Maps",
    logo: "https://cdn-icons-png.flaticon.com/512/2642/2642502.png",
    description: "Location data, directions, and place details. Search for places and calculate routes between locations.",
    githubUrl: "https://github.com/modelcontextprotocol/servers/tree/main/src/google-maps",
    websiteUrl: "https://maps.google.com/"
  },
  {
    id: "lemon-squeezy",
    name: "Lemon Squeezy",
    logo: "https://cdn-icons-png.flaticon.com/512/7475/7475811.png",
    description: "Access e-commerce, subscription, and customer data from your Lemon Squeezy store. Manage products, subscriptions, and orders.",
    githubUrl: "https://github.com/modelcontextprotocol/servers/tree/main/src/lemon-squeezy",
    websiteUrl: "https://lemonsqueezy.com/"
  },
  {
    id: "slack",
    name: "Slack",
    logo: "https://cdn4.iconfinder.com/data/icons/logos-and-brands/512/306_Slack_logo-512.png",
    description: "Channel management and messaging capabilities for Slack. Send messages to channels and search through message history.",
    githubUrl: "https://github.com/modelcontextprotocol/servers/tree/main/src/slack",
    websiteUrl: "https://slack.com/"
  },
  {
    id: "sqlite",
    name: "SQLite",
    logo: "https://www.vectorlogo.zone/logos/sqlite/sqlite-icon.svg",
    description: "Database interaction and business intelligence capabilities for SQLite databases. Query your database and generate insights.",
    githubUrl: "https://github.com/modelcontextprotocol/servers/tree/main/src/sqlite",
    websiteUrl: "https://www.sqlite.org/"
  },
  {
    id: "time",
    name: "Time",
    logo: "https://cdn-icons-png.flaticon.com/512/2838/2838779.png",
    description: "Time and timezone conversion capabilities. Get current time in various formats and convert between different time zones.",
    githubUrl: "https://github.com/modelcontextprotocol/servers/tree/main/src/time",
    websiteUrl: "https://modelcontextprotocol.io"
  },
  {
    id: "upstash",
    name: "Upstash",
    logo: "https://pbs.twimg.com/profile_images/1359201856682033154/Duo7EkIJ_400x400.jpg",
    description: "Serverless Redis, Kafka, and QStash for cloud applications. Access and manipulate your Upstash databases and queues.",
    githubUrl: "https://github.com/modelcontextprotocol/servers/tree/main/src/upstash",
    websiteUrl: "https://upstash.com/"
  },
  {
    id: "convex",
    name: "Convex",
    logo: "https://pbs.twimg.com/profile_images/1886599096636694528/0Y8VYt94_400x400.png",
    description: "Reactive backend for JavaScript applications. Interact with Convex backend functions and databases.",
    githubUrl: "https://github.com/modelcontextprotocol/servers/tree/main/src/convex",
    websiteUrl: "https://www.convex.dev/"
  },
  {
    id: "sentry",
    name: "Sentry",
    logo: "https://pbs.twimg.com/profile_images/1778495572238086150/qDkInWXX_400x400.png",
    description: "Retrieving and analyzing issues from Sentry.io. Explore error reports, stack traces, and debug information.",
    githubUrl: "https://github.com/modelcontextprotocol/servers/tree/main/src/sentry",
    websiteUrl: "https://sentry.io/"
  },
  {
    id: "perplexity-sonar",
    name: "Perplexity Sonar",
    logo: "https://cdn-icons-png.flaticon.com/512/6434/6434861.png",
    description: "Perplexity Sonar provides advanced web search capabilities with AI-powered summarization and information retrieval. Access real-time information and get comprehensive answers to complex queries.",
    githubUrl: "https://github.com/ppl-ai/modelcontextprotocol",
    websiteUrl: "https://www.perplexity.ai/"
  },
  // Community servers
  {
    id: "anki",
    name: "Anki",
    logo: "https://cdn-icons-png.flaticon.com/512/4720/4720455.png",
    description: "An MCP server for interacting with your Anki decks and cards. Manage and review your flashcards with AI assistance.",
    githubUrl: "https://github.com/scorzeth/anki-mcp-server",
    websiteUrl: "https://apps.ankiweb.net"
  },
  {
    id: "discord",
    name: "Discord",
    logo: "https://www.svgrepo.com/show/353655/discord-icon.svg",
    description: "A MCP server to connect to Discord guilds through a bot and read and write messages in channels. Interact with Discord communities using AI.",
    githubUrl: "https://github.com/v-3/discordmcp",
    websiteUrl: "https://discord.com"
  },
  {
    id: "playwright",
    name: "Playwright",
    logo: "https://playwright.dev/img/playwright-logo.svg",
    description: "This MCP Server will help you run browser automation and webscraping using Playwright. Automate browser interactions and extract data from websites.",
    githubUrl: "https://github.com/executeautomation/mcp-playwright",
    websiteUrl: "https://playwright.dev"
  },
  {
    id: "snowflake",
    name: "Snowflake",
    logo: "https://cdn-icons-png.flaticon.com/512/7865/7865303.png",
    description: "This MCP server enables LLMs to interact with Snowflake databases, allowing for secure and controlled data operations. Query and analyze data in your Snowflake instance.",
    githubUrl: "https://github.com/isaacwasserman/mcp-snowflake-server",
    websiteUrl: "https://www.snowflake.com"
  },
  {
    id: "neon",
    name: "Neon",
    logo: "https://neon.tech/favicon/favicon.png",
    description: "Interact with Neon serverless PostgreSQL databases. Manage projects, branches, and execute SQL queries with AI assistance.",
    githubUrl: "https://github.com/modelcontextprotocol/servers/tree/main/src/neon",
    websiteUrl: "https://neon.tech/"
  },
  {
    id: "rag-web-browser",
    name: "RAG Web Browser",
    logo: "https://cdn-icons-png.flaticon.com/512/2807/2807245.png",
    description: "An MCP server for Apify's open-source RAG Web Browser Actor to perform web searches, scrape URLs, and return content in Markdown. Enhance AI capabilities with web content.",
    githubUrl: "https://github.com/apify/mcp-server-rag-web-browser",
    websiteUrl: "https://apify.com/apify/rag-web-browser"
  },
  // New servers from GitHub repository
  {
    id: "polar",
    name: "Polar",
    logo: "https://cdn-icons-png.flaticon.com/512/1453/1453241.png",
    description: "Access your Polar subscriptions, customers, products and orders data. Manage your Polar SaaS monetization with AI assistance.",
    githubUrl: "https://github.com/teampolaris/mcp-server-polar",
    websiteUrl: "https://polar.sh"
  },
  {
    id: "posthog",
    name: "PostHog",
    logo: "https://products.containerize.com/fr/business-intelligence/posthog/menu_image.png",
    description: "Query your PostHog analytics, feature flags, and experiments data. Analyze user behavior and make data-driven decisions with AI assistance.",
    githubUrl: "https://github.com/PostHog/posthog-mcp",
    websiteUrl: "https://posthog.com"
  },
  {
    id: "notion",
    name: "Notion",
    logo: "https://cdn-icons-png.flaticon.com/512/5968/5968885.png",
    description: "Interact with your Notion workspace, pages, and databases. Create, read, and update content in your Notion workspace with AI assistance.",
    githubUrl: "https://github.com/modelcontextprotocol/servers/tree/main/src/notion",
    websiteUrl: "https://notion.so"
  },
  {
    id: "airtable",
    name: "Airtable",
    logo: "https://cdn-icons-png.flaticon.com/512/5968/5968069.png",
    description: "Connect to Airtable bases and tables. Query, update, and manipulate your Airtable data with natural language commands.",
    githubUrl: "https://github.com/modelcontextprotocol/servers/tree/main/src/airtable",
    websiteUrl: "https://airtable.com"
  },
  {
    id: "anthropic",
    name: "Anthropic",
    logo: "https://cdn-icons-png.flaticon.com/512/11039/11039001.png",
    description: "Direct access to Anthropic's Claude API. Generate text, answer questions, and solve problems with Claude's AI capabilities.",
    githubUrl: "https://github.com/modelcontextprotocol/servers/tree/main/src/anthropic",
    websiteUrl: "https://anthropic.com"
  },
  {
    id: "openai",
    name: "OpenAI",
    logo: "https://cdn-icons-png.flaticon.com/512/5969/5969346.png",
    description: "Utilize OpenAI's powerful models and APIs. Generate text, create images, and build AI applications with GPT and DALL-E.",
    githubUrl: "https://github.com/modelcontextprotocol/servers/tree/main/src/openai",
    websiteUrl: "https://openai.com"
  },
  {
    id: "google-ai",
    name: "Google AI",
    logo: "https://cdn-icons-png.flaticon.com/512/2991/2991147.png",
    description: "Access Google's suite of AI models and services. Use Gemini and other Google AI capabilities for various tasks.",
    githubUrl: "https://github.com/modelcontextprotocol/servers/tree/main/src/google-ai",
    websiteUrl: "https://ai.google.dev"
  },
  {
    id: "trello",
    name: "Trello",
    logo: "https://cdn-icons-png.flaticon.com/512/5968/5968927.png",
    description: "Manage your Trello boards, lists, and cards. Create and organize tasks, add comments, and move cards between lists with AI assistance.",
    githubUrl: "https://github.com/modelcontextprotocol/servers/tree/main/src/trello",
    websiteUrl: "https://trello.com"
  },
  {
    id: "asana",
    name: "Asana",
    logo: "https://cdn-icons-png.flaticon.com/512/5968/5968836.png",
    description: "Interact with your Asana projects, tasks, and teams. Create, update, and manage tasks in your Asana workspace.",
    githubUrl: "https://github.com/modelcontextprotocol/servers/tree/main/src/asana",
    websiteUrl: "https://asana.com"
  },
  {
    id: "twilio",
    name: "Twilio",
    logo: "https://cdn-icons-png.flaticon.com/512/5969/5969223.png",
    description: "Send SMS, make calls, and manage communications with Twilio. Automate customer engagement and notifications with AI assistance.",
    githubUrl: "https://github.com/modelcontextprotocol/servers/tree/main/src/twilio",
    websiteUrl: "https://twilio.com"
  },
  {
    id: "hubspot",
    name: "HubSpot",
    logo: "https://cdn-icons-png.flaticon.com/512/5968/5968872.png",
    description: "Manage your HubSpot CRM data, contacts, and marketing campaigns. Analyze customer information and automate marketing tasks with AI.",
    githubUrl: "https://github.com/modelcontextprotocol/servers/tree/main/src/hubspot",
    websiteUrl: "https://hubspot.com"
  }
];

// Using imported data from rules.ts file instead of hardcoded data

export default function MCPRulesPage() {
  const [isVisible, setIsVisible] = useState(false);
  const [activeTab, setActiveTab] = useState("mcp-servers");
  
  useEffect(() => {
    setIsVisible(true);
    
    // Check if there's a hash in the URL to determine which tab to show
    const hash = window.location.hash;
    
    if (hash.startsWith("#cursor-rules")) {
      setActiveTab("cursor-rules");
    } else if (hash.startsWith("#windsurf-rules")) {
      setActiveTab("windsurf-rules");
    }
    
    // Add event listener for hash changes
    const handleHashChange = () => {
      const newHash = window.location.hash;
      
      if (newHash.startsWith("#cursor-rules")) {
        setActiveTab("cursor-rules");
      } else if (newHash.startsWith("#windsurf-rules")) {
        setActiveTab("windsurf-rules");
      }
    };
    
    window.addEventListener("hashchange", handleHashChange);
    
    return () => {
      window.removeEventListener("hashchange", handleHashChange);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-slate-950"></div>
          <div className="absolute top-0 right-0 w-[1000px] h-[1000px] bg-indigo-600/10 rounded-full blur-[180px] -z-10 opacity-70"></div>
          <div className="absolute bottom-0 left-0 w-[800px] h-[800px] bg-purple-600/10 rounded-full blur-[150px] -z-10 opacity-70"></div>
        </div>
        
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto text-center"
          >
            <div className="inline-block mb-8 px-6 py-2 border border-indigo-500/30 rounded-full bg-indigo-500/15 backdrop-blur-sm">
              <span className="text-indigo-300 font-medium">SUPERCHARGE YOUR WORKFLOW</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold mb-8 leading-tight">
              <span className="bg-clip-text text-transparent gradient-animation-blue-indigo">MCP Servers</span> & <span className="bg-clip-text text-transparent gradient-animation-indigo-purple-pink">Cursor Rules</span> & <span className="bg-clip-text text-transparent gradient-animation-indigo-purple">Windsurf Rules</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-slate-300 mb-12 max-w-3xl mx-auto leading-relaxed">
              Access our curated collection of MCP servers and AI tool rules to dramatically improve your AI development workflow
            </p>
          </motion.div>
        </div>
      </section>
      
      {/* Tabs Section */}
      <section className="py-12">
        <div className="container mx-auto px-6">
          <Tabs 
            value={activeTab} 
            onValueChange={setActiveTab}
            className="max-w-6xl mx-auto"
          >
            <div className="flex justify-center mb-12">
              <TabsList className="bg-slate-800/70 border border-slate-700/50 backdrop-blur-md p-1">
                <TabsTrigger 
                  value="mcp-servers"
                  className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white text-slate-300 px-6 py-3"
                >
                  <Layers className="mr-2 h-5 w-5" />
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-400 data-[state=active]:text-white">MCP Servers</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="cursor-rules"
                  className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white text-slate-300 px-6 py-3"
                >
                  <Code className="mr-2 h-5 w-5" />
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400 data-[state=active]:text-white">Cursor Rules</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="windsurf-rules"
                  className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white text-slate-300 px-6 py-3"
                >
                  <Wind className="mr-2 h-5 w-5" />
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400 data-[state=active]:text-white">Windsurf Rules</span>
                </TabsTrigger>
              </TabsList>
            </div>
            
            <TabsContent value="mcp-servers" className="mt-0 focus-visible:outline-none focus-visible:ring-0">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8"
              >
                {mcpServers.map((server) => (
                  <a 
                    key={server.id}
                    href={`/mcp/${server.id}`}
                    className="bg-slate-800/50 backdrop-blur-md rounded-xl border border-slate-700/50 overflow-hidden hover:border-indigo-500/50 hover:shadow-lg hover:shadow-indigo-500/5 transition-all p-5 flex flex-col"
                  >
                    <div className="flex items-center gap-4 mb-5">
                      <div className="h-12 w-12 bg-slate-700/70 rounded-md flex items-center justify-center overflow-hidden">
                        <img src={server.logo} alt={server.name} className="h-8 w-8 object-contain" />
                      </div>
                      <div className="flex flex-col">
                        <h3 className="text-lg font-semibold bg-clip-text text-transparent bg-gradient-to-r from-white to-indigo-200">{server.name}</h3>
                        {server.githubUrl && (
                          <Badge className={server.githubUrl.includes("modelcontextprotocol/servers") ? 
                            "bg-indigo-600/70 text-indigo-100 text-[10px] font-normal" : 
                            "bg-emerald-600/70 text-emerald-100 text-[10px] font-normal"}>
                            {server.githubUrl.includes("modelcontextprotocol/servers") ? "Official" : "Community"}
                          </Badge>
                        )}
                      </div>
                    </div>
                    
                    <p className="text-slate-300 text-sm mb-auto line-clamp-3">{server.description}</p>
                    
                    <div className="flex items-center gap-3 mt-5">
                      {server.githubUrl && (
                        <a 
                          href={server.githubUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-xs bg-slate-700 hover:bg-slate-600 text-slate-300 py-1 px-2 rounded-md flex items-center gap-1 transition-colors"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
                          </svg>
                          GitHub
                        </a>
                      )}
                      
                      {server.websiteUrl && (
                        <a 
                          href={server.websiteUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-xs bg-slate-700 hover:bg-slate-600 text-slate-300 py-1 px-2 rounded-md flex items-center gap-1 transition-colors"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="10"></circle>
                            <line x1="2" y1="12" x2="22" y2="12"></line>
                            <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
                          </svg>
                          Website
                        </a>
                      )}
                    </div>
                    
                    <div className="flex items-center text-indigo-400 text-sm font-medium mt-4">
                      <span>View Installation Guide</span>
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </div>
                  </a>
                ))}
                
                <div className="bg-slate-800/30 backdrop-blur-md rounded-xl border border-dashed border-slate-700/50 overflow-hidden hover:border-indigo-500/50 transition-all p-6 flex flex-col items-center justify-center text-center">
                  <div className="h-14 w-14 bg-indigo-900/40 rounded-full flex items-center justify-center mb-5">
                    <Plus className="h-7 w-7 text-indigo-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-3">
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-indigo-400">Add Custom MCP</span>
                  </h3>
                  <p className="text-slate-300 text-sm mb-6">
                    Setup your own custom MCP server integration
                  </p>
                  
                  <Button variant="outline" className="bg-slate-800/50 border-slate-700 text-white hover:bg-slate-700">
                    Add Server
                  </Button>
                </div>
              </motion.div>
              
              <div className="mt-12 text-center">
                <a href="https://mcp.run" target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" className="bg-slate-800/50 border-slate-700 text-white px-6 py-3 h-auto hover:bg-slate-700 gap-2">
                  View All MCP Servers
                  <ArrowRight className="h-4 w-4" />
                </Button>
                </a>
                <div className="mt-4 text-slate-400 text-sm">
                  For more servers, check out the <a href="https://github.com/modelcontextprotocol/servers" target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:text-indigo-300">official GitHub repository</a>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="cursor-rules" className="mt-0 focus-visible:outline-none focus-visible:ring-0">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <CursorRules rules={cursorRules} />
                
                <div className="mt-10 text-center">
                  <a href="https://cursor.directory" target="_blank" rel="noopener noreferrer">
                    <Button variant="outline" className="bg-slate-800/50 border-slate-700 text-white px-4 py-2 hover:bg-slate-700 gap-2">
                      View All Cursor Rules
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </a>
                    </div>
              </motion.div>
            </TabsContent>
            
            <TabsContent value="windsurf-rules" className="mt-0 focus-visible:outline-none focus-visible:ring-0">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <div className="mb-10 bg-slate-800/50 backdrop-blur-md rounded-xl border border-slate-700/50 p-8">
                  <h2 className="text-2xl font-bold text-white mb-6">About Windsurf AI Editor</h2>
                  <p className="text-slate-300 mb-6 text-lg leading-relaxed max-w-5xl">
                    Windsurf AI Editor is a next-generation development environment that brings AI Flow to your coding workflow. 
                    With features like Cascade (your AI programming partner) and advanced context awareness, 
                    Windsurf empowers developers to build complex applications faster and more efficiently.
                  </p>
                  <div className="grid md:grid-cols-2 gap-8 mt-8">
                    <div className="bg-slate-800 border border-slate-700 rounded-lg p-6 hover:border-purple-500/30 transition-all">
                      <h3 className="text-xl font-semibold text-white mb-4">Key Features</h3>
                      <ul className="space-y-4 text-slate-300">
                        <li className="flex items-start gap-3">
                          <Check className="h-5 w-5 text-purple-400 mt-1 flex-shrink-0" />
                          <span>AI Flow for seamless developer-AI collaboration</span>
                        </li>
                        <li className="flex items-start gap-3">
                          <Check className="h-5 w-5 text-purple-400 mt-1 flex-shrink-0" />
                          <span>Cascade AI programming partner</span>
                        </li>
                        <li className="flex items-start gap-3">
                          <Check className="h-5 w-5 text-purple-400 mt-1 flex-shrink-0" />
                          <span>Memory Bank system for context retention</span>
                        </li>
                        <li className="flex items-start gap-3">
                          <Check className="h-5 w-5 text-purple-400 mt-1 flex-shrink-0" />
                          <span>Context-aware code suggestions</span>
                        </li>
                      </ul>
                    </div>
                    <div className="bg-slate-800 border border-slate-700 rounded-lg p-6 hover:border-purple-500/30 transition-all">
                      <h3 className="text-xl font-semibold text-white mb-4">Resources</h3>
                      <ul className="space-y-4 text-slate-300">
                        <li className="flex items-start gap-3">
                          <ArrowRight className="h-5 w-5 text-purple-400 mt-1 flex-shrink-0" />
                          <a href="https://www.windsurf.directory/" target="_blank" rel="noopener noreferrer" className="text-purple-400 hover:text-purple-300">
                            Windsurf AI Directory
                          </a>
                        </li>
                        <li className="flex items-start gap-3">
                          <ArrowRight className="h-5 w-5 text-purple-400 mt-1 flex-shrink-0" />
                          <a href="https://docs.codeium.com/windsurf/getting-started" target="_blank" rel="noopener noreferrer" className="text-purple-400 hover:text-purple-300">
                            Official Documentation
                          </a>
                        </li>
                        <li className="flex items-start gap-3">
                          <ArrowRight className="h-5 w-5 text-purple-400 mt-1 flex-shrink-0" />
                          <a href="https://codeium.com/windsurf" target="_blank" rel="noopener noreferrer" className="text-purple-400 hover:text-purple-300">
                            Windsurf Official Website
                          </a>
                        </li>
                        <li className="flex items-start gap-3">
                          <ArrowRight className="h-5 w-5 text-purple-400 mt-1 flex-shrink-0" />
                          <a href="https://www.youtube.com/watch?v=3xk2qG2QPdU" target="_blank" rel="noopener noreferrer" className="text-purple-400 hover:text-purple-300">
                            Video Tutorials
                          </a>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
                
                <div className="mb-10 bg-slate-800/50 backdrop-blur-md rounded-xl border border-slate-700/50 p-8">
                  <h2 className="text-2xl font-bold text-white mb-6">Windsurf AI Tutorials</h2>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <a href="https://www.windsurf.directory/posts/windsurf_getting_started" target="_blank" rel="noopener noreferrer" className="block bg-slate-800 border border-slate-700 rounded-lg p-5 hover:border-purple-500/50 transition-all">
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="text-lg font-semibold text-white">Getting Started</h3>
                        <Badge className="bg-green-600/80 text-white text-xs">beginner</Badge>
                      </div>
                      <p className="text-slate-300 text-sm">Introduction to Windsurf Editor, a next-gen AI-powered development environment</p>
                    </a>
                    <a href="https://www.windsurf.directory/posts/understanding_ai_flow" target="_blank" rel="noopener noreferrer" className="block bg-slate-800 border border-slate-700 rounded-lg p-5 hover:border-purple-500/50 transition-all">
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="text-lg font-semibold text-white">Understanding AI Flow</h3>
                        <Badge className="bg-yellow-600/80 text-white text-xs">intermediate</Badge>
                      </div>
                      <p className="text-slate-300 text-sm">Learn about AI Flow, the future of developer-AI collaboration</p>
                    </a>
                    <a href="https://www.windsurf.directory/posts/mastering_cascade" target="_blank" rel="noopener noreferrer" className="block bg-slate-800 border border-slate-700 rounded-lg p-5 hover:border-purple-500/50 transition-all">
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="text-lg font-semibold text-white">Mastering Cascade</h3>
                        <Badge className="bg-yellow-600/80 text-white text-xs">intermediate</Badge>
                      </div>
                      <p className="text-slate-300 text-sm">Master Cascade, your AI programming partner</p>
                    </a>
                  </div>
                </div>
                
                <WindsurfRules />
                
                <div className="mt-12 text-center">
                  <a href="https://windsurf.directory" target="_blank" rel="noopener noreferrer">
                    <Button variant="outline" className="bg-slate-800/50 border-slate-700 text-white px-6 py-3 h-auto hover:bg-slate-700 gap-2">
                      Explore Windsurf Directory
                      <ArrowRight className="h-4 w-4" />
                  </Button>
                  </a>
                </div>
              </motion.div>
            </TabsContent>
          </Tabs>
        </div>
      </section>
      
      {/* MCP Registry of Registries Section */}
      <section className="py-16 relative overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-b from-slate-900 to-indigo-950/40"></div>
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-[120px] -z-10 opacity-70"></div>
          <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[120px] -z-10 opacity-70"></div>
        </div>
        
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-400">MCP Registry</span> <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">of</span> <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">Registries</span>
            </h2>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto">
              Discover the most popular MCP registries across the ecosystem
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <a 
              href="https://github.com/modelcontextprotocol/servers" 
              target="_blank" 
              rel="noopener noreferrer"
              className="block"
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="bg-slate-800/50 backdrop-blur-md rounded-xl border border-slate-700/50 overflow-hidden p-6 hover:border-indigo-500/30 hover:shadow-lg hover:shadow-indigo-500/10 transition-all h-full"
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-white">
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-400">modelcontextprotocol/servers</span>
                  </h3>
                  <Badge className="bg-yellow-600/80 text-white">307 ★</Badge>
                </div>
                <p className="text-slate-300 mt-3 mb-4">This repository is a collection of reference implementations for the Model Context Protocol (MCP).</p>
                <Badge className="bg-blue-600/80 text-white mr-2">official</Badge>
              </motion.div>
            </a>

            <a 
              href="https://cline.bot/mcp-marketplace" 
              target="_blank" 
              rel="noopener noreferrer"
              className="block"
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
                transition={{ duration: 0.6, delay: 0.25 }}
                className="bg-slate-800/50 backdrop-blur-md rounded-xl border border-slate-700/50 overflow-hidden p-6 hover:border-indigo-500/30 hover:shadow-lg hover:shadow-indigo-500/10 transition-all h-full"
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-white">
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-400">Cline.bot</span>
                  </h3>
                  <Badge className="bg-purple-600/80 text-white">1.2M+ installs</Badge>
                </div>
                <p className="text-slate-300 mt-3 mb-4">MCP servers for Cline.bot with a wide variety of integrations and capabilities.</p>
                <Badge className="bg-indigo-600/80 text-white mr-2">verified</Badge>
              </motion.div>
            </a>

            <a 
              href="https://github.com/punkpeye/awesome-mcp-servers" 
              target="_blank" 
              rel="noopener noreferrer"
              className="block"
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="bg-slate-800/50 backdrop-blur-md rounded-xl border border-slate-700/50 overflow-hidden p-6 hover:border-indigo-500/30 hover:shadow-lg hover:shadow-indigo-500/10 transition-all h-full"
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-white">
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-400">Awesome MCP servers</span>
                  </h3>
                  <Badge className="bg-yellow-600/80 text-white">370 ★</Badge>
                </div>
                <p className="text-slate-300 mt-3 mb-4">A curated list of awesome Model Context Protocol (MCP) servers.</p>
                <Badge className="bg-green-600/80 text-white mr-2">open-source</Badge>
              </motion.div>
            </a>

            <a 
              href="https://cursor.directory/mcp" 
              target="_blank" 
              rel="noopener noreferrer"
              className="block"
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="bg-slate-800/50 backdrop-blur-md rounded-xl border border-slate-700/50 overflow-hidden p-6 hover:border-indigo-500/30 hover:shadow-lg hover:shadow-indigo-500/10 transition-all h-full"
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-white">
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-400">Cursor MCP Registry</span>
                  </h3>
                  <Badge className="bg-purple-600/80 text-white">1800+ ★</Badge>
                </div>
                <p className="text-slate-300 mt-3 mb-4">Browse MCPs or post a MCP to reach 250,000+ monthly active developers.</p>
                <Badge className="bg-indigo-600/80 text-white mr-2">verified</Badge>
              </motion.div>
            </a>

            <a 
              href="https://glama.ai/mcp/servers" 
              target="_blank" 
              rel="noopener noreferrer"
              className="block"
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="bg-slate-800/50 backdrop-blur-md rounded-xl border border-slate-700/50 overflow-hidden p-6 hover:border-indigo-500/30 hover:shadow-lg hover:shadow-indigo-500/10 transition-all h-full"
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-white">
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-400">Glama MCP Server</span>
                  </h3>
                  <Badge className="bg-purple-600/80 text-white">3457 ★</Badge>
                </div>
                <p className="text-slate-300 mt-3 mb-4">Production-ready and experimental MCP servers that extend AI capabilities.</p>
                <Badge className="bg-green-600/80 text-white mr-2">open-source</Badge>
              </motion.div>
            </a>

            <a 
              href="https://mcpmarket.com/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="block"
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="bg-slate-800/50 backdrop-blur-md rounded-xl border border-slate-700/50 overflow-hidden p-6 hover:border-indigo-500/30 hover:shadow-lg hover:shadow-indigo-500/10 transition-all h-full"
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-white">
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-400">MCP Market</span>
                  </h3>
                  <Badge className="bg-purple-600/80 text-white">12454 ★</Badge>
                </div>
                <p className="text-slate-300 mt-3 mb-4">Explore our curated collection of MCP servers to connect AI to your favorite tools.</p>
              </motion.div>
            </a>

            <a 
              href="https://mcp.so" 
              target="_blank" 
              rel="noopener noreferrer"
              className="block"
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
                transition={{ duration: 0.6, delay: 0.7 }}
                className="bg-slate-800/50 backdrop-blur-md rounded-xl border border-slate-700/50 overflow-hidden p-6 hover:border-indigo-500/30 hover:shadow-lg hover:shadow-indigo-500/10 transition-all h-full"
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-white">
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-400">MCP.so</span>
                  </h3>
                  <Badge className="bg-purple-600/80 text-white">7682 ★</Badge>
                </div>
                <p className="text-slate-300 mt-3 mb-4">Find Awesome MCP Servers and Clients</p>
                <Badge className="bg-indigo-600/80 text-white mr-2">verified</Badge>
              </motion.div>
            </a>

            <a 
              href="https://opentools.ai" 
              target="_blank" 
              rel="noopener noreferrer"
              className="block"
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
                transition={{ duration: 0.6, delay: 0.8 }}
                className="bg-slate-800/50 backdrop-blur-md rounded-xl border border-slate-700/50 overflow-hidden p-6 hover:border-indigo-500/30 hover:shadow-lg hover:shadow-indigo-500/10 transition-all h-full"
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-white">
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-400">OpenTools</span>
                  </h3>
                  <Badge className="bg-yellow-600/80 text-white">171 ★</Badge>
                </div>
                <p className="text-slate-300 mt-3 mb-4">This registry documents the capabilities of 400+ tools across 160+ MCP servers.</p>
                <Badge className="bg-indigo-600/80 text-white mr-2">verified</Badge>
              </motion.div>
            </a>

            <a 
              href="https://pulsemcp.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="block"
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
                transition={{ duration: 0.6, delay: 0.9 }}
                className="bg-slate-800/50 backdrop-blur-md rounded-xl border border-slate-700/50 overflow-hidden p-6 hover:border-indigo-500/30 hover:shadow-lg hover:shadow-indigo-500/10 transition-all h-full"
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-white">
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-400">Pulse MCP</span>
                  </h3>
                  <Badge className="bg-purple-600/80 text-white">3653 ★</Badge>
                </div>
                <p className="text-slate-300 mt-3 mb-4">Browse and discover MCP use cases, servers, clients, and news.</p>
                <Badge className="bg-indigo-600/80 text-white mr-2">verified</Badge>
              </motion.div>
            </a>

            <a 
              href="https://smithery.dev" 
              target="_blank" 
              rel="noopener noreferrer"
              className="block"
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
                transition={{ duration: 0.6, delay: 1 }}
                className="bg-slate-800/50 backdrop-blur-md rounded-xl border border-slate-700/50 overflow-hidden p-6 hover:border-indigo-500/30 hover:shadow-lg hover:shadow-indigo-500/10 transition-all h-full"
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-white">
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-400">Smithery</span>
                  </h3>
                  <Badge className="bg-purple-600/80 text-white">2208 ★</Badge>
                </div>
                <p className="text-slate-300 mt-3 mb-4">Extend your agent with 4,274 capabilities via Model Context Protocol servers.</p>
                <Badge className="bg-indigo-600/80 text-white mr-2">verified</Badge>
              </motion.div>
            </a>
            <a 
              href="https://mcp.run" 
              target="_blank" 
              rel="noopener noreferrer"
              className="block"
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
                transition={{ duration: 0.6, delay: 1.05 }}
                className="bg-slate-800/50 backdrop-blur-md rounded-xl border border-slate-700/50 overflow-hidden p-6 hover:border-indigo-500/30 hover:shadow-lg hover:shadow-indigo-500/10 transition-all h-full"
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-white">
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-400">MCP.run</span>
                  </h3>
                  <Badge className="bg-yellow-600/80 text-white">150+ ★</Badge>
                </div>
                <p className="text-slate-300 mt-3 mb-4">Deploy and manage MCP servers with one command using Docker containers.</p>
                <Badge className="bg-indigo-600/80 text-white mr-2">verified</Badge>
              </motion.div>
            </a>
            <a 
              href="https://composio.dev/mcp" 
              target="_blank" 
              rel="noopener noreferrer"
              className="block"
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
                transition={{ duration: 0.6, delay: 1.1 }}
                className="bg-slate-800/50 backdrop-blur-md rounded-xl border border-slate-700/50 overflow-hidden p-6 hover:border-indigo-500/30 hover:shadow-lg hover:shadow-indigo-500/10 transition-all h-full"
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-white">
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-400">MCP Composio</span>
                  </h3>
                  <Badge className="bg-yellow-600/80 text-white">100+ ★</Badge>
                </div>
                <p className="text-slate-300 mt-3 mb-4">Instantly Connect to 100+ Managed MCP Servers with Built-In Auth</p>
                <Badge className="bg-indigo-600/80 text-white mr-2">verified</Badge>
              </motion.div>
            </a>
            
            <a 
              href="https://github.com/mcpget/mcpget" 
              target="_blank" 
              rel="noopener noreferrer"
              className="block"
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
                transition={{ duration: 0.6, delay: 1.2 }}
                className="bg-slate-800/50 backdrop-blur-md rounded-xl border border-slate-700/50 overflow-hidden p-6 hover:border-indigo-500/30 hover:shadow-lg hover:shadow-indigo-500/10 transition-all h-full"
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-white">
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-400">MCP-Get</span>
                  </h3>
                  <Badge className="bg-yellow-600/80 text-white">69 ★</Badge>
                </div>
                <p className="text-slate-300 mt-3 mb-4">mcp-get helps you easily install protocol servers.</p>
                <Badge className="bg-green-600/80 text-white mr-2">open-source</Badge>
              </motion.div>
            </a>
          </div>
          
          <div className="mt-12 text-center">
            <Button variant="outline" className="bg-slate-800/50 border-slate-700 text-white px-6 py-3 h-auto hover:bg-slate-700 gap-2">
              View More MCP Registries
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>
      
      {/* Integration Benefits Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-b from-slate-900 to-indigo-950/40"></div>
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-[120px] -z-10 opacity-70"></div>
          <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[120px] -z-10 opacity-70"></div>
        </div>
        
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-400">Enhance Your</span> <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">AI Development</span> <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">Workflow</span>
              </h2>
              <p className="text-xl text-slate-300 max-w-3xl mx-auto">
                Seamlessly integrate AI tools and services with our unified approach
              </p>
            </motion.div>
            
            <div className="grid md:grid-cols-1 lg:grid-cols-3 gap-8 xl:gap-10">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: isVisible ? 1 : 0, x: isVisible ? 0 : -20 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="bg-slate-800/50 backdrop-blur-md rounded-xl border border-slate-700/50 overflow-hidden p-8 hover:border-indigo-500/30 hover:shadow-lg hover:shadow-indigo-500/10 transition-all"
              >
                <div className="h-16 w-16 bg-indigo-900/40 rounded-full flex items-center justify-center mb-6">
                  <Layers className="h-8 w-8 text-indigo-400" />
                </div>
                
                <h3 className="text-2xl font-bold text-white mb-4">
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-400">MCP Servers</span>
                </h3>
                
                <ul className="space-y-5 mb-8">
                  <li className="flex items-start gap-4">
                    <Check className="h-5 w-5 text-indigo-400 mt-1 flex-shrink-0" />
                    <p className="text-slate-300"><span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-200 to-indigo-200 font-semibold">Seamlessly integrate</span> with over 35+ services and APIs</p>
                  </li>
                  <li className="flex items-start gap-4">
                    <Check className="h-5 w-5 text-indigo-400 mt-1 flex-shrink-0" />
                    <p className="text-slate-300"><span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-200 to-indigo-200 font-semibold">Reduce development time</span> with pre-configured connections</p>
                  </li>
                  <li className="flex items-start gap-4">
                    <Check className="h-5 w-5 text-indigo-400 mt-1 flex-shrink-0" />
                    <p className="text-slate-300"><span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-200 to-indigo-200 font-semibold">Enhanced security</span> with isolated API connections</p>
                  </li>
                  <li className="flex items-start gap-4">
                    <Check className="h-5 w-5 text-indigo-400 mt-1 flex-shrink-0" />
                    <p className="text-slate-300"><span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-200 to-indigo-200 font-semibold">Deploy and scale</span> services with confidence</p>
                  </li>
                </ul>
                
                <Button className="bg-indigo-600 hover:bg-indigo-700 text-white w-full h-12 text-base font-medium" onClick={() => setActiveTab("mcp-servers")}>
                  Browse MCP Servers
                </Button>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="bg-slate-800/50 backdrop-blur-md rounded-xl border border-slate-700/50 overflow-hidden p-8 hover:border-indigo-500/30 hover:shadow-lg hover:shadow-indigo-500/10 transition-all"
              >
                <div className="h-16 w-16 bg-indigo-900/40 rounded-full flex items-center justify-center mb-6">
                  <Code className="h-8 w-8 text-indigo-400" />
                </div>
                
                <h3 className="text-2xl font-bold text-white mb-4">
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">Cursor Rules</span>
                </h3>
                
                <ul className="space-y-5 mb-8">
                  <li className="flex items-start gap-4">
                    <Check className="h-5 w-5 text-indigo-400 mt-1 flex-shrink-0" />
                    <p className="text-slate-300"><span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-200 to-purple-200 font-semibold">Optimize your AI coding</span> experience with custom rules</p>
                  </li>
                  <li className="flex items-start gap-4">
                    <Check className="h-5 w-5 text-indigo-400 mt-1 flex-shrink-0" />
                    <p className="text-slate-300"><span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-200 to-purple-200 font-semibold">Framework-specific rule sets</span> for better suggestions</p>
                  </li>
                  <li className="flex items-start gap-4">
                    <Check className="h-5 w-5 text-indigo-400 mt-1 flex-shrink-0" />
                    <p className="text-slate-300"><span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-200 to-purple-200 font-semibold">Shared rules library</span> from expert developers</p>
                  </li>
                  <li className="flex items-start gap-4">
                    <Check className="h-5 w-5 text-indigo-400 mt-1 flex-shrink-0" />
                    <p className="text-slate-300"><span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-200 to-purple-200 font-semibold">Exclusive CreateMVP</span> Windsurf integration rules</p>
                  </li>
                </ul>
                
                <Button className="bg-indigo-600 hover:bg-indigo-700 text-white w-full h-12 text-base font-medium" onClick={() => setActiveTab("cursor-rules")}>
                  Explore Cursor Rules
                </Button>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: isVisible ? 1 : 0, x: isVisible ? 0 : 20 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="bg-slate-800/50 backdrop-blur-md rounded-xl border border-slate-700/50 overflow-hidden p-8 hover:border-purple-500/30 hover:shadow-lg hover:shadow-purple-500/10 transition-all"
              >
                <div className="h-16 w-16 bg-purple-900/40 rounded-full flex items-center justify-center mb-6">
                  <Wind className="h-8 w-8 text-purple-400" />
                </div>
                
                <h3 className="text-2xl font-bold text-white mb-4">
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">Windsurf Rules</span>
                </h3>
                
                <ul className="space-y-5 mb-8">
                  <li className="flex items-start gap-4">
                    <Check className="h-5 w-5 text-purple-400 mt-1 flex-shrink-0" />
                    <p className="text-slate-300"><span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-200 to-pink-200 font-semibold">AI-powered documentation</span> for improved project organization</p>
                  </li>
                  <li className="flex items-start gap-4">
                    <Check className="h-5 w-5 text-purple-400 mt-1 flex-shrink-0" />
                    <p className="text-slate-300"><span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-200 to-pink-200 font-semibold">Context-aware coding</span> with intelligent memory management</p>
                  </li>
                  <li className="flex items-start gap-4">
                    <Check className="h-5 w-5 text-purple-400 mt-1 flex-shrink-0" />
                    <p className="text-slate-300"><span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-200 to-pink-200 font-semibold">Enhanced collaboration</span> with AI Flow and Cascade features</p>
                  </li>
                  <li className="flex items-start gap-4">
                    <Check className="h-5 w-5 text-purple-400 mt-1 flex-shrink-0" />
                    <p className="text-slate-300"><span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-200 to-pink-200 font-semibold">Structured learning paths</span> for mastering AI-assisted development</p>
                  </li>
                </ul>
                
                <Button className="bg-purple-600 hover:bg-purple-700 text-white w-full h-12 text-base font-medium" onClick={() => setActiveTab("windsurf-rules")}>
                  Explore Windsurf Rules
                </Button>
              </motion.div>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-24 border-t border-slate-800 relative overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-b from-slate-900 to-indigo-950/40"></div>
          <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-indigo-600/10 rounded-full blur-[150px] -z-10 opacity-70"></div>
          <div className="absolute bottom-0 left-0 w-[800px] h-[800px] bg-purple-600/10 rounded-full blur-[150px] -z-10 opacity-70"></div>
        </div>
        
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-center"
            >
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
                <span className="bg-clip-text text-transparent gradient-animation-cyan-blue">Ready to</span> <span className="bg-clip-text text-transparent gradient-animation-blue-indigo">supercharge</span> <span className="bg-clip-text text-transparent gradient-animation-indigo-purple">your development?</span>
              </h2>
              <p className="text-xl md:text-2xl text-slate-300 mb-12 max-w-3xl mx-auto leading-relaxed">
                Start using our MCP servers and Cursor rules today to build better MVPs faster
              </p>
              
              <div className="flex flex-wrap gap-6 justify-center">
                <a href="https://mcp.run" target="_blank" rel="noopener noreferrer">
                  <Button className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-6 h-auto text-lg font-medium shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/30 transition-all">
                    Explore MCP Servers
                  </Button>
                </a>
                <a href="https://cursor.directory" target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" className="bg-slate-800/50 border-slate-700 text-white px-8 py-6 h-auto text-lg hover:bg-slate-800 hover:border-slate-600 transition-all">
                    Visit Cursor Directory
                </Button>
                </a>
                <a href="https://windsurf.directory" target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" className="bg-slate-800/50 border-slate-700 text-white px-8 py-6 h-auto text-lg hover:bg-slate-800 hover:border-slate-600 transition-all">
                    Visit Windsurf Directory
                </Button>
                </a>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Added CSS styles for gradient animations */}
      <style>{`
        @keyframes gradientBlueIndigo {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        
        @keyframes gradientIndigoPurplePink {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        
        @keyframes gradientCyanBlue {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        
        @keyframes gradientIndigoPurple {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        
        .gradient-animation-blue-indigo {
          background: linear-gradient(135deg, #3b82f6, #4f46e5, #3b82f6);
          background-size: 200% 200%;
          animation: gradientBlueIndigo 6s ease infinite;
          -webkit-background-clip: text;
        }
        
        .gradient-animation-indigo-purple-pink {
          background: linear-gradient(135deg, #4f46e5, #a855f7, #ec4899, #a855f7, #4f46e5);
          background-size: 200% 200%;
          animation: gradientIndigoPurplePink 8s ease infinite;
          -webkit-background-clip: text;
        }
        
        .gradient-animation-cyan-blue {
          background: linear-gradient(135deg, #22d3ee, #3b82f6, #22d3ee);
          background-size: 200% 200%;
          animation: gradientCyanBlue 6s ease infinite;
          -webkit-background-clip: text;
        }
        
        .gradient-animation-indigo-purple {
          background: linear-gradient(135deg, #4f46e5, #a855f7, #4f46e5);
          background-size: 200% 200%;
          animation: gradientIndigoPurple 6s ease infinite;
          -webkit-background-clip: text;
        }
      `}</style>
    </div>
  );
} 