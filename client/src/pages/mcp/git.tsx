import { MCPTemplate } from "./template";

export default function GitMCPPage() {
  const dockerConfig = `{
  "mcpServers": {
    "git": {
      "command": "docker",
      "args": [
        "run",
        "-i",
        "--rm",
        "-v",
        "$(pwd):/workspace",
        "mcp/git",
        "/workspace"
      ]
    }
  }
}`;

  const npxConfig = `{
  "mcpServers": {
    "git": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-git",
        "$(pwd)"
      ]
    }
  }
}`;

  const workspaceInstructions = (
    <>
      <p className="text-slate-300 mb-4">
        The Git MCP server needs access to your Git repositories:
      </p>
      <ol className="list-decimal list-inside space-y-2 text-slate-300 mb-4">
        <li>The default configuration uses <code className="bg-slate-700 px-1 py-0.5 rounded">$(pwd)</code> to mount your current working directory</li>
        <li>You can replace this with any absolute path to a directory containing Git repositories</li>
        <li>For Docker, the directory is mounted at <code className="bg-slate-700 px-1 py-0.5 rounded">/workspace</code> inside the container</li>
        <li>Make sure Git is installed and properly configured in your environment</li>
      </ol>
      <div className="bg-slate-900 p-4 rounded-md text-slate-300 mb-4">
        <p className="font-medium mb-2">Authentication:</p>
        <p className="mb-2">• For private repositories, ensure your Git credentials are properly configured</p>
        <p>• SSH keys or credential helpers should be set up for seamless authentication</p>
      </div>
    </>
  );

  const features = [
    "Clone and manage Git repositories",
    "View commit history and changes",
    "Search through code in repositories",
    "Create branches and manage workflow",
    "Show diff between commits or branches",
    "Analyze repository statistics"
  ];

  return (
    <MCPTemplate
      id="git"
      name="Git"
      description="Tools to read, search, and manipulate Git repositories"
      logo="https://cdn.brandfetch.io/idqVOhoGb6/theme/dark/logo.svg"
      dockerConfig={dockerConfig}
      npxConfig={npxConfig}
      apiKeyName="Repository Path"
      apiKeyInstructions={workspaceInstructions}
      features={features}
    />
  );
} 