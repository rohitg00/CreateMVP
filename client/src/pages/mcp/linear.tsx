import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Terminal, Code, Copy, Check, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";

export default function LinearMCPPage() {
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

  const dockerConfig = `{
  "mcpServers": {
    "linear": {
      "command": "docker",
      "args": [
        "run",
        "-i",
        "--rm",
        "-e",
        "LINEAR_API_KEY",
        "mcp/linear"
      ],
      "env": {
        "LINEAR_API_KEY": "<YOUR_API_KEY>"
      }
    }
  }
}`;

  const npxConfig = `{
  "mcpServers": {
    "linear": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-linear"
      ],
      "env": {
        "LINEAR_API_KEY": "<YOUR_API_KEY>"
      }
    }
  }
}`;

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
                  src="https://cdn.brandfetch.io/iduDa181eM/theme/light/symbol.svg" 
                  alt="Linear" 
                  className="h-10 w-10"
                />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-white">Linear MCP Server</h1>
                <p className="text-slate-300">Integration with Linear's issue tracking system through MCP</p>
              </div>
            </div>
            
            <div className="bg-slate-800/50 backdrop-blur-md rounded-xl border border-slate-700/50 p-6 mb-8">
              <p className="text-slate-300">
                This server provides integration with Linear's issue tracking system through MCP, allowing LLMs to interact with Linear issues. With this server, you can manage tasks, sprints, and projects directly from Cursor.
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
                
                <div className="bg-slate-800/50 backdrop-blur-md rounded-xl border border-slate-700/50 p-6">
                  <h3 className="text-xl font-semibold text-white mb-4">Linear API Key</h3>
                  <p className="text-slate-300 mb-4">
                    Before installing the Linear MCP server, you'll need to create a Linear API Key:
                  </p>
                  <ol className="list-decimal list-inside space-y-2 text-slate-300 mb-4">
                    <li>Log in to your Linear account</li>
                    <li>Go to Settings &gt; API</li>
                    <li>Click "Create Key"</li>
                    <li>Give your key a name (e.g., "Cursor MCP")</li>
                    <li>Copy the generated API key</li>
                  </ol>
                  <div className="bg-yellow-900/30 border border-yellow-700/30 rounded-md p-4 text-yellow-200 text-sm">
                    <strong>Important:</strong> Keep your API key secure and never share it publicly. Linear API keys provide access to your workspace and should be treated like passwords.
                  </div>
                </div>
                
                <div className="bg-slate-800/50 backdrop-blur-md rounded-xl border border-slate-700/50 p-6">
                  <h3 className="text-xl font-semibold text-white mb-4">Installation Steps</h3>
                  <ol className="list-decimal list-inside space-y-2 text-slate-300 mb-6">
                    <li>Open Cursor Settings</li>
                    <li>Navigate to Cursor Settings &gt; Features &gt; MCP</li>
                    <li>Click the "+ Add New MCP Server" button</li>
                  </ol>
                  
                  <h4 className="text-lg font-medium text-white mb-3">Configure the Server</h4>
                  <p className="text-slate-300 mb-4">
                    You can use either Docker or NPX to run the Linear MCP server. Choose the method that works best for your environment.
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
                    <p className="text-slate-300 mb-4">
                      Replace <code className="bg-slate-700 px-1 py-0.5 rounded">&lt;YOUR_API_KEY&gt;</code> with your Linear API Key.
                    </p>
                    <p className="text-slate-300">
                      After adding the server, it will appear in your MCP servers list. You may need to click the refresh button to populate the tool list.
                    </p>
                  </div>
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
                    After installing the Linear MCP server, you can use its tools in Cursor's Composer feature. Here's how:
                  </p>
                  
                  <h4 className="text-lg font-medium text-white mb-3">Tool Availability</h4>
                  <ul className="list-disc list-inside space-y-2 text-slate-300 mb-6">
                    <li>The Linear MCP server provides various tools for interacting with Linear</li>
                    <li>These tools are automatically available to the Composer Agent</li>
                    <li>You may need to click the refresh button in the MCP settings to populate the tool list</li>
                  </ul>
                  
                  <h4 className="text-lg font-medium text-white mb-3">Using Tools in Composer</h4>
                  <p className="text-slate-300 mb-4">
                    The Composer Agent automatically uses MCP tools when relevant. You can explicitly prompt tool usage by:
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-slate-300 mb-6">
                    <li>Referring to the tool by name (e.g., "Create a new Linear issue")</li>
                    <li>Describing the tool's function (e.g., "Add a task to my Linear project")</li>
                  </ul>
                  
                  <h4 className="text-lg font-medium text-white mb-3">Tool Execution Process</h4>
                  <ol className="list-decimal list-inside space-y-2 text-slate-300">
                    <li>The agent will display a message in chat requesting approval</li>
                    <li>It will show the tool call arguments (expandable)</li>
                    <li>The tool executes upon your approval</li>
                    <li>The tool's response appears in the chat</li>
                  </ol>
                </div>
                
                <div className="bg-slate-800/50 backdrop-blur-md rounded-xl border border-slate-700/50 p-6">
                  <h3 className="text-xl font-semibold text-white mb-4">Example Prompts</h3>
                  <p className="text-slate-300 mb-4">
                    Here are some example prompts you can use with the Linear MCP server:
                  </p>
                  
                  <div className="space-y-4">
                    <div className="bg-slate-900/70 p-4 rounded-md">
                      <p className="text-white font-medium mb-2">Issue Management</p>
                      <p className="text-slate-300">"Create a new issue in Linear about the login bug we discussed"</p>
                    </div>
                    
                    <div className="bg-slate-900/70 p-4 rounded-md">
                      <p className="text-white font-medium mb-2">Task Assignment</p>
                      <p className="text-slate-300">"Assign the frontend tasks to Sarah and backend tasks to John"</p>
                    </div>
                    
                    <div className="bg-slate-900/70 p-4 rounded-md">
                      <p className="text-white font-medium mb-2">Project Management</p>
                      <p className="text-slate-300">"Show me all the high priority issues in the current sprint"</p>
                    </div>
                    
                    <div className="bg-slate-900/70 p-4 rounded-md">
                      <p className="text-white font-medium mb-2">Status Updates</p>
                      <p className="text-slate-300">"Update the status of issue LIN-123 to 'In Progress'"</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-slate-800/50 backdrop-blur-md rounded-xl border border-slate-700/50 p-6">
                  <h3 className="text-xl font-semibold text-white mb-4">Additional Resources</h3>
                  <div className="space-y-4">
                    <a 
                      href="https://github.com/jerhadf/linear-mcp-server" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center justify-between bg-slate-900/50 p-4 rounded-md hover:bg-slate-900/80 transition-colors"
                    >
                      <div className="flex items-center">
                        <ExternalLink className="h-5 w-5 mr-3 text-indigo-400" />
                        <span className="text-white">Model Context Protocol Servers</span>
                      </div>
                      <ExternalLink className="h-4 w-4 text-slate-400" />
                    </a>
                    
                    <a 
                      href="https://linear.app/docs/api" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center justify-between bg-slate-900/50 p-4 rounded-md hover:bg-slate-900/80 transition-colors"
                    >
                      <div className="flex items-center">
                        <ExternalLink className="h-5 w-5 mr-3 text-indigo-400" />
                        <span className="text-white">Linear API Documentation</span>
                      </div>
                      <ExternalLink className="h-4 w-4 text-slate-400" />
                    </a>
                    
                    <a 
                      href="https://cursor.sh/docs/mcp" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center justify-between bg-slate-900/50 p-4 rounded-md hover:bg-slate-900/80 transition-colors"
                    >
                      <div className="flex items-center">
                        <Code className="h-5 w-5 mr-3 text-indigo-400" />
                        <span className="text-white">Cursor MCP Documentation</span>
                      </div>
                      <ExternalLink className="h-4 w-4 text-slate-400" />
                    </a>
                  </div>
                </div>
              </motion.div>
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </div>
  );
} 