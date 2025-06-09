import { MCPTemplate } from "./template";

export default function LemonSqueezyMCPPage() {
  const dockerConfig = `{
  "mcpServers": {
    "lemonsqueezy": {
      "command": "docker",
      "args": [
        "run",
        "-i",
        "--rm",
        "-e",
        "LEMONSQUEEZY_API_KEY=YOUR_API_KEY",
        "mcp/lemonsqueezy"
      ]
    }
  }
}`;

  const npxConfig = `{
  "mcpServers": {
    "lemonsqueezy": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-lemonsqueezy"
      ],
      "env": {
        "LEMONSQUEEZY_API_KEY": "YOUR_API_KEY"
      }
    }
  }
}`;

  const apiKeyInstructions = (
    <>
      <p className="text-slate-300 mb-4">
        To use the Lemon Squeezy MCP server, you need to create an API key:
      </p>
      <ol className="list-decimal list-inside space-y-2 text-slate-300 mb-4">
        <li>Log in to your <a href="https://app.lemonsqueezy.com/settings/api" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">Lemon Squeezy account</a></li>
        <li>Go to Settings → API</li>
        <li>Click on "Create API key"</li>
        <li>Give your key a name (e.g., "MCP Integration")</li>
        <li>Copy the generated API key</li>
        <li>Replace "YOUR_API_KEY" in the configuration with your API key</li>
      </ol>
      <div className="bg-amber-900/30 border border-amber-700/50 p-4 rounded-md text-amber-200 mb-4">
        <p className="font-medium">⚠️ Security Warning</p>
        <p>Never share your API key or commit it to public repositories. Consider using environment variables for secure key management.</p>
      </div>
    </>
  );

  const features = [
    "Retrieve product data from your Lemon Squeezy store",
    "Get customer information and purchase history",
    "Access orders and invoice data",
    "Monitor sales and revenue analytics"
  ];

  return (
    <MCPTemplate
      id="lemonsqueezy"
      name="Lemon Squeezy"
      description="Access e-commerce and customer data from your Lemon Squeezy store"
      logo="https://cdn.brandfetch.io/JIjH6gq9hf/theme/light/logo.svg"
      dockerConfig={dockerConfig}
      npxConfig={npxConfig}
      apiKeyName="LEMONSQUEEZY_API_KEY"
      apiKeyInstructions={apiKeyInstructions}
      features={features}
    />
  );
}  