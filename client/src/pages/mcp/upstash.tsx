import { MCPTemplate } from "./template";

export default function UpstashMCPPage() {
  const dockerConfig = `{
  "mcpServers": {
    "upstash": {
      "command": "docker",
      "args": [
        "run",
        "-i",
        "--rm",
        "-e",
        "UPSTASH_API_KEY=YOUR_API_KEY",
        "-e",
        "UPSTASH_API_EMAIL=YOUR_EMAIL",
        "mcp/upstash"
      ]
    }
  }
}`;

  const npxConfig = `{
  "mcpServers": {
    "upstash": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-upstash"
      ],
      "env": {
        "UPSTASH_API_KEY": "YOUR_API_KEY",
        "UPSTASH_API_EMAIL": "YOUR_EMAIL"
      }
    }
  }
}`;

  const apiKeyInstructions = (
    <>
      <p className="text-slate-300 mb-4">
        To use the Upstash MCP server, you need to obtain your API credentials:
      </p>
      <ol className="list-decimal list-inside space-y-2 text-slate-300 mb-4">
        <li>Sign up or log in to your <a href="https://console.upstash.com/" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">Upstash account</a></li>
        <li>Navigate to the API Keys section in your dashboard</li>
        <li>Find your API key and the email associated with your account</li>
        <li>Replace "YOUR_API_KEY" with your actual Upstash API key</li>
        <li>Replace "YOUR_EMAIL" with the email address associated with your Upstash account</li>
      </ol>
      <div className="bg-slate-900 p-4 rounded-md text-slate-300 mb-4">
        <p className="font-medium mb-2">Upstash Services:</p>
        <p className="mb-2">• <span className="font-medium">Redis</span>: Serverless Redis database</p>
        <p className="mb-2">• <span className="font-medium">Kafka</span>: Serverless Kafka messaging</p>
        <p>• <span className="font-medium">QStash</span>: Message queuing service</p>
      </div>
      <div className="bg-amber-900/30 border border-amber-700/50 p-4 rounded-md text-amber-200 mb-4">
        <p className="font-medium">⚠️ Security Warning</p>
        <p>Never share your API credentials or commit them to public repositories. Consider using environment variables for secure credential management.</p>
      </div>
    </>
  );

  const features = [
    "Manage Redis databases with serverless access",
    "Create and interact with Kafka topics and consumers",
    "Send and receive messages with QStash",
    "Monitor database metrics and performance",
    "Scale resources up and down as needed",
    "Integrate with serverless functions and applications"
  ];

  return (
    <MCPTemplate
      id="upstash"
      name="Upstash"
      description="Serverless Redis, Kafka, and QStash for cloud applications"
      logo="https://cdn.brandfetch.io/idtO8ogV_k/theme/dark/logo.svg"
      dockerConfig={dockerConfig}
      npxConfig={npxConfig}
      apiKeyName="UPSTASH_API_KEY and UPSTASH_API_EMAIL"
      apiKeyInstructions={apiKeyInstructions}
      features={features}
    />
  );
} 