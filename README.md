# [CreateMVP](https://createmvps.app)

A full-stack AI application for generating project prototypes and implementation plans.

![CreateMVP Files](client/public/createmvp-files.png)

## Demo Video
[![Watch the demo video](https://img.youtube.com/vi/Kgy-Mbw0Elo/0.jpg)](https://www.youtube.com/watch?v=Kgy-Mbw0Elo)

## Our latest featured Demo
[![Our latest conference talk](https://img.youtube.com/vi/A7OV2rOIp2Y/0.jpg)](https://www.youtube.com/watch?v=A7OV2rOIp2Y)

## CreateMVP - Self-Hosted Open Source Version

A simplified, self-hosted version of CreateMVP that generates comprehensive MVP implementation plans using multiple LLM providers.

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

## Self-Hosted Features

- **Unlimited MVP Generation**: No credit limits or payment requirements
- **Multiple LLM Providers**: Support for OpenAI, Anthropic, Google, DeepSeek, and more
- **Local SQLite Database**: All data stored locally for privacy
- **Simple Authentication**: Basic username/password authentication
- **Export Options**: Download generated plans in multiple formats
- **Self-Hosted**: Run entirely on your own infrastructure

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

## Quick Start

### Prerequisites

- Node.js 18+ and npm/pnpm/yarn
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/rohitg00/createmvp.git
   cd createmvp
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   pnpm install
   # or
   yarn install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and add your LLM provider API keys:
   ```env
   # Database (SQLite)
   DATABASE_PATH="./data/app.db"
   
   # Session Secret (generate a secure random string)
   SESSION_SECRET="your-secure-session-secret-here"
   
   # LLM Provider API Keys (add the ones you want to use)
   OPENAI_API_KEY="your-openai-api-key"
   ANTHROPIC_API_KEY="your-anthropic-api-key"
   GOOGLE_API_KEY="your-google-api-key"
   DEEPSEEK_API_KEY="your-deepseek-api-key"
   
   # Email (optional, for notifications)
   RESEND_API_KEY="your-resend-api-key"
   EMAIL_FROM="CreateMVP <noreply@yourdomain.com>"
   ```

4. **Initialize the database**
   ```bash
   npm run db:generate
   npm run db:migrate
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Access the application**
   Open your browser and navigate to `http://localhost:5001`

## LLM Provider Setup

### OpenAI
1. Get your API key from [OpenAI Platform](https://platform.openai.com/api-keys)
2. Add to `.env`: `OPENAI_API_KEY="sk-..."`

### Anthropic (Claude)
1. Get your API key from [Anthropic Console](https://console.anthropic.com/)
2. Add to `.env`: `ANTHROPIC_API_KEY="sk-ant-..."`

### Google (Gemini)
1. Get your API key from [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Add to `.env`: `GOOGLE_API_KEY="AIza..."`

### DeepSeek
1. Get your API key from [DeepSeek Platform](https://platform.deepseek.com/)
2. Add to `.env`: `DEEPSEEK_API_KEY="sk-..."`

## Database Management

The application uses SQLite for local data storage. Database files are stored in the `./data/` directory.

### Database Commands

```bash
# Generate database schema
npm run db:generate

# Run migrations
npm run db:migrate

# View database (optional)
npm run db:studio
```

### Backup Your Data

To backup your data, simply copy the `./data/` directory:

```bash
cp -r ./data/ ./backup-$(date +%Y%m%d)/
```

## Production Deployment

### Using Docker

1. **Build the Docker image**
   ```bash
   docker build -t createmvp .
   ```

2. **Run the container**
   ```bash
   docker run -d \
     --name createmvp \
     -p 3000:3000 \
     -v $(pwd)/data:/app/data \
     -v $(pwd)/.env:/app/.env \
     createmvp
   ```

### Manual Deployment

1. **Build the application**
   ```bash
   npm run build
   ```

2. **Start the production server**
   ```bash
   npm start
   ```

### Environment Variables for Production

```env
NODE_ENV=production
PORT=3000
DATABASE_PATH="./data/app.db"
SESSION_SECRET="your-very-secure-session-secret"
# ... other API keys
```

## Usage

1. **Create an Account**: Register with a username and password
2. **Configure API Keys**: Add your LLM provider API keys in the settings
3. **Generate MVP Plans**: Describe your project idea and get comprehensive implementation plans
4. **Export Results**: Download your generated plans in various formats

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user

### MVP Generation
- `POST /api/generate-plan` - Generate a new MVP plan
- `GET /api/plans` - Get user's generated plans

### API Keys
- `GET /api/api-keys` - Get user's API keys
- `POST /api/api-keys` - Add/update API key
- `DELETE /api/api-keys/:id` - Delete API key

## Development

### Project Structure

```
createmvp/
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── pages/         # Page components
│   │   └── lib/           # Utilities and hooks
├── server/                # Backend Express application
│   ├── routes.ts          # API routes
│   ├── auth.ts           # Authentication logic
│   ├── storage.ts        # Database operations
│   └── db.ts             # Database configuration
├── shared/               # Shared types and schemas
│   └── schema.ts         # Database schema
└── migrations/           # Database migrations
```

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run db:generate  # Generate database schema
npm run db:migrate   # Run database migrations
npm run db:studio    # Open database studio
npm run lint         # Run linter
npm run type-check   # Run TypeScript type checking
```

## Troubleshooting

### Common Issues

1. **Database connection errors**
   - Ensure the `./data/` directory exists and is writable
   - Check that `DATABASE_PATH` in `.env` is correct

2. **LLM API errors**
   - Verify your API keys are correct and have sufficient credits
   - Check that the API keys have the necessary permissions

3. **Port already in use**
   - Change the `PORT` environment variable to use a different port
   - Kill any existing processes using the port

### Logs

Application logs are written to the console. In production, consider using a process manager like PM2 to manage logs:

```bash
npm install -g pm2
pm2 start npm --name "createmvp" -- start
pm2 logs createmvp
```

## Contributing

This is an open-source project. Contributions are welcome!

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## Differences from SaaS Version

This self-hosted version removes:
- Payment processing and subscriptions
- Credit limits and usage tracking
- Complex authentication providers
- External database dependencies
- Analytics and tracking (optional)

And adds:
- Local SQLite database
- Simplified user management
- Unlimited usage
- Privacy-focused design
- Easy self-hosting

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

