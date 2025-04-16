import { MCPTemplate } from "./template";

export default function ResendMCPPage() {
  const dockerConfig = `{
  "mcpServers": {
    "resend": {
      "command": "docker",
      "args": [
        "run",
        "-i",
        "--rm",
        "-e",
        "RESEND_API_KEY",
        "mcp/resend"
      ],
      "env": {
        "RESEND_API_KEY": "<YOUR_API_KEY>"
      }
    }
  }
}`;

  const npxConfig = `{
  "mcpServers": {
    "resend": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-resend"
      ],
      "env": {
        "RESEND_API_KEY": "<YOUR_API_KEY>"
      }
    }
  }
}`;

  const resendApiInstructions = (
    <>
      <p className="text-slate-300 mb-4">
        Before installing the Resend MCP server, you'll need to create a Resend API Key:
      </p>
      <ol className="list-decimal list-inside space-y-2 text-slate-300 mb-4">
        <li>Create a <a href="https://resend.com/signup" target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:text-indigo-300">Resend account</a> if you don't have one already</li>
        <li>Navigate to the API Keys section in your Resend dashboard</li>
        <li>Click "Create API Key" and give it a name (e.g., "Cursor MCP")</li>
        <li>Copy the generated API key</li>
      </ol>
    </>
  );

  const features = [
    "Send transactional emails directly through Cursor or other AI interfaces",
    "Compose professional emails with AI assistance and send them immediately",
    "Integrate email sending capabilities into your AI workflows",
    "Track email delivery status and engagement metrics",
    "Use templates to create consistent email communications"
  ];

  return (
    <MCPTemplate
      id="resend"
      name="Resend"
      description="Send emails using Resend's API directly from Cursor or Claude Desktop"
      logo="https://pbs.twimg.com/profile_images/1749861436074151936/MPNI32ysD_400x400.jpg"
      dockerConfig={dockerConfig}
      npxConfig={npxConfig}
      apiKeyName="Resend API Key"
      apiKeyInstructions={resendApiInstructions}
      features={features}
    />
  );
} 