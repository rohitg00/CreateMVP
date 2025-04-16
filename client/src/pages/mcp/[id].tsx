import { useEffect, useState } from 'react';
import { useParams, useLocation } from 'wouter';
import { MCPTemplate } from './template';
import { mcpServers } from '@/pages/mcp-rules';
import { Loader2 } from 'lucide-react';

export default function GenericMCPPage() {
  const [, setLocation] = useLocation();
  const params = useParams<{ id: string }>();
  const [isLoading, setIsLoading] = useState(true);
  const [server, setServer] = useState<any>(null);

  useEffect(() => {
    // Find the server with the matching ID
    const serverData = mcpServers.find(s => s.id === params.id);
    
    if (serverData) {
      setServer(serverData);
    } else {
      // Redirect to MCP servers page if server not found
      setLocation('/mcp-rules');
    }
    
    setIsLoading(false);
  }, [params.id, setLocation]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 flex items-center justify-center">
        <Loader2 className="h-8 w-8 text-indigo-500 animate-spin" />
      </div>
    );
  }

  if (!server) {
    return null;
  }

  // Default configs that can be customized per server if needed
  const dockerConfig = `{
  "mcpServers": {
    "${server.id}": {
      "command": "docker",
      "args": [
        "run",
        "-i",
        "--rm",
        "mcp/${server.id}"
      ]
    }
  }
}`;

  const npxConfig = `{
  "mcpServers": {
    "${server.id}": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-${server.id}"
      ]
    }
  }
}`;

  // Extract features from description for feature tab
  const features = server.description
    .split('.')
    .filter(Boolean)
    .map(s => s.trim())
    .filter(s => s.length > 10);

  return (
    <MCPTemplate
      id={server.id}
      name={server.name}
      description={server.description}
      logo={server.logo}
      dockerConfig={dockerConfig}
      npxConfig={npxConfig}
      apiKeyName="API Key"
      features={features}
    />
  );
} 