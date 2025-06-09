import express from 'express';
import http from 'http';
import { log, setupVite, serveStatic } from './vite';
import { storage } from './storage';
import { runMigrations } from './db';
import { registerRoutes } from './routes';
// Temporarily commenting out to debug
// import checkoutRoutes from './routes/checkout';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';

// Load environment variables
dotenv.config();

// Initialize the Express app
const app = express();
const server = http.createServer(app);

// Set longer timeouts for HTTP server to handle long-running requests
server.timeout = 600000; // 10 minutes
server.keepAliveTimeout = 620000; // slightly longer than timeout

// Critical: Set trust proxy for Replit environment
// This is essential for cookies to work
app.set('trust proxy', 1);

// Parse cookies
app.use(cookieParser());

// Debug middleware - log all requests and cookies
app.use((req, res, next) => {
  if (req.path.startsWith('/api/')) {
    console.log(`DEBUG [${req.method}] ${req.path}`);
    console.log('Request cookies:', req.cookies);
    console.log('Request signed cookies:', req.signedCookies);
    console.log('Request headers:', {
      cookie: req.headers.cookie,
      origin: req.headers.origin,
      host: req.headers.host,
      'user-agent': req.headers['user-agent']
    });
  }
  next();
});

// Enable CORS with credentials - must come after cookieParser
app.use(cors({
  origin: function(origin, callback) {
    // Allow requests with no origin (like mobile apps, curl, etc)
    if (!origin) return callback(null, true);
    
    // Define allowed origins patterns - be more permissive for OAuth flows
    const allowedDomains = [
      // Replit domains
      /\.replit\.app$/, 
      /\.replit\.dev$/,
      /\.repl\.co$/,
      /^https:\/\/[a-z0-9\-]+\.[a-z0-9\-]+\.sisko\.replit\.dev$/,
      
      // Production domains
      /^https:\/\/createmvps\.app$/,
      /^https:\/\/www\.createmvps\.app$/,
      
      // Development domains
      /^http:\/\/localhost/,
      /^http:\/\/127\.0\.0\.1/,
      
      // OAuth providers - allow redirects during authentication flows
      /^https:\/\/accounts\.google\.com/,
      /^https:\/\/github\.com/,
      /^https:\/\/api\.github\.com/,
      /^https:\/\/twitter\.com/,
      /^https:\/\/api\.twitter\.com/,
      /^https:\/\/appleid\.apple\.com/,
    ];
    
    // Check if the origin matches any allowed pattern
    const allowed = allowedDomains.some(pattern => pattern.test(origin));
    
    if (allowed) {
      // Return the specific origin rather than a wildcard for CORS
      callback(null, origin);
    } else {
      console.warn(`CORS blocked request from origin: ${origin}`);
      callback(null, false);
    }
  },
  credentials: true, // Important: needed for cookies and auth
  methods: ['GET', 'PUT', 'POST', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization', 'Cookie'],
  exposedHeaders: ['Set-Cookie'] // Case matters here - use Set-Cookie, not set-cookie
}));

// Add CORS headers manually for all responses as a fallback
app.use((req, res, next) => {
  // Special handling for preflight OPTIONS requests
  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Credentials', 'true');
    
    // Use the origin from the request if available
    const origin = req.headers.origin;
    if (origin) {
      res.header('Access-Control-Allow-Origin', origin);
    } else {
      // Default to the host if no origin header
      const host = req.headers.host;
      if (host) {
        const protocol = req.secure || req.headers['x-forwarded-proto'] === 'https' ? 'https' : 'http';
        res.header('Access-Control-Allow-Origin', `${protocol}://${host}`);
      }
    }
    
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin,X-Requested-With,Content-Type,Accept,Authorization,Cookie');
    res.header('Access-Control-Expose-Headers', 'Set-Cookie');
    res.header('Access-Control-Max-Age', '86400'); // 24 hours
    
    // End preflight request with 204 No Content
    return res.status(204).end();
  }
  
  // Handle normal requests
  const origin = req.headers.origin;
  res.header('Access-Control-Allow-Credentials', 'true');
  
  if (origin) {
    // When we know the origin, use it instead of wildcard
    res.header('Access-Control-Allow-Origin', origin);
  } else {
    // If no origin is provided (like curl requests or server-to-server)
    // Default to the host being used
    const host = req.headers.host;
    if (host) {
      const protocol = req.secure || req.headers['x-forwarded-proto'] === 'https' ? 'https' : 'http';
      res.header('Access-Control-Allow-Origin', `${protocol}://${host}`);
    }
  }
  
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin,X-Requested-With,Content-Type,Accept,Authorization,Cookie');
  res.header('Access-Control-Expose-Headers', 'Set-Cookie');
  next();
});

// Parse JSON bodies
app.use(express.json());

/* Temporarily commenting out the checkout routes to debug server startup
app.use('/api/checkout', checkoutRoutes);

// For backward compatibility with old routes
app.use('/api/subscription/checkout', (req, res) => {
  console.log('[API] Legacy route /api/subscription/checkout accessed, forwarding to /api/checkout');
  req.url = '/';  // Reset URL path for the forwarded route
  checkoutRoutes(req, res);
});
*/

/**
 * Initialize the server
 */
async function initialize() {
  try {
    log('Starting server initialization...');
    
    // Run database migrations
    await runMigrations();
    log('Database migrations completed');
    
    log('Using simplified authentication');
    
    // Register API routes
    await registerRoutes(app);
    log('API routes registered');
    
    // Initialize system API keys
    await initializeSystemApiKeys();
    log('System API keys initialized');
    
    // Setup Vite in development mode
    if (process.env.NODE_ENV !== 'production') {
      await setupVite(app, server);
      log('Vite development server initialized');
    } else {
      // Serve static files in production
      serveStatic(app);
      log('Static file serving initialized');
    }
    
    // Start the server
    const PORT = parseInt(process.env.PORT || '5001', 10);
    server.listen(PORT, '0.0.0.0', () => {
      log(`Server listening on port ${PORT}`);
    });
  } catch (error) {
    console.error('Server initialization error:', error);
    process.exit(1);
  }
}

/**
 * Initialize system API keys
 */
async function initializeSystemApiKeys() {
  try {
    log('Initializing system API keys');
    
    // Create or get system user
    let systemUser = await storage.getUserByEmail('system@example.com');
    
    if (!systemUser) {
      systemUser = await storage.createUser({
        username: 'system',
        email: 'system@example.com',
        firstName: 'System',
        lastName: 'User',
      });
      log('Created system user');
    }
    
    // Define providers we need system API keys for
    const providers = ['openai', 'anthropic', 'google'];
    
    // Create system API keys using real environment variables for self-hosted version
    for (const provider of providers) {
      const existingKey = await storage.getApiKeyByProvider(systemUser.id, provider);
      
      if (!existingKey) {
        let apiKey = '';
        if (provider === 'openai') {
          apiKey = process.env.OPENAI_API_KEY || `system-${provider}-placeholder-key`;
        } else if (provider === 'anthropic') {
          apiKey = process.env.ANTHROPIC_API_KEY || `system-${provider}-placeholder-key`;
        } else if (provider === 'google') {
          apiKey = process.env.GOOGLE_API_KEY || process.env.GEMINI_API_KEY || `system-${provider}-placeholder-key`;
        }
        
        await storage.createApiKey({
          userId: systemUser.id,
          provider,
          key: apiKey,
          isUserProvided: false,
        });
        
        if (apiKey.startsWith('system-')) {
          log(`Created placeholder system API key for ${provider} (no environment variable found)`);
        } else {
          log(`Created system API key for ${provider} from environment variable`);
        }
      }
    }
    
    log('System API keys initialized successfully');
  } catch (error) {
    console.error('Error initializing system API keys:', error);
  }
}

// Start the server
initialize();
