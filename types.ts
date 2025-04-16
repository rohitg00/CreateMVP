/**
 * Model Context Protocol (MCP) Type Definitions
 */

/**
 * Represents an MCP Server with its capabilities and configuration
 */
export interface MCPServer {
  /** Unique identifier for the server */
  id: string;
  
  /** Display name of the server */
  name: string;
  
  /** Detailed description of the server's purpose */
  description: string;
  
  /** Category for grouping similar servers */
  category: string;
  
  /** URL to the server's repository or documentation (mainly for third-party servers) */
  url?: string;
  
  /** Installation instructions */
  installation?: {
    /** NPM/NPX installation command */
    npm: string;
    /** Docker installation command */
    docker?: string;
    /** UV/UVX installation command */
    uvx?: string;
  };
  
  /** List of capabilities/features the server provides */
  capabilities?: string[];
  
  /** Example configuration for Claude Desktop or other MCP clients */
  configExample?: MCPConfig;
  
  /** List of tools provided by the server */
  tools?: MCPTool[];
}

/**
 * Configuration for an MCP server in an MCP client
 */
export interface MCPConfig {
  /** Command to run the server */
  command: string;
  
  /** Arguments to pass to the command */
  args: string[];
  
  /** Environment variables to set */
  env?: Record<string, string>;
}

/**
 * Parameter for an MCP tool
 */
export interface MCPToolParameter {
  /** Name of the parameter */
  name: string;
  
  /** Type of the parameter (string, number, boolean, array, object) */
  type: string;
  
  /** Description of the parameter */
  description: string;
  
  /** Whether the parameter is required */
  required?: boolean;
}

/**
 * Tool provided by an MCP server
 */
export interface MCPTool {
  /** Name of the tool */
  name: string;
  
  /** Description of what the tool does */
  description: string;
  
  /** Parameters the tool accepts */
  params: MCPToolParameter[];
} 