# CreateMVP Self-Hosted Setup Guide

This guide will help you set up CreateMVP as a self-hosted application with unlimited usage and local SQLite storage.

## Prerequisites

- Node.js 18 or higher
- npm, yarn, or pnpm
- Git

## Quick Setup

1. **Clone and install**
   ```bash
   git clone https://github.com/rohitg00/createmvp.git
   cd createmvp
   npm install
   ```

2. **Configure environment**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` with your LLM provider API keys:
   ```env
   SESSION_SECRET="your-secure-random-string"
   DATABASE_PATH="./data/app.db"
   
   # Add at least one LLM provider
   OPENAI_API_KEY="sk-..."
   ANTHROPIC_API_KEY="sk-ant-..."
   GOOGLE_API_KEY="AIza..."
   ```

3. **Initialize database**
   ```bash
   npm run db:generate
   npm run db:migrate
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Access the application**
   Open http://localhost:3000 in your browser

## LLM Provider Setup

### OpenAI
- Get API key: https://platform.openai.com/api-keys
- Add to .env: `OPENAI_API_KEY="sk-..."`

### Anthropic (Claude)
- Get API key: https://console.anthropic.com/
- Add to .env: `ANTHROPIC_API_KEY="sk-ant-..."`

### Google (Gemini)
- Get API key: https://makersuite.google.com/app/apikey
- Add to .env: `GOOGLE_API_KEY="AIza..."`

### DeepSeek
- Get API key: https://platform.deepseek.com/
- Add to .env: `DEEPSEEK_API_KEY="sk-..."`

## Production Deployment

### Docker
```bash
docker build -t createmvp .
docker run -d -p 3000:3000 -v $(pwd)/data:/app/data createmvp
```

### Manual
```bash
npm run build
npm start
```

## Features

- ✅ Unlimited MVP generation
- ✅ Multiple LLM providers
- ✅ Local SQLite database
- ✅ No payment/subscription requirements
- ✅ Complete privacy (data stays local)
- ✅ Easy self-hosting

## Troubleshooting

- **Database errors**: Ensure `./data/` directory is writable
- **API errors**: Verify your LLM provider API keys
- **Port conflicts**: Change PORT environment variable

For more help, see the main README.md file.
