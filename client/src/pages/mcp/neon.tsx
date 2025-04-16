import { MCPTemplate } from "./template";

export default function NeonMCPPage() {
  const dockerConfig = `{
  "mcpServers": {
    "neon": {
      "command": "docker",
      "args": [
        "run",
        "-i",
        "--rm",
        "-e",
        "NEON_API_KEY=YOUR_API_KEY",
        "mcp/neon"
      ]
    }
  }
}`;

  const npxConfig = `{
  "mcpServers": {
    "neon": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-neon"
      ],
      "env": {
        "NEON_API_KEY": "YOUR_API_KEY"
      }
    }
  }
}`;

  const apiKeyInstructions = (
    <>
      <p className="text-slate-300 mb-4">
        To use the Neon MCP server, you need to create an API key:
      </p>
      <ol className="list-decimal list-inside space-y-2 text-slate-300 mb-4">
        <li>Sign in to your <a href="https://console.neon.tech/" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">Neon dashboard</a></li>
        <li>Navigate to Developer Settings → API Keys</li>
        <li>Click "Generate new API key"</li>
        <li>Give your key a name and select appropriate scopes (at minimum, you'll need read access to projects)</li>
        <li>Copy the generated API key</li>
        <li>Replace "YOUR_API_KEY" in the configuration with your actual API key</li>
      </ol>
      <div className="bg-slate-900 p-4 rounded-md text-slate-300 mb-4">
        <p className="font-medium mb-2">Neon Features:</p>
        <p className="mb-2">• <span className="font-medium">Serverless PostgreSQL</span>: On-demand scaling with auto-suspend</p>
        <p className="mb-2">• <span className="font-medium">Branching</span>: Create instant database copies for development and testing</p>
        <p>• <span className="font-medium">Connection pooling</span>: Efficiently manage database connections</p>
      </div>
      <div className="bg-amber-900/30 border border-amber-700/50 p-4 rounded-md text-amber-200 mb-4">
        <p className="font-medium">⚠️ Security Warning</p>
        <p>Never share your API key or commit it to public repositories. Consider using environment variables for secure key management.</p>
      </div>
    </>
  );

  const features = [
    "Manage your Neon PostgreSQL projects and databases",
    "Create and configure database branches",
    "Monitor database performance and resource usage",
    "Adjust compute and storage resources as needed",
    "View connection information for databases",
    "Run operations on your serverless PostgreSQL instances"
  ];

  return (
    <MCPTemplate
      id="neon"
      name="Neon"
      description="Interact with the Neon serverless Postgres platform"
      logo="https://cdn.brandfetch.io/idbcV39y9k/theme/light/logo.svg"
      dockerConfig={dockerConfig}
      npxConfig={npxConfig}
      apiKeyName="NEON_API_KEY"
      apiKeyInstructions={apiKeyInstructions}
      features={features}
    />
  );
} 