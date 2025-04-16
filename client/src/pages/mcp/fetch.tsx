import { MCPTemplate } from "./template";

export default function FetchMCPPage() {
  const dockerConfig = `{
  "mcpServers": {
    "fetch": {
      "command": "docker",
      "args": [
        "run",
        "-i",
        "--rm",
        "mcp/fetch"
      ]
    }
  }
}`;

  const npxConfig = `{
  "mcpServers": {
    "fetch": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-fetch"
      ]
    }
  }
}`;

  const features = [
    "Fetch web content from URLs in various formats (HTML, JSON, Markdown, etc.)",
    "Automatically convert web content to formats optimized for LLMs",
    "Extract main content from web pages, removing clutter",
    "Follow redirects and handle different HTTP methods",
    "Set custom headers for accessing authenticated content",
    "Specify content types for proper parsing"
  ];

  return (
    <MCPTemplate
      id="fetch"
      name="Fetch"
      description="Web content fetching and conversion for efficient LLM usage"
      logo="https://storage.googleapis.com/cursor-logo-prod/mcp-fetch.png"
      dockerConfig={dockerConfig}
      npxConfig={npxConfig}
      apiKeyName={null}
      features={features}
    />
  );
} 