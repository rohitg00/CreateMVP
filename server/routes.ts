import express, { Request, Response, NextFunction, Express, Router } from 'express';
import { createServer, Server } from 'http';
import bodyParser from 'body-parser';
import OpenAI from 'openai';
import Anthropic from '@anthropic-ai/sdk'; // Import default
import { GoogleGenerativeAI } from '@google/generative-ai';
import crypto from 'crypto';
import cors from 'cors';
import { IncomingHttpHeaders } from 'http';
import { ApiKey, ChatMessage as SharedChatMessage, InsertUser, User, InsertApiKey, InsertChatMessage } from "@shared/schema";

import { ZodError } from "zod";
import * as bcrypt from "bcrypt";
import { storage } from './storage';

import generatePlanRouter from './routes/generate-plan-fixed';
type InsertUserProfile = Omit<User, 'id' | 'createdAt'>;
type UpdateUserProfile = Partial<User>;

// Simplified request interface for self-hosted version
interface SimpleRequest extends express.Request {
  body: any;
}

// Global variables
// storage is now imported directly from storage
const mainRouter = express.Router();

// Utility functions
function sanitizeApiKey(key: string): string {
  return key.substring(0, 3) + "..." + key.substring(key.length - 3);
}

function getUserId(req: any): number {
  console.log('Self-hosted version: using default user ID 1');
  return 1;
}

// Helper function to convert IncomingHttpHeaders to Record<string, string>
function normalizeHeaders(headers: IncomingHttpHeaders): Record<string, string> {
  const normalized: Record<string, string> = {};
  for (const key in headers) {
    const value = headers[key];
    if (typeof value === 'string') {
      normalized[key] = value;
    } else if (Array.isArray(value)) {
      // Join array headers with comma, adjust if needed based on SDK expectation
      normalized[key] = value.join(', '); 
    }
    // Ignore undefined headers
  }
  return normalized;
}

// Webhook handler functions

const router = express.Router();

// Webhook endpoint for Polar events using SDK validation
router.post("/webhook", express.json(), async (req, res) => {
  try {
    console.log('[WEBHOOK] Received Polar webhook event at /api/subscription/webhook');
    
    // Get the body directly (should be pre-parsed by express.json())
    const event = req.body;
    
    // Log all headers for debugging
    console.log('[WEBHOOK] All request headers:', JSON.stringify(req.headers));
    
    // Log the body received
    console.log('[WEBHOOK] Webhook body preview:', 
      JSON.stringify(req.body).length > 100 ? 
        JSON.stringify(req.body).substring(0, 100) + '...[truncated]' : 
        JSON.stringify(req.body));
    
    if (!event) {
      console.error('[WEBHOOK] Missing request body');
      return res.status(400).json({ error: 'Missing request body' });
    }
    
    // Log the event type if available
    console.log(`[WEBHOOK] Event type: ${event?.type || 'unknown'}`);
    
    // Log more of the event data for debugging
    if (event?.data) {
      console.log(`[WEBHOOK] Data preview:`, JSON.stringify(event.data).substring(0, 200) + '...');
    }

    console.log(`[WEBHOOK] Webhook processing disabled in self-hosted version. Event type: ${event.type}`);

    // Always return success
    return res.status(200).json({ received: true });

  } catch (err) {
    console.error("[WEBHOOK] Error processing webhook:", err);
    // Return success anyway for testing/debugging
    return res.status(200).json({ received: true });
  }
});



export async function registerRoutes(app: Express): Promise<void> {
  
  // Keep GET method for backward compatibility
  mainRouter.get("/subscription/checkout", async (req: Request, res: Response) => {
    console.log("[API] Subscription checkout disabled in self-hosted version");
    return res.status(404).json({ error: "Subscription features not available in self-hosted version" });
  });
  
  // --- User Authentication Endpoints --- 
  // --- User Authentication Endpoints ---
  
  
  // Logout endpoint - Simple success response for self-hosted version
  mainRouter.post("/auth/logout", (req, res) => {
    console.log("[/api/auth/logout] Logout request in self-hosted version");
    res.json({ success: true });
  });
  
  // --- User Profile Endpoints --- 
  
  // Get current user profile
  mainRouter.get("/user", async (req, res) => {
    const userId = getUserId(req);
    
    try {
      const user = await storage.getUser(userId);
      if (!user) {
        console.error(`[/api/user] User ID ${userId} not found in storage.`);
        return res.status(404).json({ error: "User not found" });
      }
      
      res.json(user);
    } catch (error) {
      console.error(`[/api/user] Error fetching user ${userId}:`, error);
      res.status(500).json({ error: "Failed to get user data" });
    }
  });
  
  // Update user credits
  mainRouter.post("/user/credits", async (req, res) => {
    console.log("[API] Credits system disabled in self-hosted version");
    return res.status(404).json({ error: "Credits system not available in self-hosted version" });
  });

  // Update user profile
  mainRouter.put("/user", async (req, res) => {
    const userId = getUserId(req);
    
    try {
      console.log(`[PUT /api/user] Updating user ${userId}`, req.body);
      
      const allowedUpdates: UpdateUserProfile = {};
      const possibleFields: (keyof UpdateUserProfile)[] = ['username'];
      
      for (const field of possibleFields) {
        if (field in req.body) {
          (allowedUpdates as any)[field] = req.body[field];
        }
      }

      if (Object.keys(allowedUpdates).length === 0) {
         return res.status(400).json({ error: "No valid fields provided for update." });
      }
      
      const updatedUser = await storage.updateUser(userId, allowedUpdates);
      console.log(`[PUT /api/user] User ${userId} updated successfully:`, allowedUpdates);
      
      res.json(updatedUser);
    } catch (error) {
      console.error(`[PUT /api/user] Update user error for ${userId}:`, error);
      res.status(500).json({ error: error instanceof Error ? error.message : 'Unknown error' });
    }
  });
  
  // --- API Keys Management --- 
  mainRouter.post("/keys", async (req, res) => {
    const userId = getUserId(req);
    
    console.log(`[/api/keys POST] Processing request for user ${userId}`);
    
    try {
      const { provider, key, isUserProvided } = req.body; 
      if (!provider || !key) {
         return res.status(400).json({ error: "Provider and key are required" });
      }

      const apiKeyData = {
        userId,
        provider,
        key,
        isUserProvided: isUserProvided !== undefined ? isUserProvided : true
      };
      
      console.log(`[/api/keys POST] Creating API key for user ${userId}, provider: ${provider}`);
      const apiKey = await storage.createApiKey(apiKeyData);
      console.log(`[/api/keys POST] Successfully created API key ID ${apiKey.id} for user ${userId}`);
      
      res.json({ success: true, key: { ...apiKey, key: "***" } });
    } catch (error) {
      console.error(`[/api/keys POST] Error for user ${userId}:`, error);
      res.status(500).json({ error: error instanceof Error ? error.message : 'Unknown error' });
    }
  });
  
  // Alias route for backwards compatibility - maps to same handler as /keys
  mainRouter.post("/api-keys", async (req, res) => {
    const userId = getUserId(req);
    
    console.log(`[/api/api-keys POST] Processing request for user ${userId}`);
    
    try {
      const { provider, key, isUserProvided } = req.body; 
      if (!provider || !key) {
         return res.status(400).json({ error: "Provider and key are required" });
      }

      const apiKeyData = {
        userId,
        provider,
        key,
        isUserProvided: isUserProvided !== undefined ? isUserProvided : true
      };
      
      console.log(`[/api/api-keys POST] Creating API key for user ${userId}, provider: ${provider}`);
      const apiKey = await storage.createApiKey(apiKeyData);
      console.log(`[/api/api-keys POST] Successfully created API key ID ${apiKey.id} for user ${userId}`);
      
      res.json({ success: true, key: { ...apiKey, key: "***" } });
    } catch (error) {
      console.error(`[/api/api-keys POST] Error for user ${userId}:`, error);
      res.status(500).json({ error: error instanceof Error ? error.message : 'Unknown error' });
    }
  });

  mainRouter.get("/keys", async (req, res) => {
    const userId = getUserId(req);
    
    try {
      const keys = await storage.getApiKeys(userId);
      const sanitizedKeys = keys.map((key: ApiKey) => ({ ...key, key: "***" }));
      res.json(sanitizedKeys);
    } catch (error) {
      console.error(`[/api/keys GET] Error for user ${userId}:`, error);
      res.status(500).json({ error: "Failed to fetch API keys" });
    }
  });

  // Alias route for backwards compatibility - maps to same handler as /keys
  mainRouter.get("/api-keys", async (req, res) => {
    const userId = getUserId(req);
    
    try {
      const keys = await storage.getApiKeys(userId);
      const sanitizedKeys = keys.map((key: ApiKey) => ({ ...key, key: "***" }));
      res.json(sanitizedKeys);
    } catch (error) {
      console.error(`[/api/api-keys GET] Error for user ${userId}:`, error);
      res.status(500).json({ error: "Failed to fetch API keys" });
    }
  });
  
  // DELETE endpoint for api keys
  mainRouter.delete("/keys/:id", async (req, res) => {
    const userId = getUserId(req);
    
    const keyId = parseInt(req.params.id);
    if (isNaN(keyId)) {
      return res.status(400).json({ error: "Invalid API key ID" });
    }
    
    try {
      const key = await storage.getApiKeyById(keyId);
      if (!key || key.userId !== userId) {
        return res.status(403).json({ error: "You don't have permission to delete this key" });
      }
      
      await storage.deleteApiKey(keyId);
      console.log(`[/api/keys DELETE] User ${userId} deleted API key ID ${keyId}`);
      res.json({ success: true });
    } catch (error) {
      console.error(`[/api/keys DELETE] Error for user ${userId}:`, error);
      res.status(500).json({ error: "Failed to delete API key" });
    }
  });
  
  // Alias route for DELETE api keys
  mainRouter.delete("/api-keys/:id", async (req, res) => {
    const userId = getUserId(req);
    
    const keyId = parseInt(req.params.id);
    if (isNaN(keyId)) {
      return res.status(400).json({ error: "Invalid API key ID" });
    }
    
    try {
      const key = await storage.getApiKeyById(keyId);
      if (!key || key.userId !== userId) {
        return res.status(403).json({ error: "You don't have permission to delete this key" });
      }
      
      await storage.deleteApiKey(keyId);
      console.log(`[/api/api-keys DELETE] User ${userId} deleted API key ID ${keyId}`);
      res.json({ success: true });
    } catch (error) {
      console.error(`[/api/api-keys DELETE] Error for user ${userId}:`, error);
      res.status(500).json({ error: "Failed to delete API key" });
    }
  });

  // --- Chat Endpoint --- 
  mainRouter.post("/chat", async (req: Request, res: Response) => {
     const userId = getUserId(req);
     
     const { model, messages, preserveContext = false } = req.body;
     console.log(`[/api/chat] User ${userId} request for model: ${model}, preserveContext: ${preserveContext}, messages count: ${messages?.length || 0}`);
     
     // ... (input validation) ...
     
     try {
        const user = await storage.getUser(userId);
        if (!user) {
          console.error(`[/api/chat] User ${userId} not found in storage.`);
          return res.status(404).json({ error: "User not found" });
        }
        
        
        // ... (provider detection logic) ...
        let provider = getProviderFromModel(model); // Use helper function
        console.log(`[/api/chat] User ${userId} - Provider detected for model ${model}: ${provider}`);

        const apiKeyData = await storage.getApiKeyByProvider(userId, provider);
        
        // DEBUG: Log the raw data received from storage
        // console.log(`[Raw Key Data in Chat Route] Received raw data for user ${userId}, provider ${provider}:`, apiKeyData); 

        // --- API Key Mapping/Validation --- 
        // Check if data exists and has necessary properties
        if (!apiKeyData || typeof apiKeyData !== 'object' || !apiKeyData.key) {
           console.error(`[/api/chat] User ${userId} - No valid API key found in storage for provider: ${provider}`);
           return res.status(403).json({ 
             error: "API_KEY_REQUIRED",
             message: `No API key configured for ${provider}. Please add your API key in settings.`,
             apiProvider: provider
           });
        }
        // Manually construct the ApiKey object for type safety downstream
        const apiKey: ApiKey = {
            id: apiKeyData.id,
            userId: apiKeyData.userId,
            provider: apiKeyData.provider,
            key: apiKeyData.key, // Use the retrieved key
            isUserProvided: apiKeyData.isUserProvided === true, // Ensure boolean
            createdAt: apiKeyData.createdAt
        };
        // --- End API Key Mapping/Validation --- 
        
        console.log(`[/api/chat] User ${userId} - API key found for provider: ${provider}, isUserProvided: ${apiKey.isUserProvided}`);

        const userMessage = messages[messages.length - 1];
        if (!userMessage) {
           console.error(`[/api/chat] User ${userId} - No user message found.`);
           return res.status(400).json({ error: "No user message found in request" });
        }
        
        // Store user message
        await storage.createChatMessage({
          userId,
          model,
          role: "user",
          content: userMessage.content,
          metadata: JSON.stringify({ preserveContext }), // Store preserveContext flag?
        });

        let responseText: string = ""; // Rename to avoid conflict with express Response
        try {
           // Map messages to provider format 
           const apiMessages = mapMessagesForProvider(messages, provider);
           
           // Call provider API
           responseText = await callLLMApi(provider, model, apiKey.key, apiMessages);
           console.log(`[/api/chat] User ${userId} - ${provider} response received for model ${model}.`);

        } catch (apiError: unknown) {
           console.error(`[/api/chat] User ${userId} - Error calling ${provider} API:`, apiError);
           const errorMessage = apiError instanceof Error ? apiError.message : "Unknown API error";
           return res.status(500).json({ 
             error: `Failed to get response from ${provider}: ${errorMessage}` 
           });
        }

        // Store assistant response
        await storage.createChatMessage({
          userId,
          model,
          role: "assistant",
          content: responseText,
          metadata: JSON.stringify({ preserveContext }),
        });
        
        let creditsUsed = 0;

        res.json({ 
          response: responseText, 
          ...(creditsUsed > 0 && { creditsUsed }) // Conditionally include creditsUsed
        });
     } catch (error: unknown) {
        console.error(`[/api/chat] Error for user ${userId}:`, error);
        res.status(500).json({ error: error instanceof Error ? error.message : 'Unknown error' });
     }
  });

  // Get chat history
  mainRouter.get("/chat/history", async (req, res) => {
    const userId = getUserId(req);
    
    try {
      const messages = await storage.getChatMessages(userId);
      res.json(messages);
    } catch (error) {
      console.error(`[/api/chat/history] Error for user ${userId}:`, error);
      res.status(500).json({ error: "Failed to fetch chat history" });
    }
  });

  // Mount the main router under /api
  app.use('/api', mainRouter);
  
  // Mount the generate-plan router under /api/generate-plan
  app.use('/api/generate-plan', generatePlanRouter);

  // Error handling middleware (must be last)
  app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error("[Global Error Handler]", err.stack);
    const message = process.env.NODE_ENV === 'production' ? 'Internal Server Error' : err.message;
    res.status(500).json({ error: message });
  });
}

export default router;

// --- Helper Functions ---

// Determine provider based on model name
function getProviderFromModel(model: string): string {
    if (!model) return "openai"; // Default fallback
    if (model.includes("claude")) return "anthropic";
    if (model.includes("gpt") || model.includes("text-") || model.includes("o1-") || model.includes("o3-")) return "openai";
    if (model.includes("gemini")) return "google";
    if (model.includes("deepseek")) return "deepseek";
    if (model.includes("llama")) return "meta";
    if (model.includes("qwen")) return "alibaba";
    if (model.includes("glm")) return "chatglm";
    if (model.includes("yi")) return "yi";
    if (model.includes("grok")) return "xai";
    if (model.includes("athene")) return "athene";
    return "openai"; // Default fallback
}

// Map messages to the format expected by the target LLM API
function mapMessagesForProvider(messages: SharedChatMessage[], provider: string): any[] {
   // Simplified example - Adapt based on actual provider requirements
   // This needs proper typing based on OpenAI/Anthropic/Google SDKs
   return messages.map(msg => {
      let content: any = msg.content;
      // Basic handling for string content
      if (typeof content !== 'string') {
         content = JSON.stringify(content); // Fallback for non-string
      }

      // Role mapping might be needed (e.g., system -> user for some models)
      let role = msg.role;
      if (provider === 'anthropic' && role === 'system') {
         // Anthropic uses a dedicated system prompt field
         // This mapping should handle system prompts separately before calling API
         role = 'user'; // Map system to user for messages array? Check Anthropic docs.
      } else if (provider === 'google' && role === 'system') {
         role = 'user'; // Gemini might prefer system prompt prepended to user message
      }
      
      return { role, content };
   });
}

// Wrapper for calling different LLM APIs

async function callLLMApi(provider: string, model: string, apiKey: string, messages: any[]): Promise<string> {
  console.log(`Making API call to ${provider} for model ${model}`);
  
  try {
    if (provider === 'google') {
      // Call Google's Gemini API directly
      const { GoogleGenerativeAI } = await import('@google/generative-ai');
      const genAI = new GoogleGenerativeAI(apiKey);
      const geminiModel = genAI.getGenerativeModel({ model: model });
      
      // Convert messages to Gemini format
      const lastMessage = messages[messages.length - 1];
      const prompt = lastMessage?.content || "";
      
      const result = await geminiModel.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } else if (provider === 'openai') {
      // Call OpenAI API directly
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: model,
          messages: messages,
          temperature: 0.7,
          max_tokens: 2048
        })
      });
      
      const data = await response.json();
      return data.choices?.[0]?.message?.content || "";
    } else if (provider === 'anthropic') {
      // Call Anthropic API directly
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'x-api-key': apiKey,
          'Content-Type': 'application/json',
          'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
          model: model,
          max_tokens: 2048,
          messages: messages
        })
      });
      
      const data = await response.json();
      return data.content?.[0]?.text || "";
    } else {
      throw new Error(`Unsupported provider: ${provider}`);
    }
  } catch (error) {
    console.error(`Error in callLLMApi for ${provider}/${model}:`, error);
    throw error;
  }
}

// Helper function to handle unknown errors
function handleError(error: unknown): string {
  if (error instanceof Error) {
    // Handle specific errors like ZodError if needed
    // if (error instanceof ZodError) { return JSON.stringify(error.errors); }
    return error.message;
  } else if (typeof error === 'string') {
    return error;
  } else {
    return 'An unknown error occurred';
  }
}
