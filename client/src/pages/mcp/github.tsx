import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Github, Terminal, Code, Copy, Check, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";

export default function GithubMCPPage() {
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
    "github": {
      "command": "docker",
      "args": [
        "run",
        "-i",
        "--rm",
        "-e",
        "GITHUB_PERSONAL_ACCESS_TOKEN",
        "mcp/github"
      ],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "<YOUR_TOKEN>"
      }
    }
  }
}`;

  const npxConfig = `{
  "mcpServers": {
    "github": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-github"
      ],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "<YOUR_TOKEN>"
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
                  src="https://cdn.brandfetch.io/idZAyF9rlg/theme/light/symbol.svg" 
                  alt="GitHub" 
                  className="h-10 w-10"
                />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-white">GitHub MCP Server</h1>
                <p className="text-slate-300">Integration with GitHub's API through MCP</p>
              </div>
            </div>
            
            <div className="bg-slate-800/50 backdrop-blur-md rounded-xl border border-slate-700/50 p-6 mb-8">
              <p className="text-slate-300">
                This server provides integration with GitHub's API through MCP, allowing LLMs to interact with repositories, issues, pull requests, and more. With this server, you can perform operations like creating or updating files, searching code, managing issues, and working with pull requests directly from Cursor.
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
                <TabsTrigger 
                  value="features"
                  className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white text-slate-300"
                >
                  <Github className="mr-2 h-5 w-5" />
                  Features
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
                  <h3 className="text-xl font-semibold text-white mb-4">GitHub Personal Access Token</h3>
                  <p className="text-slate-300 mb-4">
                    Before installing the GitHub MCP server, you'll need to create a GitHub Personal Access Token with appropriate permissions:
                  </p>
                  <ol className="list-decimal list-inside space-y-2 text-slate-300 mb-4">
                    <li>Go to <a href="https://github.com/settings/tokens" target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:text-indigo-300">Personal access tokens</a> (in GitHub Settings &gt; Developer settings)</li>
                    <li>Select which repositories you'd like this token to have access to (Public, All, or Select)</li>
                    <li>Create a token with the <code className="bg-slate-700 px-1 py-0.5 rounded">repo</code> scope ("Full control of private repositories")</li>
                    <li>Alternatively, if working only with public repositories, select only the <code className="bg-slate-700 px-1 py-0.5 rounded">public_repo</code> scope</li>
                    <li>Copy the generated token</li>
                  </ol>
                  <div className="bg-yellow-900/30 border border-yellow-700/30 rounded-md p-4 text-yellow-200 text-sm">
                    <strong>Important:</strong> Keep your token secure and never share it publicly. GitHub tokens provide access to your repositories and should be treated like passwords.
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
                    You can use either Docker or NPX to run the GitHub MCP server. Choose the method that works best for your environment.
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
                      Replace <code className="bg-slate-700 px-1 py-0.5 rounded">&lt;YOUR_TOKEN&gt;</code> with your GitHub Personal Access Token.
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
                    After installing the GitHub MCP server, you can use its tools in Cursor's Composer feature. Here's how:
                  </p>
                  
                  <h4 className="text-lg font-medium text-white mb-3">Tool Availability</h4>
                  <ul className="list-disc list-inside space-y-2 text-slate-300 mb-6">
                    <li>The GitHub MCP server provides various tools for interacting with GitHub</li>
                    <li>These tools are automatically available to the Composer Agent</li>
                    <li>You may need to click the refresh button in the MCP settings to populate the tool list</li>
                  </ul>
                  
                  <h4 className="text-lg font-medium text-white mb-3">Using Tools in Composer</h4>
                  <p className="text-slate-300 mb-4">
                    The Composer Agent automatically uses MCP tools when relevant. You can explicitly prompt tool usage by:
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-slate-300 mb-6">
                    <li>Referring to the tool by name (e.g., "Create a new GitHub issue")</li>
                    <li>Describing the tool's function (e.g., "Search for code in my GitHub repository")</li>
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
                    Here are some example prompts you can use with the GitHub MCP server:
                  </p>
                  
                  <div className="space-y-4">
                    <div className="bg-slate-900/70 p-4 rounded-md">
                      <p className="text-white font-medium mb-2">File Operations</p>
                      <p className="text-slate-300">"Create a new file called README.md in my repository with a project description"</p>
                    </div>
                    
                    <div className="bg-slate-900/70 p-4 rounded-md">
                      <p className="text-white font-medium mb-2">Issue Management</p>
                      <p className="text-slate-300">"Create a new issue in my repository about a bug I found in the login functionality"</p>
                    </div>
                    
                    <div className="bg-slate-900/70 p-4 rounded-md">
                      <p className="text-white font-medium mb-2">Code Search</p>
                      <p className="text-slate-300">"Search for all instances of 'useEffect' in my React components"</p>
                    </div>
                    
                    <div className="bg-slate-900/70 p-4 rounded-md">
                      <p className="text-white font-medium mb-2">Pull Request Management</p>
                      <p className="text-slate-300">"Show me the details of pull request #42 in my repository"</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </TabsContent>
            
            <TabsContent value="features" className="mt-0 focus-visible:outline-none focus-visible:ring-0">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="space-y-8"
              >
                <div className="bg-slate-800/50 backdrop-blur-md rounded-xl border border-slate-700/50 p-6">
                  <h3 className="text-xl font-semibold text-white mb-4">Key Features</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-slate-900/50 p-4 rounded-md">
                      <h4 className="text-lg font-medium text-white mb-2">Automatic Branch Creation</h4>
                      <p className="text-slate-300">When creating/updating files or pushing changes, branches are automatically created if they don't exist</p>
                    </div>
                    
                    <div className="bg-slate-900/50 p-4 rounded-md">
                      <h4 className="text-lg font-medium text-white mb-2">Comprehensive Error Handling</h4>
                      <p className="text-slate-300">Clear error messages for common issues to help troubleshoot problems</p>
                    </div>
                    
                    <div className="bg-slate-900/50 p-4 rounded-md">
                      <h4 className="text-lg font-medium text-white mb-2">Git History Preservation</h4>
                      <p className="text-slate-300">Operations maintain proper Git history without force pushing</p>
                    </div>
                    
                    <div className="bg-slate-900/50 p-4 rounded-md">
                      <h4 className="text-lg font-medium text-white mb-2">Batch Operations</h4>
                      <p className="text-slate-300">Support for both single-file and multi-file operations</p>
                    </div>
                    
                    <div className="bg-slate-900/50 p-4 rounded-md">
                      <h4 className="text-lg font-medium text-white mb-2">Advanced Search</h4>
                      <p className="text-slate-300">Support for searching code, issues/PRs, and users</p>
                    </div>
                    
                    <div className="bg-slate-900/50 p-4 rounded-md">
                      <h4 className="text-lg font-medium text-white mb-2">Pull Request Management</h4>
                      <p className="text-slate-300">Create, review, and merge pull requests directly from Cursor</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-slate-800/50 backdrop-blur-md rounded-xl border border-slate-700/50 p-6">
                  <h3 className="text-xl font-semibold text-white mb-4">Available Tools</h3>
                  <p className="text-slate-300 mb-4">
                    The GitHub MCP server provides the following tools:
                  </p>
                  
                  <div className="space-y-4">
                    <div className="border-b border-slate-700/50 pb-4">
                      <h4 className="text-lg font-medium text-white mb-2">File Operations</h4>
                      <ul className="list-disc list-inside space-y-2 text-slate-300">
                        <li><code className="bg-slate-700 px-1 py-0.5 rounded">create_or_update_file</code>: Create or update a single file in a repository</li>
                        <li><code className="bg-slate-700 px-1 py-0.5 rounded">push_files</code>: Push multiple files in a single commit</li>
                        <li><code className="bg-slate-700 px-1 py-0.5 rounded">get_file_contents</code>: Get contents of a file or directory</li>
                      </ul>
                    </div>
                    
                    <div className="border-b border-slate-700/50 pb-4">
                      <h4 className="text-lg font-medium text-white mb-2">Repository Management</h4>
                      <ul className="list-disc list-inside space-y-2 text-slate-300">
                        <li><code className="bg-slate-700 px-1 py-0.5 rounded">search_repositories</code>: Search for GitHub repositories</li>
                        <li><code className="bg-slate-700 px-1 py-0.5 rounded">create_repository</code>: Create a new GitHub repository</li>
                        <li><code className="bg-slate-700 px-1 py-0.5 rounded">list_commits</code>: Gets commits of a branch in a repository</li>
                      </ul>
                    </div>
                    
                    <div className="border-b border-slate-700/50 pb-4">
                      <h4 className="text-lg font-medium text-white mb-2">Issue Management</h4>
                      <ul className="list-disc list-inside space-y-2 text-slate-300">
                        <li><code className="bg-slate-700 px-1 py-0.5 rounded">create_issue</code>: Create a new issue</li>
                        <li><code className="bg-slate-700 px-1 py-0.5 rounded">get_issue</code>: Gets the contents of an issue within a repository</li>
                        <li><code className="bg-slate-700 px-1 py-0.5 rounded">list_issues</code>: List issues in a repository</li>
                        <li><code className="bg-slate-700 px-1 py-0.5 rounded">create_issue_comment</code>: Add a comment to an issue</li>
                      </ul>
                    </div>
                    
                    <div className="border-b border-slate-700/50 pb-4">
                      <h4 className="text-lg font-medium text-white mb-2">Pull Request Management</h4>
                      <ul className="list-disc list-inside space-y-2 text-slate-300">
                        <li><code className="bg-slate-700 px-1 py-0.5 rounded">get_pull_request</code>: Get details of a specific pull request</li>
                        <li><code className="bg-slate-700 px-1 py-0.5 rounded">list_pull_requests</code>: List and filter repository pull requests</li>
                        <li><code className="bg-slate-700 px-1 py-0.5 rounded">create_pull_request_review</code>: Create a review on a pull request</li>
                        <li><code className="bg-slate-700 px-1 py-0.5 rounded">merge_pull_request</code>: Merge a pull request</li>
                        <li><code className="bg-slate-700 px-1 py-0.5 rounded">get_pull_request_files</code>: Get the list of files changed in a pull request</li>
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="text-lg font-medium text-white mb-2">Search</h4>
                      <ul className="list-disc list-inside space-y-2 text-slate-300">
                        <li><code className="bg-slate-700 px-1 py-0.5 rounded">search_code</code>: Search for code across GitHub repositories</li>
                        <li><code className="bg-slate-700 px-1 py-0.5 rounded">search_issues</code>: Search for issues and pull requests</li>
                        <li><code className="bg-slate-700 px-1 py-0.5 rounded">search_users</code>: Search for GitHub users</li>
                      </ul>
                    </div>
                  </div>
                </div>
                
                <div className="bg-slate-800/50 backdrop-blur-md rounded-xl border border-slate-700/50 p-6">
                  <h3 className="text-xl font-semibold text-white mb-4">Additional Resources</h3>
                  <div className="space-y-4">
                    <a 
                      href="https://github.com/modelcontextprotocol/servers/tree/main/src/github" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center justify-between bg-slate-900/50 p-4 rounded-md hover:bg-slate-900/80 transition-colors"
                    >
                      <div className="flex items-center">
                        <Github className="h-5 w-5 mr-3 text-indigo-400" />
                        <span className="text-white">GitHub MCP Server Repository</span>
                      </div>
                      <ExternalLink className="h-4 w-4 text-slate-400" />
                    </a>
                    
                    <a 
                      href="https://github.com/modelcontextprotocol/servers" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center justify-between bg-slate-900/50 p-4 rounded-md hover:bg-slate-900/80 transition-colors"
                    >
                      <div className="flex items-center">
                        <Github className="h-5 w-5 mr-3 text-indigo-400" />
                        <span className="text-white">Model Context Protocol Servers</span>
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