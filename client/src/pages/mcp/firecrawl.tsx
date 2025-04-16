import { MCPTemplate } from "./template";

export default function FireCrawlMCPPage() {
  const dockerConfig = `{
  "mcpServers": {
    "firecrawl": {
      "command": "docker",
      "args": [
        "run",
        "-i",
        "--rm",
        "-e",
        "FIRECRAWL_API_KEY=YOUR_API_KEY",
        "mcp/firecrawl"
      ]
    }
  }
}`;

  const npxConfig = `{
  "mcpServers": {
    "firecrawl": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-firecrawl"
      ],
      "env": {
        "FIRECRAWL_API_KEY": "YOUR_API_KEY"
      }
    }
  }
}`;

  const apiKeyInstructions = (
    <>
      <p className="text-slate-300 mb-4">
        To use the FireCrawl MCP server, you need to create an API key:
      </p>
      <ol className="list-decimal list-inside space-y-2 text-slate-300 mb-4">
        <li>Go to the <a href="https://firecrawl.dev" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">FireCrawl website</a></li>
        <li>Sign up for an account or log in</li>
        <li>Navigate to the API section in your dashboard</li>
        <li>Generate a new API key</li>
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
    "Scrape and extract content from web pages",
    "Crawl websites to gather information",
    "Map website structure and extract links",
    "Search the web for real-time information",
    "Extract structured data from websites",
    "Perform deep research across multiple sources"
  ];

  return (
    <MCPTemplate
      id="firecrawl"
      name="FireCrawl"
      description="Web scraping, crawling, and search capabilities for AI"
      logo="https://storage.googleapis.com/cursor-logo-prod/mcp-firecrawl.png"
      dockerConfig={dockerConfig}
      npxConfig={npxConfig}
      apiKeyName="FIRECRAWL_API_KEY"
      apiKeyInstructions={apiKeyInstructions}
      features={features}
    />
  );
} 