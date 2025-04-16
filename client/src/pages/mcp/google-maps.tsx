import { MCPTemplate } from "./template";

export default function GoogleMapsMCPPage() {
  const dockerConfig = `{
  "mcpServers": {
    "google-maps": {
      "command": "docker",
      "args": [
        "run",
        "-i",
        "--rm",
        "-e",
        "GOOGLE_MAPS_API_KEY=YOUR_API_KEY",
        "mcp/google-maps"
      ]
    }
  }
}`;

  const npxConfig = `{
  "mcpServers": {
    "google-maps": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-google-maps"
      ],
      "env": {
        "GOOGLE_MAPS_API_KEY": "YOUR_API_KEY"
      }
    }
  }
}`;

  const apiKeyInstructions = (
    <>
      <p className="text-slate-300 mb-4">
        To use the Google Maps MCP server, you need a Google Maps API key:
      </p>
      <ol className="list-decimal list-inside space-y-2 text-slate-300 mb-4">
        <li>Go to the <a href="https://console.cloud.google.com/google/maps-apis/overview" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">Google Maps Platform</a> in Google Cloud Console</li>
        <li>Create a new project or select an existing one</li>
        <li>Enable the APIs you need (Places API, Directions API, Geocoding API, etc.)</li>
        <li>Create an API key in the Credentials section</li>
        <li>Copy the generated API key</li>
        <li>Replace "YOUR_API_KEY" in the configuration with your actual API key</li>
      </ol>
      <div className="bg-slate-900 p-4 rounded-md text-slate-300 mb-4">
        <p className="font-medium mb-2">Required APIs:</p>
        <p className="mb-2">• <span className="font-medium">Places API</span>: For searching locations and retrieving place details</p>
        <p className="mb-2">• <span className="font-medium">Directions API</span>: For getting travel directions between locations</p>
        <p>• <span className="font-medium">Geocoding API</span>: For converting addresses to coordinates and vice versa</p>
      </div>
      <div className="bg-amber-900/30 border border-amber-700/50 p-4 rounded-md text-amber-200 mb-4">
        <p className="font-medium">⚠️ Security Warning</p>
        <p>Never share your API key or commit it to public repositories. Consider using environment variables for secure key management. You should also restrict your API key to specific APIs and set up usage quotas.</p>
      </div>
    </>
  );

  const features = [
    "Search for places, businesses, and points of interest",
    "Get detailed information about specific locations",
    "Calculate routes and directions between locations",
    "Convert between addresses and geographic coordinates",
    "Get time zone information for locations",
    "Explore nearby places based on location and category"
  ];

  return (
    <MCPTemplate
      id="google-maps"
      name="Google Maps"
      description="Location services, directions, and place details"
      logo="https://cdn.brandfetch.io/id3uyOwB-S/theme/dark/logo.svg"
      dockerConfig={dockerConfig}
      npxConfig={npxConfig}
      apiKeyName="GOOGLE_MAPS_API_KEY"
      apiKeyInstructions={apiKeyInstructions}
      features={features}
    />
  );
} 