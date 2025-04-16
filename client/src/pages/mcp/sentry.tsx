import { MCPTemplate } from "./template";

export default function SentryMCPPage() {
  const dockerConfig = `{
  "mcpServers": {
    "sentry": {
      "command": "docker",
      "args": [
        "run",
        "-i",
        "--rm",
        "-e",
        "SENTRY_TOKEN=YOUR_SENTRY_TOKEN",
        "-e",
        "SENTRY_ORG=YOUR_ORGANIZATION_SLUG",
        "mcp/sentry"
      ]
    }
  }
}`;

  const npxConfig = `{
  "mcpServers": {
    "sentry": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-sentry"
      ],
      "env": {
        "SENTRY_TOKEN": "YOUR_SENTRY_TOKEN",
        "SENTRY_ORG": "YOUR_ORGANIZATION_SLUG"
      }
    }
  }
}`;

  const apiKeyInstructions = (
    <>
      <p className="text-slate-300 mb-4">
        To use the Sentry MCP server, you need to create an auth token:
      </p>
      <ol className="list-decimal list-inside space-y-2 text-slate-300 mb-4">
        <li>Sign in to your <a href="https://sentry.io/" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">Sentry account</a></li>
        <li>Navigate to Settings → Developer Settings → New Internal Integration</li>
        <li>Give your integration a name (e.g., "MCP Integration")</li>
        <li>Grant the following permissions:
          <ul className="list-disc list-inside ml-6 mt-2 space-y-1">
            <li>Project: Read</li>
            <li>Issue & Event: Read</li>
            <li>Organization: Read</li>
          </ul>
        </li>
        <li>Save the integration and copy the generated token</li>
        <li>Identify your organization slug from your Sentry URL (e.g., "your-org" from "sentry.io/your-org/")</li>
        <li>Replace "YOUR_SENTRY_TOKEN" with your auth token</li>
        <li>Replace "YOUR_ORGANIZATION_SLUG" with your organization slug</li>
      </ol>
      <div className="bg-slate-900 p-4 rounded-md text-slate-300 mb-4">
        <p className="font-medium mb-2">Note:</p>
        <p>You can optionally specify a specific project by adding the <code className="bg-slate-700 px-1 py-0.5 rounded">SENTRY_PROJECT</code> environment variable with your project slug.</p>
      </div>
      <div className="bg-amber-900/30 border border-amber-700/50 p-4 rounded-md text-amber-200 mb-4">
        <p className="font-medium">⚠️ Security Warning</p>
        <p>Never share your Sentry auth token or commit it to public repositories. Consider using environment variables for secure token management.</p>
      </div>
    </>
  );

  const features = [
    "Retrieve and analyze error reports from your applications",
    "Explore issue details including stack traces and debug information",
    "Get insights on error frequency and impact",
    "Search issues by various criteria",
    "View performance metrics and trends",
    "Generate summary reports of critical issues"
  ];

  return (
    <MCPTemplate
      id="sentry"
      name="Sentry"
      description="Retrieving and analyzing issues from Sentry.io"
      logo="https://cdn.brandfetch.io/idQCRkM1pP/theme/dark/logo.svg"
      dockerConfig={dockerConfig}
      npxConfig={npxConfig}
      apiKeyName="SENTRY_TOKEN and SENTRY_ORG"
      apiKeyInstructions={apiKeyInstructions}
      features={features}
    />
  );
} 