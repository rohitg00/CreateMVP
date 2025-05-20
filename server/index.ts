import 'dotenv/config';
import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import router from "./routes/generate-plan";
import { storage } from "./storage";

// Function to initialize system API keys
async function initializeSystemApiKeys() {
  // System user ID for API keys (admin user)
  const SYSTEM_USER_ID = 1;
  
  // Check for environment variables with API keys
  const systemKeys = [
    { provider: "openai", envVar: "OPENAI_API_KEY" },
    { provider: "google", envVar: "GOOGLE_API_KEY" },
    { provider: "anthropic", envVar: "ANTHROPIC_API_KEY" },
    { provider: "deepseek", envVar: "DEEPSEEK_API_KEY" },
    { provider: "meta", envVar: "META_API_KEY" },
    { provider: "alibaba", envVar: "ALIBABA_API_KEY" },
    { provider: "chatglm", envVar: "CHATGLM_API_KEY" },
    { provider: "athene", envVar: "ATHENE_API_KEY" },
    { provider: "xai", envVar: "XAI_API_KEY" },
    { provider: "yi", envVar: "YI_API_KEY" }
  ];
  
  for (const { provider, envVar } of systemKeys) {
    const apiKey = process.env[envVar];
    if (apiKey) {
      try {
        // Check if key already exists
        const existingKey = await storage.getApiKeyByProvider(SYSTEM_USER_ID, provider);
        
        if (!existingKey) {
          // Create new system API key (marked as not user-provided)
          await storage.createApiKey({
            userId: SYSTEM_USER_ID,
            provider,
            key: apiKey,
            isUserProvided: false
          });
          log(`Initialized system API key for ${provider}`);
        } else if (existingKey.key !== apiKey) {
          // Update existing key if it changed
          // Note: In a real implementation, you would have an updateApiKey method
          // For this example, we'll just log that it should be updated
          log(`System API key for ${provider} needs updating`);
        }
      } catch (error) {
        console.error(`Failed to initialize system API key for ${provider}:`, error);
      }
    }
  }
}

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Register routes
app.use("/api/generate-plan", router);
app.use("/api/latest-plan-zip", router);

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  const server = await registerRoutes(app);
  
  // Initialize system API keys
  await initializeSystemApiKeys();

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    res.status(err.status || 500).json({
      error: err.message || "Internal Server Error",
      details: app.get("env") === "development" ? err.stack : undefined
    });
    console.error(err);
  });

  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  const PORT = Number(process.env.PORT || 5001);
  server.listen(PORT, "0.0.0.0", () => {
    log(`serving on port ${PORT}`);
  });
})();
