import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import HomePage from "@/pages/index";
import ChatPage from "@/pages/chat";
import GeneratePage from "@/pages/generate";
import ContactPage from "@/pages/contact";
import ToolComparisonPage from "@/pages/tool-comparison";
import MCPRulesPage from "@/pages/mcp-rules";
import GenericMCPPage from "@/pages/mcp/[id]";
import Layout from "@/components/Layout";
import Navbar from "@/components/Navbar";
import TestComponent from "@/components/TestComponent";
import CursorRuleDetailPage from "@/pages/cursor-rules/[id]";
import WindsurfRuleDetailPage from "@/pages/windsurf-rules/[id]";

function Router() {
  return (
    <Switch>
      <Route path="/" component={HomePage} />
      <Route path="/chat" component={ChatPage} />
      <Route path="/tool-comparison" component={ToolComparisonPage} />
      <Route path="/mcp-rules" component={MCPRulesPage} />
      <Route path="/cursor-rules/:id" component={CursorRuleDetailPage} />
      <Route path="/windsurf-rules/:id" component={WindsurfRuleDetailPage} />
      <Route path="/mcp/:id" component={GenericMCPPage} />
      <Route path="/generate" component={GeneratePage} />
      <Route path="/contact" component={ContactPage} />
      <Route path="/test" component={TestComponent} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Layout>
          <Navbar />
          <Router />
        </Layout>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;