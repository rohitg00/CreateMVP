import { MCPTemplate } from "./template";

export default function SQLiteMCPPage() {
  const dockerConfig = `{
  "mcpServers": {
    "sqlite": {
      "command": "docker",
      "args": [
        "run",
        "-i",
        "--rm",
        "-v",
        "$(pwd):/workspace",
        "mcp/sqlite",
        "/workspace/your-database.db"
      ]
    }
  }
}`;

  const npxConfig = `{
  "mcpServers": {
    "sqlite": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-sqlite",
        "your-database.db"
      ]
    }
  }
}`;

  const databaseInstructions = (
    <>
      <p className="text-slate-300 mb-4">
        The SQLite MCP server needs access to your database file:
      </p>
      <ol className="list-decimal list-inside space-y-2 text-slate-300 mb-4">
        <li>Replace <code className="bg-slate-700 px-1 py-0.5 rounded">your-database.db</code> with the path to your SQLite database file</li>
        <li>For Docker, the host directory is mounted at <code className="bg-slate-700 px-1 py-0.5 rounded">/workspace</code> inside the container</li>
        <li>You can use a relative path (from your current directory) or an absolute path</li>
      </ol>
      <div className="bg-slate-900 p-4 rounded-md text-slate-300 mb-4">
        <p className="font-medium mb-2">Example paths:</p>
        <p className="mb-2">• Local database: <code className="bg-slate-700 px-1 py-0.5 rounded">data/myapp.db</code></p>
        <p>• Absolute path: <code className="bg-slate-700 px-1 py-0.5 rounded">/path/to/your/database.db</code></p>
      </div>
      <div className="bg-amber-900/30 border border-amber-700/50 p-4 rounded-md text-amber-200 mb-4">
        <p className="font-medium">⚠️ Security Warning</p>
        <p>This server provides access to your database. Be careful when exposing databases with sensitive information. Consider using a read-only copy of your database for added security.</p>
      </div>
    </>
  );

  const features = [
    "Query your SQLite databases with SQL",
    "Browse database schema and table structure",
    "Perform data analysis and generate insights",
    "Create visualizations from query results",
    "Execute database operations with AI assistance",
    "Generate SQL queries from natural language descriptions"
  ];

  return (
    <MCPTemplate
      id="sqlite"
      name="SQLite"
      description="Database interaction and business intelligence capabilities"
      logo="https://storage.googleapis.com/cursor-logo-prod/mcp-sqlite.png"
      dockerConfig={dockerConfig}
      npxConfig={npxConfig}
      apiKeyName="Database Path"
      apiKeyInstructions={databaseInstructions}
      features={features}
    />
  );
} 