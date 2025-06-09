import { Switch, Route, Redirect, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";


import { UserProvider } from "./lib/userContext";
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


import DashboardPage from "@/pages/dashboard";
import ProtectedRoute from "@/components/ProtectedRoute";
import CursorRuleDetailPage from "@/pages/cursor-rules/[id]";
import WindsurfRulesPage from "@/pages/windsurf-rules";
import WindsurfRuleDetailPage from "@/pages/windsurf-rules/[id]";
import PricingPage from "@/pages/pricing";

function Router() {
  return (
    <Switch>
      <Route path="/" component={HomePage} />
      <Route path="/chat" component={ChatPage} />
      <Route path="/tool-comparison" component={ToolComparisonPage} />
      <Route path="/mcp-rules" component={MCPRulesPage} />
      <Route path="/pricing" component={PricingPage} />
      <Route path="/cursor-rules/:id" component={CursorRuleDetailPage} />
      <Route path="/windsurf-rules">
        {() => <Redirect to="/mcp-rules#windsurf-rules" />}
      </Route>
      <Route path="/windsurf-rules/:id" component={WindsurfRuleDetailPage} />
      <Route path="/mcp/:id" component={GenericMCPPage} />
      <Route path="/generate" component={GeneratePage} />
      <Route path="/dashboard" component={DashboardPage} />
      <Route path="/contact" component={ContactPage} />
      <Route path="/test" component={TestComponent} />


      <Route component={NotFound} />
    </Switch>
  );
}



function App() {


  return (
    <QueryClientProvider client={queryClient}>
      <UserProvider>
        <TooltipProvider>
          <Layout>
            <Navbar />
            <Router />
          </Layout>
          <Toaster />
        </TooltipProvider>
      </UserProvider>
    </QueryClientProvider>
  );
}

export default App;
