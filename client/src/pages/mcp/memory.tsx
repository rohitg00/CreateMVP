import { MCPTemplate } from "./template";

export default function MemoryMCPPage() {
  const dockerConfig = `{
  "mcpServers": {
    "memory": {
      "command": "docker",
      "args": [
        "run",
        "-i",
        "--rm",
        "mcp/memory"
      ]
    }
  }
}`;

  const npxConfig = `{
  "mcpServers": {
    "memory": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-memory"
      ]
    }
  }
}`;

  const features = [
    "Store and retrieve conversation history between users and AI assistants",
    "Save user preferences and settings for AI interactions",
    "Maintain context across multiple sessions",
    "Create conversation summaries for improved context",
    "Support memory management with CRUD operations"
  ];

  return (
    <MCPTemplate
      id="memory"
      name="Memory"
      description="Store and retrieve conversation history and user preferences"
      logo="https://storage.googleapis.com/cursor-logo-prod/mcp-memory.png"
      dockerConfig={dockerConfig}
      npxConfig={npxConfig}
      apiKeyName={null}
      features={features}
    />
  );
} 