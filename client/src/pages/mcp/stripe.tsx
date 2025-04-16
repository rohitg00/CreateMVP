import { MCPTemplate } from "./template";

export default function StripeMCPPage() {
  const dockerConfig = `{
  "mcpServers": {
    "stripe": {
      "command": "docker",
      "args": [
        "run",
        "-i",
        "--rm",
        "-e",
        "STRIPE_API_KEY=YOUR_STRIPE_API_KEY",
        "mcp/stripe"
      ]
    }
  }
}`;

  const npxConfig = `{
  "mcpServers": {
    "stripe": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-stripe"
      ],
      "env": {
        "STRIPE_API_KEY": "YOUR_STRIPE_API_KEY"
      }
    }
  }
}`;

  const apiKeyInstructions = (
    <>
      <p className="text-slate-300 mb-4">
        To use the Stripe MCP server, you need a Stripe API key:
      </p>
      <ol className="list-decimal list-inside space-y-2 text-slate-300 mb-4">
        <li>Log in to your <a href="https://dashboard.stripe.com/apikeys" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">Stripe Dashboard</a></li>
        <li>Navigate to Developers → API keys</li>
        <li>Use your Secret key for full access or create a Restricted key with specific permissions</li>
        <li>Copy the API key (starts with "sk_")</li>
        <li>Replace "YOUR_STRIPE_API_KEY" in the configuration with your API key</li>
      </ol>
      <div className="bg-slate-900 p-4 rounded-md text-slate-300 mb-4">
        <p className="font-medium mb-2">Test vs Live Mode:</p>
        <p className="mb-2">• <span className="font-medium">Test mode keys</span> (start with sk_test_): Safe for development, use with test data only</p>
        <p>• <span className="font-medium">Live mode keys</span> (start with sk_live_): Access to real customer data, only use in production</p>
      </div>
      <div className="bg-amber-900/30 border border-amber-700/50 p-4 rounded-md text-amber-200 mb-4">
        <p className="font-medium">⚠️ Security Warning</p>
        <p>Your Stripe API key provides access to financial data and operations. Never share it or commit it to public repositories. Consider using environment variables for secure key management.</p>
      </div>
    </>
  );

  const features = [
    "Process payments and handle transactions",
    "Manage customers and payment methods",
    "Create and manage subscriptions",
    "Handle invoices and billing",
    "Access detailed payment analytics",
    "Process refunds and handle disputes"
  ];

  return (
    <MCPTemplate
      id="stripe"
      name="Stripe"
      description="Interact with the Stripe API for payment processing and subscription management"
      logo="https://cdn.brandfetch.io/idxAg10C0L/theme/light/logo.svg"
      dockerConfig={dockerConfig}
      npxConfig={npxConfig}
      apiKeyName="STRIPE_API_KEY"
      apiKeyInstructions={apiKeyInstructions}
      features={features}
    />
  );
} 