import { MCPTemplate } from "./template";

export default function PostgreSQLMCPPage() {
  const dockerConfig = `{
  "mcpServers": {
    "postgresql": {
      "command": "docker",
      "args": [
        "run",
        "-i",
        "--rm",
        "mcp/postgres",
        "postgresql://username:password@hostname:port/database"
      ]
    }
  }
}`;

  const npxConfig = `{
  "mcpServers": {
    "postgresql": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-postgres",
        "postgresql://username:password@hostname:port/database"
      ]
    }
  }
}`;

  const databaseConnectionInstructions = (
    <>
      <p className="text-slate-300 mb-4">
        Before installing the PostgreSQL MCP server, you'll need your database connection string:
      </p>
      <ol className="list-decimal list-inside space-y-2 text-slate-300 mb-4">
        <li>Identify your PostgreSQL database host, port, username, password, and database name</li>
        <li>Format the connection string as: <code className="bg-slate-700 px-1 py-0.5 rounded">postgresql://username:password@hostname:port/database</code></li>
        <li>Replace the placeholder in the configuration with your actual connection string</li>
      </ol>
      <div className="bg-slate-900 p-4 rounded-md text-slate-300 mb-4">
        <p className="font-medium mb-2">Example connection strings:</p>
        <p className="mb-2">• Local database: <code className="bg-slate-700 px-1 py-0.5 rounded">postgresql://postgres:password@localhost:5432/mydatabase</code></p>
        <p>• Remote database: <code className="bg-slate-700 px-1 py-0.5 rounded">postgresql://user:password@db.example.com:5432/production</code></p>
      </div>
    </>
  );

  const features = [
    "Execute read-only SQL queries against PostgreSQL databases",
    "Inspect database schemas to understand table structures",
    "Generate SQL queries with AI assistance",
    "Analyze query results and generate insights",
    "Create reports and visualizations from database data"
  ];

  return (
    <MCPTemplate
      id="postgresql"
      name="PostgreSQL"
      description="Read-only access to PostgreSQL databases with schema inspection"
      logo="https://cdn.brandfetch.io/idjSeCeMle/theme/dark/logo.svg"
      dockerConfig={dockerConfig}
      npxConfig={npxConfig}
      apiKeyName="Database Connection String"
      apiKeyInstructions={databaseConnectionInstructions}
      features={features}
    />
  );
} 