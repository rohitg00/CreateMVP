import { MCPTemplate } from "./template";

export default function SupabaseMCPPage() {
  const dockerConfig = `{
  "mcpServers": {
    "supabase": {
      "command": "docker",
      "args": [
        "run",
        "-i",
        "--rm",
        "-e",
        "SUPABASE_URL=YOUR_SUPABASE_URL",
        "-e",
        "SUPABASE_KEY=YOUR_SUPABASE_KEY",
        "mcp/supabase"
      ]
    }
  }
}`;

  const npxConfig = `{
  "mcpServers": {
    "supabase": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-supabase"
      ],
      "env": {
        "SUPABASE_URL": "YOUR_SUPABASE_URL",
        "SUPABASE_KEY": "YOUR_SUPABASE_KEY"
      }
    }
  }
}`;

  const apiKeyInstructions = (
    <>
      <p className="text-slate-300 mb-4">
        To use the Supabase MCP server, you need your Supabase URL and API key:
      </p>
      <ol className="list-decimal list-inside space-y-2 text-slate-300 mb-4">
        <li>Log in to your <a href="https://app.supabase.com" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">Supabase dashboard</a></li>
        <li>Select your project</li>
        <li>Go to Project Settings → API</li>
        <li>Under "Project URL", copy your project URL</li>
        <li>Under "Project API Keys", copy your "anon" public key or "service_role" key (depending on your needs)</li>
        <li>Replace "YOUR_SUPABASE_URL" and "YOUR_SUPABASE_KEY" in the configuration with your values</li>
      </ol>
      <div className="bg-slate-900 p-4 rounded-md text-slate-300 mb-4">
        <p className="font-medium mb-2">🔑 Key differences:</p>
        <p className="mb-2">• <span className="font-medium">anon key</span>: Limited permissions, safe for client-side, respects Row Level Security (RLS)</p>
        <p>• <span className="font-medium">service_role key</span>: Full database access, bypasses RLS, should only be used server-side</p>
      </div>
      <div className="bg-amber-900/30 border border-amber-700/50 p-4 rounded-md text-amber-200 mb-4">
        <p className="font-medium">⚠️ Security Warning</p>
        <p>Never share your API keys or commit them to public repositories. Consider using environment variables for secure key management.</p>
      </div>
    </>
  );

  const features = [
    "Execute PostgreSQL queries via PostgREST",
    "Perform CRUD operations on your Supabase database",
    "Access and manage authentication and users",
    "Work with Supabase storage for file management",
    "Use Supabase Edge Functions for serverless compute"
  ];

  return (
    <MCPTemplate
      id="supabase"
      name="Supabase"
      description="MCP server for PostgREST and Supabase services"
      logo="https://cdn.brandfetch.io/idsSceG8fK/w/436/h/449/theme/dark/symbol.svg"
      dockerConfig={dockerConfig}
      npxConfig={npxConfig}
      apiKeyName="SUPABASE_URL and SUPABASE_KEY"
      apiKeyInstructions={apiKeyInstructions}
      features={features}
    />
  );
} 