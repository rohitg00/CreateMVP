import { MCPTemplate } from "./template";

export default function EverArtMCPPage() {
  const dockerConfig = `{
  "mcpServers": {
    "everart": {
      "command": "docker",
      "args": [
        "run",
        "-i",
        "--rm",
        "-e",
        "EVERART_API_KEY=YOUR_API_KEY",
        "mcp/everart"
      ]
    }
  }
}`;

  const npxConfig = `{
  "mcpServers": {
    "everart": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-everart"
      ],
      "env": {
        "EVERART_API_KEY": "YOUR_API_KEY"
      }
    }
  }
}`;

  const apiKeyInstructions = (
    <>
      <p className="text-slate-300 mb-4">
        To use the EverArt MCP server, you'll need an API key:
      </p>
      <ol className="list-decimal list-inside space-y-2 text-slate-300 mb-4">
        <li>Visit the <a href="https://everart.io" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">EverArt website</a></li>
        <li>Create an account or sign in to your existing account</li>
        <li>Navigate to your account settings or developer section</li>
        <li>Generate a new API key</li>
        <li>Copy the generated API key</li>
        <li>Replace "YOUR_API_KEY" in the configuration with your actual API key</li>
      </ol>
      <div className="bg-slate-900 p-4 rounded-md text-slate-300 mb-4">
        <p className="font-medium mb-2">Available Models:</p>
        <p className="mb-2">• Stable Diffusion (various versions)</p>
        <p className="mb-2">• Midjourney-compatible models</p>
        <p>• DALL-E compatible interfaces</p>
      </div>
      <div className="bg-amber-900/30 border border-amber-700/50 p-4 rounded-md text-amber-200 mb-4">
        <p className="font-medium">⚠️ Security Warning</p>
        <p>Never share your API key or commit it to public repositories. Consider using environment variables for secure key management.</p>
      </div>
    </>
  );

  const features = [
    "Generate AI images with various models",
    "Create variations of existing images",
    "Edit images with text prompts",
    "Upscale and enhance generated images",
    "Customize image generation with advanced parameters",
    "Generate images with specific styles and artistic influences"
  ];

  return (
    <MCPTemplate
      id="everart"
      name="EverArt"
      description="AI image generation using various models"
      logo="https://storage.googleapis.com/cursor-logo-prod/mcp-everart.png"
      dockerConfig={dockerConfig}
      npxConfig={npxConfig}
      apiKeyName="EVERART_API_KEY"
      apiKeyInstructions={apiKeyInstructions}
      features={features}
    />
  );
} 