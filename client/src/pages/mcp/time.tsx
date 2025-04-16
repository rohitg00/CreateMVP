import { MCPTemplate } from "./template";

export default function TimeMCPPage() {
  const dockerConfig = `{
  "mcpServers": {
    "time": {
      "command": "docker",
      "args": [
        "run",
        "-i",
        "--rm",
        "mcp/time"
      ]
    }
  }
}`;

  const npxConfig = `{
  "mcpServers": {
    "time": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-time"
      ]
    }
  }
}`;

  const features = [
    "Get current date and time in various formats",
    "Convert time between different time zones",
    "Calculate time differences and durations",
    "Format dates according to locale and user preferences",
    "Schedule operations based on time and date",
    "Parse natural language time descriptions"
  ];

  return (
    <MCPTemplate
      id="time"
      name="Time"
      description="Time and timezone conversion capabilities"
      logo="https://storage.googleapis.com/cursor-logo-prod/mcp-time.png"
      dockerConfig={dockerConfig}
      npxConfig={npxConfig}
      apiKeyName={null}
      features={features}
    />
  );
} 