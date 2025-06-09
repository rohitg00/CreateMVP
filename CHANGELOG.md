# Changelog

## v2.0.0 - Self-Hosted Open Source Version

### Major Changes
- **Removed Payment System**: Completely removed Stripe/Polar payment integration
- **Removed Credit System**: No more credit limits or usage restrictions
- **Removed Subscriptions**: No subscription management or billing
- **Database Migration**: Switched from PostgreSQL/Neon to local SQLite
- **Simplified Authentication**: Basic username/password auth only

### Features Added
- ✅ Unlimited MVP generation
- ✅ Local SQLite database storage
- ✅ Multiple LLM provider support (OpenAI, Anthropic, Google, DeepSeek)
- ✅ Docker support for easy deployment
- ✅ Self-hosted privacy-focused design

### Features Removed
- ❌ Payment processing
- ❌ Credit tracking and limits
- ❌ Subscription management
- ❌ Complex OAuth authentication
- ❌ External database dependencies
- ❌ Usage analytics and tracking

### Technical Changes
- Migrated from PostgreSQL to SQLite with better-sqlite3
- Updated Drizzle ORM configuration for SQLite
- Simplified database schema (removed subscriptions, credits)
- Removed Neon database dependencies
- Updated environment variables for local development
- Simplified user management and authentication

### Breaking Changes
- Environment variables changed (DATABASE_URL → DATABASE_PATH)
- Database schema simplified (no backward compatibility)
- Authentication system simplified
- API endpoints for payments/subscriptions removed

### Migration Guide
1. Update environment variables in `.env`
2. Run `npm run db:generate` and `npm run db:migrate`
3. Remove old payment-related environment variables
4. Add LLM provider API keys

### Dependencies
- Added: better-sqlite3, drizzle-orm/better-sqlite3
- Removed: @neondatabase/serverless, @polar-sh/sdk, stripe
- Updated: drizzle-kit configuration for SQLite
