import { MCPTemplate } from "./template";

export default function BraveSearchMCPPage() {
  const dockerConfig = `{
  "mcpServers": {
    "brave-search": {
      "command": "docker",
      "args": [
        "run",
        "-i",
        "--rm",
        "-e",
        "BRAVE_API_KEY=YOUR_BRAVE_API_KEY",
        "mcp/brave-search"
      ]
    }
  }
}`;

  const npxConfig = `{
  "mcpServers": {
    "brave-search": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-brave-search"
      ],
      "env": {
        "BRAVE_API_KEY": "YOUR_BRAVE_API_KEY"
      }
    }
  }
}`;

  const apiKeyInstructions = (
    <>
      <p className="text-slate-300 mb-4">
        To use the Brave Search MCP server, you need to obtain a Brave Search API key:
      </p>
      <ol className="list-decimal list-inside space-y-2 text-slate-300 mb-4">
        <li>Visit the <a href="https://brave.com/search/api/" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">Brave Search API website</a></li>
        <li>Sign up for an API key by following their registration process</li>
        <li>Once approved, you'll receive your API key</li>
        <li>Replace "YOUR_BRAVE_API_KEY" in the configuration with your actual API key</li>
      </ol>
      <div className="bg-slate-900 p-4 rounded-md text-slate-300 mb-4">
        <p className="font-medium mb-2">Brave Search API Features:</p>
        <p className="mb-2">• Privacy-preserving web search with independent index</p>
        <p className="mb-2">• Flexible search options with customizable parameters</p>
        <p>• Transparent ranking without secret algorithms or biases</p>
      </div>
      <div className="bg-amber-900/30 border border-amber-700/50 p-4 rounded-md text-amber-200 mb-4">
        <p className="font-medium">⚠️ Security Warning</p>
        <p>Never share your API key or commit it to public repositories. Consider using environment variables for secure key management.</p>
      </div>
    </>
  );

  const features = [
    "Search the web with Brave's privacy-focused search engine",
    "Get relevant search results without tracking",
    "Access web content with context and summaries",
    "Perform both web and news searches",
    "Filter results by region, language, and content type"
  ];

  return (
    <MCPTemplate
      id="brave-search"
      name="Brave Search"
      description="Web and local search using Brave's Search API"
      logo="https://cdn.brandfetch.io/idBJp4q3tK/theme/dark/symbol.svg"
      dockerConfig={dockerConfig}
      npxConfig={npxConfig}
      apiKeyName="BRAVE_API_KEY"
      apiKeyInstructions={apiKeyInstructions}
      features={features}
    />
  );
} 