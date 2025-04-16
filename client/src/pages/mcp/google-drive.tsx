import { MCPTemplate } from "./template";

export default function GoogleDriveMCPPage() {
  const dockerConfig = `{
  "mcpServers": {
    "google-drive": {
      "command": "docker",
      "args": [
        "run",
        "-i",
        "--rm",
        "-e",
        "GOOGLE_CREDENTIALS=YOUR_GOOGLE_CREDENTIALS",
        "mcp/google-drive"
      ]
    }
  }
}`;

  const npxConfig = `{
  "mcpServers": {
    "google-drive": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-google-drive"
      ],
      "env": {
        "GOOGLE_CREDENTIALS": "YOUR_GOOGLE_CREDENTIALS"
      }
    }
  }
}`;

  const apiKeyInstructions = (
    <>
      <p className="text-slate-300 mb-4">
        To use the Google Drive MCP server, you need to set up credentials:
      </p>
      <ol className="list-decimal list-inside space-y-2 text-slate-300 mb-4">
        <li>Go to the <a href="https://console.cloud.google.com/" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">Google Cloud Console</a></li>
        <li>Create a new project or select an existing one</li>
        <li>Enable the Google Drive API for your project</li>
        <li>Create OAuth credentials (OAuth client ID)</li>
        <li>Download the credentials JSON file</li>
        <li>Replace "YOUR_GOOGLE_CREDENTIALS" with the contents of the credentials JSON file (escaped for JSON)</li>
      </ol>
      <div className="bg-slate-900 p-4 rounded-md text-slate-300 mb-4">
        <p className="font-medium mb-2">Authentication Flow:</p>
        <p className="mb-2">• When you first run the server, it will provide a URL for authentication</p>
        <p className="mb-2">• Open the URL in your browser and sign in with your Google account</p>
        <p>• Grant the requested permissions to access your Google Drive</p>
      </div>
      <div className="bg-amber-900/30 border border-amber-700/50 p-4 rounded-md text-amber-200 mb-4">
        <p className="font-medium">⚠️ Security Warning</p>
        <p>Never share your Google credentials or commit them to public repositories. Consider using environment variables for secure credential management.</p>
      </div>
    </>
  );

  const features = [
    "Search for files and folders in Google Drive",
    "Access and read file content directly",
    "Create new files and folders",
    "Update existing files with new content",
    "Organize files with move and copy operations",
    "Generate shareable links for files"
  ];

  return (
    <MCPTemplate
      id="google-drive"
      name="Google Drive"
      description="File access and search capabilities for Google Drive"
      logo="https://cdn.brandfetch.io/idPZj_g3kI/theme/dark/logo.svg"
      dockerConfig={dockerConfig}
      npxConfig={npxConfig}
      apiKeyName="GOOGLE_CREDENTIALS"
      apiKeyInstructions={apiKeyInstructions}
      features={features}
    />
  );
} 