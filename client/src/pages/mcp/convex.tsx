import { MCPTemplate } from "./template";

export default function ConvexMCPPage() {
  const dockerConfig = `{
  "mcpServers": {
    "convex": {
      "command": "docker",
      "args": [
        "run",
        "-i",
        "--rm",
        "-e",
        "CONVEX_DEPLOYMENT=YOUR_DEPLOYMENT_URL",
        "-e",
        "CONVEX_API_KEY=YOUR_API_KEY",
        "mcp/convex"
      ]
    }
  }
}`;

  const npxConfig = `{
  "mcpServers": {
    "convex": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-convex"
      ],
      "env": {
        "CONVEX_DEPLOYMENT": "YOUR_DEPLOYMENT_URL",
        "CONVEX_API_KEY": "YOUR_API_KEY"
      }
    }
  }
}`;

  const apiKeyInstructions = (
    <>
      <p className="text-slate-300 mb-4">
        To use the Convex MCP server, you need to configure your Convex deployment:
      </p>
      <ol className="list-decimal list-inside space-y-2 text-slate-300 mb-4">
        <li>Sign up or log in to your <a href="https://dashboard.convex.dev" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">Convex dashboard</a></li>
        <li>Select your project or create a new one</li>
        <li>Go to Settings → API Keys</li>
        <li>Copy your deployment URL (looks like "https://example-xxx-yyy.convex.cloud")</li>
        <li>Generate an API key with appropriate permissions</li>
        <li>Replace "YOUR_DEPLOYMENT_URL" with your Convex deployment URL</li>
        <li>Replace "YOUR_API_KEY" with your generated API key</li>
      </ol>
      <div className="bg-slate-900 p-4 rounded-md text-slate-300 mb-4">
        <p className="font-medium mb-2">Key Concepts:</p>
        <p className="mb-2">• <span className="font-medium">Functions</span>: Query, mutation, and action functions define your backend logic</p>
        <p className="mb-2">• <span className="font-medium">Tables</span>: Document-based database tables store your application data</p>
        <p>• <span className="font-medium">Schema</span>: TypeScript schema defines your data model</p>
      </div>
      <div className="bg-amber-900/30 border border-amber-700/50 p-4 rounded-md text-amber-200 mb-4">
        <p className="font-medium">⚠️ Security Warning</p>
        <p>Never share your API key or commit it to public repositories. Consider using environment variables for secure key management.</p>
      </div>
    </>
  );

  const features = [
    "Interact with Convex backend functions (queries, mutations, actions)",
    "Read and write data to Convex tables",
    "Execute database queries and analyze results",
    "Manage application data and state",
    "Integrate with your frontend application",
    "Develop Convex functions with AI assistance"
  ];

  return (
    <MCPTemplate
      id="convex"
      name="Convex"
      description="Reactive backend for JavaScript applications"
      logo="https://cdn.brandfetch.io/ideaDHlcLg/theme/dark/logo.svg"
      dockerConfig={dockerConfig}
      npxConfig={npxConfig}
      apiKeyName="CONVEX_DEPLOYMENT and CONVEX_API_KEY"
      apiKeyInstructions={apiKeyInstructions}
      features={features}
    />
  );
} 