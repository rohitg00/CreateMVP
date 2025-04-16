import { MCPServers, ThirdPartyMCPServers } from './mcp-servers';
import { MCPServer } from './types';

/**
 * This example file demonstrates how to use the MCP servers data in a client application.
 */

// Example: Finding servers by category
function findServersByCategory(category: string): MCPServer[] {
  return MCPServers.filter(server => server.category === category);
}

// Example: Finding a server by ID
function findServerById(id: string): MCPServer | undefined {
  return MCPServers.find(server => server.id === id);
}

// Example: Generating Claude Desktop configuration for multiple servers
function generateClaudeDesktopConfig(serverIds: string[]): Record<string, any> {
  const mcpServers: Record<string, any> = {};
  
  for (const id of serverIds) {
    const server = findServerById(id);
    if (server && server.configExample) {
      mcpServers[id] = {
        command: server.configExample.command,
        args: server.configExample.args,
        ...(server.configExample.env ? { env: server.configExample.env } : {})
      };
    }
  }
  
  return { mcpServers };
}

// Example: Displaying server information
function displayServerInfo(serverId: string): void {
  const server = findServerById(serverId);
  if (!server) {
    console.log(`Server with ID "${serverId}" not found.`);
    return;
  }
  
  console.log(`
Server: ${server.name}
ID: ${server.id}
Category: ${server.category}
Description: ${server.description}

Capabilities:
${server.capabilities?.map(cap => `- ${cap}`).join('\n') || 'No capabilities listed.'}

Installation:
- NPM: ${server.installation?.npm || 'N/A'}
${server.installation?.docker ? `- Docker: ${server.installation.docker}` : ''}
${server.installation?.uvx ? `- UVX: ${server.installation.uvx}` : ''}

Tools:
${server.tools?.map(tool => `- ${tool.name}: ${tool.description}`).join('\n') || 'No tools listed.'}
  `);
}

// Example usage
console.log('Database Servers:');
const databaseServers = findServersByCategory('Database');
databaseServers.forEach(server => console.log(`- ${server.name}: ${server.description}`));

console.log('\nMCP Server Details:');
displayServerInfo('memory');

console.log('\nClaude Desktop Configuration:');
const config = generateClaudeDesktopConfig(['memory', 'github', 'filesystem']);
console.log(JSON.stringify(config, null, 2));

// Example: Searching servers by keyword
function searchServers(keyword: string): MCPServer[] {
  const lowerKeyword = keyword.toLowerCase();
  return [...MCPServers, ...ThirdPartyMCPServers as MCPServer[]].filter(server => 
    server.name.toLowerCase().includes(lowerKeyword) || 
    server.description.toLowerCase().includes(lowerKeyword) ||
    server.category.toLowerCase().includes(lowerKeyword) ||
    server.capabilities?.some(cap => cap.toLowerCase().includes(lowerKeyword))
  );
}

console.log('\nSearch Results for "search":');
const searchResults = searchServers('search');
searchResults.forEach(server => console.log(`- ${server.name}: ${server.description}`)); 