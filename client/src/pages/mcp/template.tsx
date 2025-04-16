import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Terminal, Code, Copy, Check, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";

type MCPTemplateProps = {
  id: string;
  name: string;
  description: string;
  logo: string;
  dockerConfig: string;
  npxConfig: string;
  apiKeyName?: string;
  apiKeyInstructions?: JSX.Element;
  features?: string[];
  additionalInstallation?: JSX.Element;
};

export function MCPTemplate(props: MCPTemplateProps) {
  const {
    id,
    name,
    description,
    logo,
    dockerConfig,
    npxConfig,
    apiKeyName,
    apiKeyInstructions,
    features = [],
    additionalInstallation
  } = props;

  const [isVisible, setIsVisible] = useState(false);
  const [activeTab, setActiveTab] = useState("installation");
  const [copied, setCopied] = useState(false);
  
  useEffect(() => {
    setIsVisible(true);
  }, []);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

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
          <div className="mb-8">
            <Link href="/mcp-rules" className="inline-flex items-center text-indigo-400 hover:text-indigo-300 transition-colors">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to MCP Servers
            </Link>
          </div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto"
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="h-16 w-16 bg-slate-800 rounded-xl flex items-center justify-center overflow-hidden">
                <img 
                  src={logo}
                  alt={name} 
                  className="h-10 w-10"
                />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-white">{name} MCP Server</h1>
                <p className="text-slate-300">{description}</p>
              </div>
            </div>
            
            <div className="bg-slate-800/50 backdrop-blur-md rounded-xl border border-slate-700/50 p-6 mb-8">
              <p className="text-slate-300">
                This server provides integration with {name} through MCP, allowing LLMs to interact with your {name} account. With this server, AI assistants can help you manage your {name.toLowerCase()} resources directly from Cursor.
              </p>
            </div>
          </motion.div>
        </div>
      </section>
      
      {/* Tabs Section */}
      <section className="py-8">
        <div className="container mx-auto px-6">
          <Tabs 
            value={activeTab} 
            onValueChange={setActiveTab}
            className="max-w-4xl mx-auto"
          >
            <div className="flex justify-center mb-8">
              <TabsList className="bg-slate-800/70 border border-slate-700/50 backdrop-blur-md">
                <TabsTrigger 
                  value="installation"
                  className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white text-slate-300"
                >
                  <Terminal className="mr-2 h-5 w-5" />
                  Installation
                </TabsTrigger>
                <TabsTrigger 
                  value="usage"
                  className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white text-slate-300"
                >
                  <Code className="mr-2 h-5 w-5" />
                  Usage
                </TabsTrigger>
                {features.length > 0 && (
                  <TabsTrigger 
                    value="features"
                    className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white text-slate-300"
                  >
                    <ExternalLink className="mr-2 h-5 w-5" />
                    Features
                  </TabsTrigger>
                )}
              </TabsList>
            </div>
            
            <TabsContent value="installation" className="mt-0 focus-visible:outline-none focus-visible:ring-0">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="space-y-8"
              >
                <div className="bg-slate-800/50 backdrop-blur-md rounded-xl border border-slate-700/50 p-6">
                  <h3 className="text-xl font-semibold text-white mb-4">What is MCP?</h3>
                  <p className="text-slate-300 mb-4">
                    Model Context Protocol (MCP) is an open protocol that allows you to provide custom tools to agentic LLMs (Large Language Models) in Cursor's Composer feature.
                  </p>
                  <p className="text-slate-300">
                    MCP servers enable AI models to interact with external services and APIs, extending their capabilities beyond just generating text.
                  </p>
                </div>
                
                {apiKeyName && (
                  <div className="bg-slate-800/50 backdrop-blur-md rounded-xl border border-slate-700/50 p-6">
                    <h3 className="text-xl font-semibold text-white mb-4">{apiKeyName}</h3>
                    {apiKeyInstructions || (
                      <p className="text-slate-300 mb-4">
                        Before installing the {name} MCP server, you'll need to create an API key for authentication.
                      </p>
                    )}
                    <div className="bg-yellow-900/30 border border-yellow-700/30 rounded-md p-4 text-yellow-200 text-sm">
                      <strong>Important:</strong> Keep your API key secure and never share it publicly. API keys provide access to your account and should be treated like passwords.
                    </div>
                  </div>
                )}
                
                <div className="bg-slate-800/50 backdrop-blur-md rounded-xl border border-slate-700/50 p-6">
                  <h3 className="text-xl font-semibold text-white mb-4">Installation Steps</h3>
                  <ol className="list-decimal list-inside space-y-2 text-slate-300 mb-6">
                    <li>Open Cursor Settings</li>
                    <li>Navigate to Cursor Settings &gt; Features &gt; MCP</li>
                    <li>Click the "+ Add New MCP Server" button</li>
                  </ol>
                  
                  <h4 className="text-lg font-medium text-white mb-3">Configure the Server</h4>
                  <p className="text-slate-300 mb-4">
                    You can use either Docker or NPX to run the {name} MCP server. Choose the method that works best for your environment.
                  </p>
                  
                  <div className="space-y-6">
                    <div>
                      <h5 className="text-md font-medium text-white mb-2">Docker Configuration</h5>
                      <div className="relative">
                        <pre className="bg-slate-900 p-4 rounded-md text-slate-300 overflow-x-auto">{dockerConfig}</pre>
                        <button 
                          onClick={() => copyToClipboard(dockerConfig)}
                          className="absolute top-2 right-2 p-2 bg-slate-800 rounded-md hover:bg-slate-700 transition-colors"
                        >
                          {copied ? <Check className="h-4 w-4 text-green-400" /> : <Copy className="h-4 w-4 text-slate-400" />}
                        </button>
                      </div>
                    </div>
                    
                    <div>
                      <h5 className="text-md font-medium text-white mb-2">NPX Configuration</h5>
                      <div className="relative">
                        <pre className="bg-slate-900 p-4 rounded-md text-slate-300 overflow-x-auto">{npxConfig}</pre>
                        <button 
                          onClick={() => copyToClipboard(npxConfig)}
                          className="absolute top-2 right-2 p-2 bg-slate-800 rounded-md hover:bg-slate-700 transition-colors"
                        >
                          {copied ? <Check className="h-4 w-4 text-green-400" /> : <Copy className="h-4 w-4 text-slate-400" />}
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6">
                    {apiKeyName && (
                      <p className="text-slate-300 mb-4">
                        Replace <code className="bg-slate-700 px-1 py-0.5 rounded">&lt;YOUR_API_KEY&gt;</code> with your {apiKeyName}.
                      </p>
                    )}
                    <p className="text-slate-300">
                      After adding the server, it will appear in your MCP servers list. You may need to click the refresh button to populate the tool list.
                    </p>
                  </div>
                  
                  {/* Render additional installation instructions if provided */}
                  {additionalInstallation}
                </div>
              </motion.div>
            </TabsContent>
            
            <TabsContent value="usage" className="mt-0 focus-visible:outline-none focus-visible:ring-0">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="space-y-8"
              >
                <div className="bg-slate-800/50 backdrop-blur-md rounded-xl border border-slate-700/50 p-6">
                  <h3 className="text-xl font-semibold text-white mb-4">Using MCP Tools</h3>
                  <p className="text-slate-300 mb-4">
                    After installing the {name} MCP server, you can use its tools in Cursor's Composer feature. Here's how:
                  </p>
                  
                  <h4 className="text-lg font-medium text-white mb-3">Tool Availability</h4>
                  <ul className="list-disc list-inside space-y-2 text-slate-300 mb-6">
                    <li>The {name} MCP server provides various tools for interacting with {name}</li>
                    <li>These tools are automatically available to the Composer Agent</li>
                    <li>You may need to click the refresh button in the MCP settings to populate the tool list</li>
                  </ul>
                  
                  <h4 className="text-lg font-medium text-white mb-3">Using Tools in Composer</h4>
                  <p className="text-slate-300 mb-4">
                    The Composer Agent automatically uses MCP tools when relevant. You can explicitly prompt tool usage by:
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-slate-300 mb-6">
                    <li>Referring to the tool by name (e.g., "Use {name} to...")</li>
                    <li>Describing the tool's function (e.g., "I need to access my {name.toLowerCase()} account")</li>
                  </ul>
                  
                  <h4 className="text-lg font-medium text-white mb-3">Example Prompts</h4>
                  <div className="bg-slate-900 p-4 rounded-md text-slate-300 mb-6">
                    <p className="mb-2">• "Check my {name} account for recent activity"</p>
                    <p className="mb-2">• "Can you help me use {name} to accomplish [specific task]?"</p>
                    <p>• "I need to update my {name.toLowerCase()} settings"</p>
                  </div>
                </div>
              </motion.div>
            </TabsContent>
            
            {features.length > 0 && (
              <TabsContent value="features" className="mt-0 focus-visible:outline-none focus-visible:ring-0">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="space-y-8"
                >
                  <div className="bg-slate-800/50 backdrop-blur-md rounded-xl border border-slate-700/50 p-6">
                    <h3 className="text-xl font-semibold text-white mb-4">Key Features</h3>
                    <ul className="space-y-4">
                      {features.map((feature, index) => (
                        <li key={index} className="flex items-start">
                          <div className="mr-4 mt-1 h-5 w-5 bg-indigo-500/20 rounded-full flex items-center justify-center">
                            <Check className="h-3 w-3 text-indigo-400" />
                          </div>
                          <p className="text-slate-300">{feature}</p>
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              </TabsContent>
            )}
          </Tabs>
        </div>
      </section>
    </div>
  );
} 