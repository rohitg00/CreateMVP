import { MCPServer } from './types';

/**
 * Model Context Protocol (MCP) Servers
 * 
 * This file defines the available MCP servers from the Model Context Protocol.
 * Each server provides specific tools and capabilities for AI assistants to interact with various systems.
 * 
 * Reference: https://github.com/modelcontextprotocol/servers
 */

export const MCPServers: MCPServer[] = [
  {
    id: 'aws-kb-retrieval-server',
    name: 'AWS KB Retrieval',
    description: 'Retrieval from AWS Knowledge Base using Bedrock Agent Runtime',
    category: 'Data Retrieval',
    installation: {
      npm: 'npx -y @modelcontextprotocol/server-aws-kb-retrieval',
      docker: 'docker run -i --rm mcp/aws-kb-retrieval'
    },
    capabilities: [
      'Retrieve information from AWS Knowledge Base',
      'Query Bedrock Agent Runtime',
      'Extract structured data'
    ],
    configExample: {
      command: 'npx',
      args: ['-y', '@modelcontextprotocol/server-aws-kb-retrieval'],
      env: {
        'AWS_REGION': 'us-west-2',
        'AWS_PROFILE': 'default'
      }
    }
  },
  {
    id: 'brave-search',
    name: 'Brave Search',
    description: 'Web and local search using Brave\'s Search API',
    category: 'Search',
    installation: {
      npm: 'npx -y @modelcontextprotocol/server-brave-search',
      docker: 'docker run -i --rm mcp/brave-search'
    },
    capabilities: [
      'Perform web searches',
      'Filter results by country and language',
      'Get structured search results'
    ],
    configExample: {
      command: 'npx',
      args: ['-y', '@modelcontextprotocol/server-brave-search'],
      env: {
        'BRAVE_API_KEY': '<YOUR_BRAVE_API_KEY>'
      }
    }
  },
  {
    id: 'everart',
    name: 'EverArt',
    description: 'AI image generation using various models',
    category: 'Creative',
    installation: {
      npm: 'npx -y @modelcontextprotocol/server-everart',
      docker: 'docker run -i --rm mcp/everart'
    },
    capabilities: [
      'Generate images with AI models',
      'Customize image parameters',
      'Support multiple AI providers'
    ],
    configExample: {
      command: 'npx',
      args: ['-y', '@modelcontextprotocol/server-everart'],
      env: {
        'OPENAI_API_KEY': '<YOUR_OPENAI_API_KEY>'
      }
    }
  },
  {
    id: 'everything',
    name: 'Everything',
    description: 'Reference / test server with prompts, resources, and tools',
    category: 'Testing',
    installation: {
      npm: 'npx -y @modelcontextprotocol/server-everything',
      docker: 'docker run -i --rm mcp/everything'
    },
    capabilities: [
      'Test MCP client implementations',
      'Demonstrate various MCP features',
      'Provide example prompts and tools'
    ],
    configExample: {
      command: 'npx',
      args: ['-y', '@modelcontextprotocol/server-everything']
    }
  },
  {
    id: 'fetch',
    name: 'Fetch',
    description: 'Web content fetching and conversion for efficient LLM usage',
    category: 'Web Integration',
    installation: {
      npm: 'npx -y @modelcontextprotocol/server-fetch',
      docker: 'docker run -i --rm mcp/fetch'
    },
    capabilities: [
      'Fetch content from web URLs',
      'Convert HTML to Markdown',
      'Process and clean web content for LLM consumption'
    ],
    configExample: {
      command: 'npx',
      args: ['-y', '@modelcontextprotocol/server-fetch']
    }
  },
  {
    id: 'filesystem',
    name: 'Filesystem',
    description: 'Secure file operations with configurable access controls',
    category: 'File Operations',
    installation: {
      npm: 'npx -y @modelcontextprotocol/server-filesystem /path/to/allowed/files',
      docker: 'docker run -i -v /path/to/allowed/files:/files --rm mcp/filesystem /files'
    },
    capabilities: [
      'Read and write files',
      'List directory contents',
      'Search file content',
      'Create and delete files and directories'
    ],
    configExample: {
      command: 'npx',
      args: ['-y', '@modelcontextprotocol/server-filesystem', '/path/to/allowed/files']
    }
  },
  {
    id: 'git',
    name: 'Git',
    description: 'Tools to read, search, and manipulate Git repositories',
    category: 'Development',
    installation: {
      npm: 'npm install -g mcp-server-git && mcp-server-git --repository /path/to/repo',
      uvx: 'uvx mcp-server-git --repository /path/to/repo'
    },
    capabilities: [
      'Clone repositories',
      'View commit history',
      'Create branches and commits',
      'Search code in repositories',
      'Initialize new repositories'
    ],
    configExample: {
      command: 'uvx',
      args: ['mcp-server-git', '--repository', '/path/to/git/repo']
    }
  },
  {
    id: 'github',
    name: 'GitHub',
    description: 'Repository management, file operations, and GitHub API integration',
    category: 'Development',
    installation: {
      npm: 'npx -y @modelcontextprotocol/server-github',
      docker: 'docker run -i --rm mcp/github'
    },
    capabilities: [
      'Access GitHub repositories',
      'Create and manage pull requests',
      'View and edit repository files',
      'Manage issues and comments'
    ],
    configExample: {
      command: 'npx',
      args: ['-y', '@modelcontextprotocol/server-github'],
      env: {
        'GITHUB_PERSONAL_ACCESS_TOKEN': '<YOUR_TOKEN>'
      }
    }
  },
  {
    id: 'gitlab',
    name: 'GitLab',
    description: 'GitLab API, enabling project management',
    category: 'Development',
    installation: {
      npm: 'npx -y @modelcontextprotocol/server-gitlab',
      docker: 'docker run -i --rm mcp/gitlab'
    },
    capabilities: [
      'Access GitLab projects',
      'Create and manage merge requests',
      'View and edit repository files',
      'Manage issues and comments'
    ],
    configExample: {
      command: 'npx',
      args: ['-y', '@modelcontextprotocol/server-gitlab'],
      env: {
        'GITLAB_PERSONAL_ACCESS_TOKEN': '<YOUR_TOKEN>'
      }
    }
  },
  {
    id: 'gdrive',
    name: 'Google Drive',
    description: 'File access and search capabilities for Google Drive',
    category: 'File Operations',
    installation: {
      npm: 'npx -y @modelcontextprotocol/server-gdrive',
      docker: 'docker run -i -v ~/.config/google:/root/.config/google --rm mcp/gdrive'
    },
    capabilities: [
      'List files and folders in Google Drive',
      'Search for files by name or content',
      'Download and read file content',
      'Create new files and folders'
    ],
    configExample: {
      command: 'npx',
      args: ['-y', '@modelcontextprotocol/server-gdrive'],
      env: {
        'GDRIVE_CREDENTIALS_PATH': '/path/to/credentials.json'
      }
    }
  },
  {
    id: 'google-maps',
    name: 'Google Maps',
    description: 'Location services, directions, and place details',
    category: 'Location',
    installation: {
      npm: 'npx -y @modelcontextprotocol/server-google-maps',
      docker: 'docker run -i --rm mcp/google-maps'
    },
    capabilities: [
      'Search for places',
      'Get directions between locations',
      'Get detailed place information',
      'Calculate distances and travel times'
    ],
    configExample: {
      command: 'npx',
      args: ['-y', '@modelcontextprotocol/server-google-maps'],
      env: {
        'GOOGLE_MAPS_API_KEY': '<YOUR_GOOGLE_MAPS_API_KEY>'
      }
    }
  },
  {
    id: 'memory',
    name: 'Memory',
    description: 'Knowledge graph-based persistent memory system',
    category: 'Cognitive',
    installation: {
      npm: 'npx -y @modelcontextprotocol/server-memory',
      docker: 'docker run -i -v claude-memory:/app/dist --rm mcp/memory'
    },
    capabilities: [
      'Create and manage entities in a knowledge graph',
      'Create relations between entities',
      'Add observations to entities',
      'Search the knowledge graph',
      'Persistent memory across sessions'
    ],
    configExample: {
      command: 'npx',
      args: ['-y', '@modelcontextprotocol/server-memory'],
      env: {
        'MEMORY_FILE_PATH': '/path/to/custom/memory.json'
      }
    },
    tools: [
      {
        name: 'create_entities',
        description: 'Create multiple new entities in the knowledge graph',
        params: [
          {
            name: 'entities',
            type: 'array',
            description: 'Array of entity objects with name, entityType, and observations'
          }
        ]
      },
      {
        name: 'create_relations',
        description: 'Create multiple new relations between entities',
        params: [
          {
            name: 'relations',
            type: 'array',
            description: 'Array of relation objects with from, to, and relationType'
          }
        ]
      },
      {
        name: 'add_observations',
        description: 'Add new observations to existing entities',
        params: [
          {
            name: 'observations',
            type: 'array',
            description: 'Array of objects with entityName and contents (observations)'
          }
        ]
      },
      {
        name: 'delete_entities',
        description: 'Remove entities and their relations',
        params: [
          {
            name: 'entityNames',
            type: 'array',
            description: 'Array of entity names to delete'
          }
        ]
      },
      {
        name: 'delete_observations',
        description: 'Remove specific observations from entities',
        params: [
          {
            name: 'deletions',
            type: 'array',
            description: 'Array of objects with entityName and observations to delete'
          }
        ]
      },
      {
        name: 'delete_relations',
        description: 'Remove specific relations from the graph',
        params: [
          {
            name: 'relations',
            type: 'array',
            description: 'Array of relation objects with from, to, and relationType'
          }
        ]
      },
      {
        name: 'read_graph',
        description: 'Read the entire knowledge graph',
        params: []
      },
      {
        name: 'search_nodes',
        description: 'Search for nodes based on query',
        params: [
          {
            name: 'query',
            type: 'string',
            description: 'Search query to find matching entities and their relations'
          }
        ]
      },
      {
        name: 'open_nodes',
        description: 'Retrieve specific nodes by name',
        params: [
          {
            name: 'names',
            type: 'array',
            description: 'Array of entity names to retrieve'
          }
        ]
      }
    ]
  },
  {
    id: 'postgres',
    name: 'PostgreSQL',
    description: 'Read-only database access with schema inspection',
    category: 'Database',
    installation: {
      npm: 'npx -y @modelcontextprotocol/server-postgres postgresql://username:password@localhost/mydb',
      docker: 'docker run -i --rm mcp/postgres postgresql://username:password@localhost/mydb'
    },
    capabilities: [
      'Execute SQL queries',
      'Inspect database schema',
      'View table structures',
      'Analyze query results'
    ],
    configExample: {
      command: 'npx',
      args: ['-y', '@modelcontextprotocol/server-postgres', 'postgresql://localhost/mydb']
    }
  },
  {
    id: 'puppeteer',
    name: 'Puppeteer',
    description: 'Browser automation and web scraping',
    category: 'Web Integration',
    installation: {
      npm: 'npx -y @modelcontextprotocol/server-puppeteer',
      docker: 'docker run -i --rm mcp/puppeteer'
    },
    capabilities: [
      'Navigate to web pages',
      'Take screenshots',
      'Extract text and data from websites',
      'Submit forms and interact with web elements'
    ],
    configExample: {
      command: 'npx',
      args: ['-y', '@modelcontextprotocol/server-puppeteer']
    }
  },
  {
    id: 'redis',
    name: 'Redis',
    description: 'Redis database operations and caching',
    category: 'Database',
    installation: {
      npm: 'npx -y @modelcontextprotocol/server-redis',
      docker: 'docker run -i --rm mcp/redis'
    },
    capabilities: [
      'Store and retrieve key-value data',
      'Manage data expiration',
      'Pattern-based key listing',
      'Support for various Redis data types'
    ],
    configExample: {
      command: 'npx',
      args: ['-y', '@modelcontextprotocol/server-redis'],
      env: {
        'REDIS_URL': 'redis://localhost:6379'
      }
    }
  },
  {
    id: 'sentry',
    name: 'Sentry',
    description: 'Retrieving and analyzing issues from Sentry.io',
    category: 'Development',
    installation: {
      npm: 'pip install mcp-server-sentry && python -m mcp_server_sentry',
      uvx: 'uvx mcp-server-sentry'
    },
    capabilities: [
      'View error reports and exceptions',
      'Search for specific issues',
      'Analyze error trends',
      'Get issue details and stack traces'
    ],
    configExample: {
      command: 'uvx',
      args: ['mcp-server-sentry'],
      env: {
        'SENTRY_AUTH_TOKEN': '<YOUR_SENTRY_AUTH_TOKEN>',
        'SENTRY_ORG': '<YOUR_SENTRY_ORG>'
      }
    }
  },
  {
    id: 'sequentialthinking',
    name: 'Sequential Thinking',
    description: 'Dynamic and reflective problem-solving through thought sequences',
    category: 'Cognitive',
    installation: {
      npm: 'npx -y @modelcontextprotocol/server-sequentialthinking',
      docker: 'docker run -i --rm mcp/sequentialthinking'
    },
    capabilities: [
      'Break down complex problems',
      'Create structured thought sequences',
      'Review and refine reasoning',
      'Generate step-by-step solutions'
    ],
    configExample: {
      command: 'npx',
      args: ['-y', '@modelcontextprotocol/server-sequentialthinking']
    }
  },
  {
    id: 'slack',
    name: 'Slack',
    description: 'Channel management and messaging capabilities',
    category: 'Communication',
    installation: {
      npm: 'npx -y @modelcontextprotocol/server-slack',
      docker: 'docker run -i --rm mcp/slack'
    },
    capabilities: [
      'Send and read messages',
      'List channels and users',
      'Search message history',
      'Upload files and attachments'
    ],
    configExample: {
      command: 'npx',
      args: ['-y', '@modelcontextprotocol/server-slack'],
      env: {
        'SLACK_TOKEN': '<YOUR_SLACK_TOKEN>'
      }
    }
  },
  {
    id: 'sqlite',
    name: 'SQLite',
    description: 'Database interaction and business intelligence capabilities',
    category: 'Database',
    installation: {
      npm: 'pip install mcp-server-sqlite && python -m mcp_server_sqlite',
      uvx: 'uvx mcp-server-sqlite'
    },
    capabilities: [
      'Execute SQL queries',
      'View database schema',
      'Analyze query results',
      'Create and modify database structure'
    ],
    configExample: {
      command: 'uvx',
      args: ['mcp-server-sqlite', '/path/to/database.db']
    }
  },
  {
    id: 'time',
    name: 'Time',
    description: 'Time and timezone conversion capabilities',
    category: 'Utility',
    installation: {
      npm: 'pip install mcp-server-time && python -m mcp_server_time',
      uvx: 'uvx mcp-server-time'
    },
    capabilities: [
      'Get current time in different timezones',
      'Convert between timezones',
      'Format dates and times',
      'Calculate time differences'
    ],
    configExample: {
      command: 'uvx',
      args: ['mcp-server-time']
    }
  }
];

/**
 * Third-party Official MCP Integrations
 * These are maintained by companies building production ready MCP servers for their platforms.
 */
export const ThirdPartyMCPServers: Partial<MCPServer>[] = [
  {
    id: '21st-dev-magic',
    name: '21st.dev Magic',
    description: 'Create crafted UI components inspired by the best 21st.dev design engineers',
    category: 'Design',
    url: 'https://github.com/21st-dev/magic-mcp'
  },
  {
    id: 'apify',
    name: 'Apify',
    description: 'Use 3,000+ pre-built cloud tools to extract data from websites, e-commerce, social media, search engines, maps, and more',
    category: 'Data Extraction',
    url: 'https://github.com/apify/actors-mcp-server'
  },
  {
    id: 'axiom',
    name: 'Axiom',
    description: 'Query and analyze your Axiom logs, traces, and all other event data in natural language',
    category: 'Analytics',
    url: 'https://github.com/axiomhq/mcp-server-axiom'
  },
  {
    id: 'browserbase',
    name: 'Browserbase',
    description: 'Automate browser interactions in the cloud (e.g. web navigation, data extraction, form filling, and more)',
    category: 'Web Automation',
    url: 'https://github.com/browserbase/mcp-server-browserbase'
  },
  {
    id: 'cloudflare',
    name: 'Cloudflare',
    description: 'Deploy, configure & interrogate your resources on the Cloudflare developer platform (e.g. Workers/KV/R2/D1)',
    category: 'Cloud Infrastructure',
    url: 'https://github.com/cloudflare/mcp-server-cloudflare'
  },
  {
    id: 'e2b',
    name: 'E2B',
    description: 'Run code in secure sandboxes hosted by E2B',
    category: 'Development',
    url: 'https://github.com/e2b-dev/mcp-server'
  },
  {
    id: 'esignatures',
    name: 'eSignatures',
    description: 'Contract and template management for drafting, reviewing, and sending binding contracts',
    category: 'Business',
    url: 'https://github.com/esignaturescom/mcp-server-esignatures'
  },
  {
    id: 'exa',
    name: 'Exa',
    description: 'Search Engine made for AIs by Exa',
    category: 'Search',
    url: 'https://github.com/exa-labs/exa-mcp-server'
  },
  {
    id: 'firecrawl',
    name: 'Firecrawl',
    description: 'Extract web data with Firecrawl',
    category: 'Web Scraping',
    url: 'https://github.com/mendableai/firecrawl-mcp-server'
  },
  {
    id: 'fireproof',
    name: 'Fireproof',
    description: 'Immutable ledger database with live synchronization',
    category: 'Database',
    url: 'https://github.com/fireproof-storage/mcp-database-server'
  },
  {
    id: 'grafana',
    name: 'Grafana',
    description: 'Search dashboards, investigate incidents and query datasources in your Grafana instance',
    category: 'Analytics',
    url: 'https://github.com/grafana/mcp-grafana'
  },
  {
    id: 'kagi-search',
    name: 'Kagi Search',
    description: 'Search the web using Kagi\'s search API',
    category: 'Search',
    url: 'https://github.com/kagisearch/kagimcp'
  }
]; 