import { MCPTemplate } from "./template";

export default function PerplexitySonarMCPPage() {
  const dockerConfig = `{
  "mcpServers": {
    "perplexity-ask": {
      "command": "docker",
      "args": [
        "run",
        "-i",
        "--rm",
        "-e",
        "PERPLEXITY_API_KEY",
        "mcp/perplexity-ask"
      ],
      "env": {
        "PERPLEXITY_API_KEY": "YOUR_API_KEY_HERE"
      }
    }
  }
}`;

  const npxConfig = `{
  "mcpServers": {
    "perplexity-ask": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-perplexity-ask"
      ],
      "env": {
        "PERPLEXITY_API_KEY": "YOUR_API_KEY_HERE"
      }
    }
  }
}`;

  const apiKeyInstructions = (
    <>
      <p className="text-slate-300 mb-4">
        To use the Perplexity Sonar MCP server, you need to create a Sonar API key:
      </p>
      <ol className="list-decimal list-inside space-y-2 text-slate-300 mb-4">
        <li>Sign up for a <a href="https://docs.perplexity.ai/guides/getting-started" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">Sonar API account</a></li>
        <li>Follow the account setup instructions and generate your API key from the developer dashboard</li>
        <li>Set the API key in your environment as <code className="bg-slate-700 px-1 py-0.5 rounded">PERPLEXITY_API_KEY</code></li>
        <li>Replace "YOUR_API_KEY_HERE" in the configuration with your actual API key</li>
      </ol>
      <div className="bg-amber-900/30 border border-amber-700/50 p-4 rounded-md text-amber-200 mb-4">
        <p className="font-medium">⚠️ Security Warning</p>
        <p>Never share your API key or commit it to public repositories. Consider using environment variables for secure key management.</p>
      </div>
    </>
  );

  const features = [
    "Engage in conversation with the Sonar API for live web searches",
    "Get real-time, web-wide research results directly within Claude",
    "Access up-to-date information from the internet",
    "Query the web for current events, research, and trends",
    "Perform comprehensive web searches without leaving the MCP ecosystem",
    "Retrieve detailed answers with AI-powered summarization"
  ];

  // Additional component with installation steps
  const installationSteps = (
    <div className="mt-6 space-y-4">
      <h4 className="text-lg font-medium text-white">Manual Installation</h4>
      <p className="text-slate-300">If you prefer to set up the server manually, follow these steps:</p>
      
      <ol className="list-decimal list-inside space-y-2 text-slate-300 ml-4">
        <li>Clone the repository:
          <pre className="bg-slate-900 p-2 rounded-md mt-1 ml-6 text-sm overflow-x-auto">
            git clone https://github.com/ppl-ai/modelcontextprotocol.git
          </pre>
        </li>
        <li>Navigate to the perplexity-ask directory and install dependencies:
          <pre className="bg-slate-900 p-2 rounded-md mt-1 ml-6 text-sm overflow-x-auto">
            cd modelcontextprotocol/perplexity-ask && npm install
          </pre>
        </li>
        <li>Build the Docker image:
          <pre className="bg-slate-900 p-2 rounded-md mt-1 ml-6 text-sm overflow-x-auto">
            docker build -t mcp/perplexity-ask:latest -f Dockerfile .
          </pre>
        </li>
        <li>Configure Claude Desktop:
          <pre className="bg-slate-900 p-2 rounded-md mt-1 ml-6 text-sm overflow-x-auto">
            vim ~/Library/Application\ Support/Claude/claude_desktop_config.json
          </pre>
        </li>
      </ol>
      
      <p className="text-slate-300 mt-4">Add the configuration options shown above to your Claude desktop config file.</p>
    </div>
  );

  return (
    <MCPTemplate
      id="perplexity-sonar"
      name="Perplexity Sonar"
      description="Advanced web search capabilities with AI-powered summarization and information retrieval"
      logo="https://pbs.twimg.com/profile_images/1742540020493058048/iBrQiMQW_400x400.jpg"
      dockerConfig={dockerConfig}
      npxConfig={npxConfig}
      apiKeyName="PERPLEXITY_API_KEY"
      apiKeyInstructions={apiKeyInstructions}
      features={features}
      additionalInstallation={installationSteps}
    />
  );
} 