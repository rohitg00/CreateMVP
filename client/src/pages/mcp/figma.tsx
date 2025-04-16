import { MCPTemplate } from "./template";

export default function FigmaMCPPage() {
  const dockerConfig = `{
  "mcpServers": {
    "figma": {
      "command": "docker",
      "args": [
        "run",
        "-i",
        "--rm",
        "-e",
        "FIGMA_ACCESS_TOKEN=YOUR_FIGMA_ACCESS_TOKEN",
        "mcp/figma"
      ]
    }
  }
}`;

  const npxConfig = `{
  "mcpServers": {
    "figma": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-figma"
      ],
      "env": {
        "FIGMA_ACCESS_TOKEN": "YOUR_FIGMA_ACCESS_TOKEN"
      }
    }
  }
}`;

  const apiKeyInstructions = (
    <>
      <p className="text-slate-300 mb-4">
        To use the Figma MCP server, you need to create a personal access token:
      </p>
      <ol className="list-decimal list-inside space-y-2 text-slate-300 mb-4">
        <li>Go to your <a href="https://www.figma.com/settings" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">Figma account settings</a></li>
        <li>Scroll down to the "Personal access tokens" section</li>
        <li>Click "Create a new personal access token"</li>
        <li>Give your token a descriptive name (e.g., "MCP Integration")</li>
        <li>Copy the generated token (you won't be able to see it again)</li>
        <li>Replace "YOUR_FIGMA_ACCESS_TOKEN" in the configuration with your access token</li>
      </ol>
      <div className="bg-slate-900 p-4 rounded-md text-slate-300 mb-4">
        <p className="font-medium mb-2">File Access:</p>
        <p>Personal access tokens have access to all files that you can access in Figma. They act on your behalf and have the same permissions as your account.</p>
      </div>
      <div className="bg-amber-900/30 border border-amber-700/50 p-4 rounded-md text-amber-200 mb-4">
        <p className="font-medium">⚠️ Security Warning</p>
        <p>Never share your access token or commit it to public repositories. Consider using environment variables for secure token management.</p>
      </div>
    </>
  );

  const features = [
    "Retrieve design specifications and assets from Figma files",
    "Convert Figma designs to code with AI assistance",
    "Extract colors, typography, and design tokens",
    "Access component libraries and design systems",
    "Generate responsive layouts based on Figma designs",
    "Export design assets in various formats"
  ];

  return (
    <MCPTemplate
      id="figma"
      name="Figma"
      description="Extract design data from Figma for accurate implementation"
      logo="https://cdn.brandfetch.io/idZHcZ_i7F/theme/dark/symbol.svg"
      dockerConfig={dockerConfig}
      npxConfig={npxConfig}
      apiKeyName="FIGMA_ACCESS_TOKEN"
      apiKeyInstructions={apiKeyInstructions}
      features={features}
    />
  );
} 