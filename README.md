# CreateMVP

A full-stack AI application for generating project prototypes and implementation plans.

[![Watch the demo video](https://img.youtube.com/vi/Kgy-Mbw0Elo/0.jpg)](https://www.youtube.com/watch?v=Kgy-Mbw0Elo)

[Watch the demo video](https://www.youtube.com/watch?v=Kgy-Mbw0Elo)

## What the Platform Delivers

- **AI Plan Generator** – Using latest Gemini 2.5 Pro model which ranks `#1` on [LMarena](https://lmarena.ai/), Accepts a short requirements brief or a PDF; outputs a complete implementation bundle (technical spec, architecture, user‑flow diagram links, task breakdown, and a polished PRD).
- **Multimodel Chat Console** – One pane to converse with GPT‑4.1, Claude 3.7 Sonnet, Gemini 2.5 Pro and other public as well as open source large models, keys stay local.
- **AI Tool Comparison Hub** – Curated cards for 100+ dev‑centric AI tools to accelerate due‑diligence.
- **MCP Servers & Rule Packs** – One‑click copies of community‑maintained server endpoints plus Cursor & Windsurf rules to supercharge IDE workflows.
- **Open‑source PRD Creator** – Apache‑licensed codebase; self‑host or fork without restrictions.

## Key Benefits

- ✅ **Super Fast Generation**: Turn your idea into a detailed plan in minutes.
- 📈 **Massive Detail Boost**: Our generated plans are now 4x more detailed & optimized (~40KB+ vs 11KB previous). Give AI the context it craves!
- 👀 **Instant In-UI Preview**: View your full plan files directly in the browser.
- 🔐 **Easy Access**: Log in securely with Google, GitHub, Replit.
- 🧠 **Premium AI Chat**: Better conversations and insights with top AI models built-in.
- 🚀 **Enhanced UI**: A smoother, faster planning experience.

## Features

- Multi-model AI integration (OpenAI, Anthropic, Google, etc.)
- Project requirements analysis
- Automatic generation of implementation docs:
  - Requirements documents
  - PRDs
  - Tech stack recommendations
  - Frontend and backend implementation guides
  - System flow documentation
  - Project status templates
- PDF upload for extracting requirements
- API key management for multiple AI providers

## Tech Stack

- **Frontend**: React, TypeScript, Tailwind CSS, Shadcn UI
- **Backend**: Express.js, TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **AI Integration**: OpenAI, Anthropic, Google, and more

## Getting Started

### Prerequisites

- Node.js (v20+)
- PostgreSQL database

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/rohitg00/createmvp.git
   cd createmvp
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory with the following variables:
   ```
   # Database
   DATABASE_URL=postgresql://username:password@localhost:5432/your_database
   
   # Environment (development, production)
   NODE_ENV=development
   
   # Port (optional, defaults to 5000)
   PORT=5000
   
   # AI API Keys (add any you want to use)
   OPENAI_API_KEY=your_openai_api_key
   ANTHROPIC_API_KEY=your_anthropic_api_key
   GOOGLE_API_KEY=your_google_api_key
   # Add other API keys as needed
   ```

4. Set up the database:
   ```bash
   npm run db:push
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

6. Open [http://localhost:5000](http://localhost:5000) in your browser.

## Production Deployment

1. Build the application:
   ```bash
   npm run build
   ```

2. Start the production server:
   ```bash
   npm run start
   ```

## Setting Up Supabase (Alternative Database Option)

This project can use Supabase as an alternative to a local PostgreSQL database:

1. Create a Supabase account at [supabase.com](https://supabase.com)
2. Create a new project
3. Get your connection string from the project settings
4. Update your `.env` file:
   ```
   DATABASE_URL=your_supabase_connection_string
   ```

## API Key Management

The application supports multiple AI providers. To use them, add your API keys to the `.env` file as shown above.

## Database Schema

The application uses the following tables:
- `api_keys`: Storage for AI provider API keys
- `chat_messages`: History of chat interactions

## Contributing

We welcome contributions to CreateMVP! Here's how you can contribute:

### General Contributions

1. Fork the repository
2. Create a new branch for your feature (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Contributing MCP Servers

The Model Context Protocol (MCP) is an open standard that allows AI assistants to interact with external tools and data sources. You can contribute new MCP servers to our repository:

1. Create a new file in `client/src/pages/mcp/your-server-name.tsx`
2. Use our template structure below for consistency
3. Add your server to the list in `client/src/pages/mcp-rules.tsx`

#### MCP Server Template

```tsx
import React from "react";
import { MCPServerTemplate } from "./template";

export default function YourServerNameMCP() {
  // Instructions for obtaining API key (if needed)
  const apiKeyInstructions = (
    <>
      <p className="mb-3">To use this MCP server, you'll need an API key:</p>
      <ol className="list-decimal pl-5 mb-4 space-y-2">
        <li>Step 1 of getting the key</li>
        <li>Step 2 of getting the key</li>
      </ol>
    </>
  );

  return (
    <MCPServerTemplate
      name="Your Server Name"
      description="Brief description of what your server does"
      githubUrl="https://github.com/yourusername/your-repo"
      websiteUrl="https://your-website.com"
      logo="https://example.com/logo.png"
      npmCommand="npx @your-org/your-server"
      dockerCommand="docker run -i your-org/your-server"
      apiKeyName="API Key Name" // if applicable
      apiKeyInstructions={apiKeyInstructions} // if applicable
      features={[
        "Feature 1 description",
        "Feature 2 description",
        "Feature 3 description"
      ]}
      examples={[
        "Example command 1",
        "Example command 2"
      ]}
    />
  );
}
```

### Contributing Windsurf/Cursor Rules

Windsurf and Cursor rules help AI assistants understand how to work with codebases. To contribute:

1. Create a new file in `client/src/pages/windsurf-rules/` or `client/src/pages/cursor-rules/`
2. Follow this template:

```tsx
import React from "react";

export default function YourRuleName() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold text-white mb-6">Your Rule Name</h1>
      
      <div className="bg-slate-800 rounded-lg p-6 mb-8">
        <h2 className="text-xl font-semibold text-white mb-4">Description</h2>
        <p className="text-slate-300 mb-4">
          Describe what your rule does and why it's useful.
        </p>
        
        <h2 className="text-xl font-semibold text-white mb-4">Rule Definition</h2>
        <pre className="bg-slate-900 p-4 rounded-md text-slate-300 overflow-auto mb-6">
          {`# Your Rule Name
          
# Rule content goes here - this will be parsed by AI assistants
# Explain how to use the codebase, conventions, or other guidance

## Section 1
- Guidelines
- Conventions

## Section 2
- More information
`}
        </pre>
        
        <h2 className="text-xl font-semibold text-white mb-4">Usage Examples</h2>
        <p className="text-slate-300 mb-2">Example 1: Brief description</p>
        <p className="text-slate-300 mb-4">Example 2: Brief description</p>
      </div>
    </div>
  );
}
```

## License

This project is licensed under the [Apache 2.0 License](LICENSE).
