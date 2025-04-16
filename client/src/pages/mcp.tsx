import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { MapIcon } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { Link, useSearchParams } from "react-router-dom";
import { useHover } from "usehooks-ts";
import Layout from "../components/Layout";
import { ServerCard } from "../components/ServerCard";
import { Tab } from "../components/Tab";
import { MobileView } from "../components/MobileView";
import { Wind } from "lucide-react";
import { useContext } from "react";
import { AppContext } from "../App";
import { Badge } from "../components/ui/badge";

export default function MCP() {
  const { state } = useContext(AppContext);

  const [searchParams, setSearchParams] = useSearchParams();
  const initialTab = searchParams.get("tab") || "mcp-servers";

  const [activeTab, setActiveTab] = useState(initialTab);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    setSearchParams({ tab: value });
  };

  // Layout variables for better responsiveness
  const headerClasses = "mb-4 sm:mb-6 md:mb-8";
  const mainTitleClasses = "font-bold tracking-tight text-balance mb-2 sm:mb-3 md:mb-4";
  const subtitleClasses = "text-slate-300 mb-4 sm:mb-6 text-pretty max-w-3xl";
  const containerClasses = "container-fluid py-responsive";
  const tabsContainerClasses = "my-6 sm:my-8 md:my-10";
  const cardGridClasses = "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6";

  return (
    <Layout>
      <div className={containerClasses}>
        <div className={headerClasses}>
          <h1 className={mainTitleClasses}>
            Model Context Protocol <Badge variant="outline" className="ml-2">Beta</Badge>
          </h1>
          <p className={subtitleClasses}>
            Use AI to search the web, access content on your computer, use
            external tools, and make API calls while staying in the flow in your
            editor.
          </p>
        </div>
        
        <div className={tabsContainerClasses}>
          <Tabs
            defaultValue="mcp-servers"
            value={activeTab}
            onValueChange={handleTabChange}
            className="w-full"
          >
            <div className="border-b border-slate-700 mb-4 pb-1 overflow-x-auto scrollbar-hide">
              <TabsList className="flex bg-transparent space-x-4 pb-1">
                <TabsTrigger
                  value="mcp-servers"
                  className="px-3 py-2 data-[state=active]:bg-slate-800 data-[state=active]:text-white rounded-t-md text-sm sm:text-base"
                >
                  MCP Servers
                </TabsTrigger>
                <TabsTrigger
                  value="cursor-rules"
                  className="px-3 py-2 data-[state=active]:bg-slate-800 data-[state=active]:text-white rounded-t-md text-sm sm:text-base"
                >
                  Cursor Rules
                </TabsTrigger>
                <TabsTrigger
                  value="windsurf-rules"
                  className="px-3 py-2 data-[state=active]:bg-slate-800 data-[state=active]:text-white rounded-t-md text-sm sm:text-base"
                >
                  Windsurf Rules
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="mcp-servers" className="mt-0">
              <div className="mb-6 sm:mb-8 md:mb-10">
                <h2 className="text-2xl font-bold mb-2 sm:mb-4">Model Context Protocol Servers</h2>
                <p className="text-slate-300 text-pretty mb-4 max-w-3xl">
                  MCP is a protocol for AI assistants to be given access to
                  external tools. Learn more about MCP in the{" "}
                  <a
                    href="https://github.com/AnthropicLabs/anthropic-cookbook/blob/main/model_context_protocol/MCP.md"
                    target="_blank"
                    className="text-indigo-400 hover:text-indigo-300"
                  >
                    Anthropic Cookbook
                  </a>
                  .
                </p>
              </div>

              <div className={cardGridClasses}>
                {state?.mcpServers?.map((d, i) => (
                  <div key={i} className="h-full">
                    <Link
                      to={`/mcp/${d.route}`}
                      className="h-full block transition-transform hover:scale-[1.02]"
                    >
                      <MobileView
                        name={d.name}
                        icon={d.icon}
                        description={d.description}
                        url={`/mcp/${d.route}`}
                        type="server"
                      />
                    </Link>
                  </div>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="cursor-rules" className="mt-0">
              <div className="mb-6 sm:mb-8 md:mb-10">
                <h2 className="text-2xl font-bold mb-2 sm:mb-4">Cursor Rules</h2>
                <p className="text-slate-300 text-pretty mb-4 max-w-3xl">
                  Cursor Rules let you create AI-powered, context-aware scripts that
                  can interact with your editor. They are a powerful way to automate
                  repetitive tasks and extend your editor with custom workflows.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 place-items-start">
                {state?.cursorRules?.map((d, i) => (
                  <div key={i} className="h-full w-full">
                    <Link
                      to={`/cursor-rules/${d.route}`}
                      className="h-full block transition-transform hover:scale-[1.02]"
                    >
                      <MobileView
                        name={d.name}
                        icon={<MapIcon className="h-6 w-6 text-indigo-400" />}
                        description={d.description}
                        url={`/cursor-rules/${d.route}`}
                        type="rule"
                      />
                    </Link>
                  </div>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="windsurf-rules" className="mt-0">
              <div className="mb-6 sm:mb-8 md:mb-10">
                <h2 className="text-2xl font-bold mb-2 sm:mb-4">Windsurf Rules</h2>
                <p className="text-slate-300 text-pretty mb-4 max-w-3xl">
                  Windsurf rules enhance your browsing and productivity with AI-powered macros.
                  Create dynamic rules that respond to your actions and provide instant assistance
                  within your browser.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 place-items-start">
                {state?.windsurfRules?.map((d, i) => (
                  <div key={i} className="h-full w-full">
                    <Link
                      to={`/windsurf-rules/${d.route}`}
                      className="h-full block transition-transform hover:scale-[1.02]"
                    >
                      <MobileView
                        name={d.name}
                        icon={<Wind className="h-6 w-6 text-purple-400" />}
                        description={d.description}
                        url={`/windsurf-rules/${d.route}`}
                        type="rule"
                      />
                    </Link>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
        
        <div className="relative mt-6 sm:mt-10 md:mt-16 p-6 sm:p-8 md:p-10 rounded-xl bg-gradient-to-r from-slate-800/50 to-slate-800/30 border border-slate-700/50 overflow-hidden">
          <div className="relative z-10">
            <h3 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-4">
              Want to build your own MCP server or rules?
            </h3>
            <p className="text-slate-300 mb-4 max-w-3xl text-pretty">
              Check out the repositories below to get started with building your own
              MCP servers or creating custom rules.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 mt-6">
              <a
                href="https://github.com/AnthropicLabs/anthropic-cookbook/blob/main/model_context_protocol/MCP.md"
                target="_blank"
                className="inline-flex items-center justify-center px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-colors text-sm sm:text-base"
              >
                MCP Documentation
              </a>
              <a
                href="https://github.com/anthropics/anthropic-tools"
                target="_blank"
                className="inline-flex items-center justify-center px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-colors text-sm sm:text-base"
              >
                Anthropic Tools
              </a>
              <a
                href="https://github.com/getcursor/cursor"
                target="_blank"
                className="inline-flex items-center justify-center px-4 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-white transition-colors text-sm sm:text-base"
              >
                Cursor on GitHub
              </a>
            </div>
          </div>
          
          {/* Background decoration */}
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5"></div>
          <div className="hidden sm:block absolute -bottom-20 -right-20 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl"></div>
          <div className="hidden sm:block absolute top-10 -left-20 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl"></div>
        </div>
      </div>
    </Layout>
  );
} 