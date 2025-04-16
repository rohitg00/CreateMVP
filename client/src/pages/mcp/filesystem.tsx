import { MCPTemplate } from "./template";

export default function FilesystemMCPPage() {
  const dockerConfig = `{
  "mcpServers": {
    "filesystem": {
      "command": "docker",
      "args": [
        "run",
        "-i",
        "--rm",
        "-v",
        "$(pwd):/workspace",
        "mcp/filesystem",
        "/workspace"
      ]
    }
  }
}`;

  const npxConfig = `{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-filesystem",
        "$(pwd)"
      ]
    }
  }
}`;

  const workspaceInstructions = (
    <>
      <p className="text-slate-300 mb-4">
        The Filesystem MCP server needs to know which directory to access:
      </p>
      <ol className="list-decimal list-inside space-y-2 text-slate-300 mb-4">
        <li>The default configuration uses <code className="bg-slate-700 px-1 py-0.5 rounded">$(pwd)</code> to mount your current working directory</li>
        <li>You can replace this with any absolute path to the directory you want to expose</li>
        <li>For Docker, the directory is mounted at <code className="bg-slate-700 px-1 py-0.5 rounded">/workspace</code> inside the container</li>
      </ol>
      <div className="bg-amber-900/30 border border-amber-700/50 p-4 rounded-md text-amber-200 mb-4">
        <p className="font-medium">⚠️ Security Warning</p>
        <p>Be cautious when giving AI access to your filesystem. Only expose directories that contain files you're comfortable with the AI accessing. Avoid exposing directories with sensitive information.</p>
      </div>
    </>
  );

  const features = [
    "Read files and directories from the local filesystem",
    "Write, create, and edit files with AI assistance",
    "Search through files using regex patterns",
    "Use semantic search to find relevant code",
    "Create and modify project structures"
  ];

  return (
    <MCPTemplate
      id="filesystem"
      name="Filesystem"
      description="Access and modify files on your local filesystem"
      logo="https://storage.googleapis.com/cursor-logo-prod/mcp-filesystem.png"
      dockerConfig={dockerConfig}
      npxConfig={npxConfig}
      apiKeyName="Workspace Directory"
      apiKeyInstructions={workspaceInstructions}
      features={features}
    />
  );
} 