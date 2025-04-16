import { MCPTemplate } from "./template";

export default function VercelMCPPage() {
  const dockerConfig = `{
  "mcpServers": {
    "vercel": {
      "command": "docker",
      "args": [
        "run",
        "-i",
        "--rm",
        "-e",
        "VERCEL_TOKEN=YOUR_VERCEL_TOKEN",
        "mcp/vercel"
      ]
    }
  }
}`;

  const npxConfig = `{
  "mcpServers": {
    "vercel": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-vercel"
      ],
      "env": {
        "VERCEL_TOKEN": "YOUR_VERCEL_TOKEN"
      }
    }
  }
}`;

  const apiKeyInstructions = (
    <>
      <p className="text-slate-300 mb-4">
        To use the Vercel MCP server, you need to create a Vercel access token:
      </p>
      <ol className="list-decimal list-inside space-y-2 text-slate-300 mb-4">
        <li>Log in to your <a href="https://vercel.com/account/tokens" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">Vercel dashboard</a></li>
        <li>Navigate to Settings → Tokens</li>
        <li>Click "Create" to generate a new token</li>
        <li>Give your token a descriptive name (e.g., "MCP Integration")</li>
        <li>Set an appropriate expiration date (or "No expiration" if needed)</li>
        <li>Select the scope of access you want to grant</li>
        <li>Copy the generated token</li>
        <li>Replace "YOUR_VERCEL_TOKEN" in the configuration with your token</li>
      </ol>
      <div className="bg-slate-900 p-4 rounded-md text-slate-300 mb-4">
        <p className="font-medium mb-2">Token Scopes:</p>
        <p className="mb-2">• <span className="font-medium">Read-only scope</span>: Safe for querying projects, deployments, and logs</p>
        <p>• <span className="font-medium">Full access scope</span>: Needed for creating deployments or modifying projects</p>
      </div>
      <div className="bg-amber-900/30 border border-amber-700/50 p-4 rounded-md text-amber-200 mb-4">
        <p className="font-medium">⚠️ Security Warning</p>
        <p>Never share your token or commit it to public repositories. Consider using environment variables for secure token management.</p>
      </div>
    </>
  );

  const features = [
    "Manage Vercel projects and deployments",
    "Retrieve deployment logs and status information",
    "Create new deployments directly from Cursor",
    "Configure environment variables and project settings",
    "Monitor serverless function performance"
  ];

  return (
    <MCPTemplate
      id="vercel"
      name="Vercel"
      description="Integrate with Vercel's serverless infrastructure"
      logo="https://cdn.brandfetch.io/idDpCfN4VD/theme/light/symbol.svg"
      dockerConfig={dockerConfig}
      npxConfig={npxConfig}
      apiKeyName="VERCEL_TOKEN"
      apiKeyInstructions={apiKeyInstructions}
      features={features}
    />
  );
} 