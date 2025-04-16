import { MCPTemplate } from "./template";

export default function SlackMCPPage() {
  const dockerConfig = `{
  "mcpServers": {
    "slack": {
      "command": "docker",
      "args": [
        "run",
        "-i",
        "--rm",
        "-e",
        "SLACK_TOKEN=YOUR_SLACK_TOKEN",
        "mcp/slack"
      ]
    }
  }
}`;

  const npxConfig = `{
  "mcpServers": {
    "slack": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-slack"
      ],
      "env": {
        "SLACK_TOKEN": "YOUR_SLACK_TOKEN"
      }
    }
  }
}`;

  const apiKeyInstructions = (
    <>
      <p className="text-slate-300 mb-4">
        To use the Slack MCP server, you need to create a Slack bot and get an API token:
      </p>
      <ol className="list-decimal list-inside space-y-2 text-slate-300 mb-4">
        <li>Go to the <a href="https://api.slack.com/apps" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">Slack API applications page</a></li>
        <li>Click "Create New App" and choose "From scratch"</li>
        <li>Give your app a name and select your workspace</li>
        <li>In the "Add features and functionality" section, click "Bots"</li>
        <li>Click "Add Bot User" and configure the bot's display name and username</li>
        <li>Navigate to "OAuth & Permissions" in the sidebar</li>
        <li>Add the following bot token scopes:
          <ul className="list-disc list-inside ml-6 mt-2 space-y-1">
            <li>channels:history</li>
            <li>channels:read</li>
            <li>chat:write</li>
            <li>groups:history</li>
            <li>groups:read</li>
            <li>im:history</li>
            <li>im:read</li>
            <li>users:read</li>
          </ul>
        </li>
        <li>Click "Install to Workspace" at the top of the page</li>
        <li>Copy the "Bot User OAuth Token" that starts with "xoxb-"</li>
        <li>Replace "YOUR_SLACK_TOKEN" in the configuration with your token</li>
      </ol>
      <div className="bg-slate-900 p-4 rounded-md text-slate-300 mb-4">
        <p className="font-medium mb-2">Important Note:</p>
        <p>Once installed, invite your bot to any channels you want it to access by typing <code className="bg-slate-700 px-1 py-0.5 rounded">@your-bot-name</code> in those channels.</p>
      </div>
      <div className="bg-amber-900/30 border border-amber-700/50 p-4 rounded-md text-amber-200 mb-4">
        <p className="font-medium">⚠️ Security Warning</p>
        <p>Never share your Slack token or commit it to public repositories. Consider using environment variables for secure token management.</p>
      </div>
    </>
  );

  const features = [
    "Send messages to Slack channels and direct messages",
    "Read messages from channels",
    "Search through message history",
    "Get information about users and channels",
    "Create and manage channels",
    "Upload files to Slack channels"
  ];

  return (
    <MCPTemplate
      id="slack"
      name="Slack"
      description="Channel management and messaging capabilities"
      logo="https://cdn.brandfetch.io/idcYzgF0vO/theme/dark/logo.svg"
      dockerConfig={dockerConfig}
      npxConfig={npxConfig}
      apiKeyName="SLACK_TOKEN"
      apiKeyInstructions={apiKeyInstructions}
      features={features}
    />
  );
} 