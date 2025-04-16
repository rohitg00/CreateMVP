import type { Express, Router, Request } from "express";
import { Server } from "http";
import { insertApiKeySchema, insertChatMessageSchema } from "@shared/schema";
import { storage } from "./storage";
import { ZodError } from "zod";
import Anthropic from "@anthropic-ai/sdk";
import OpenAI from "openai";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { SYSTEM_USER_ID } from "@shared/schema";

// We'll use this to validate and clean API keys before storing
function sanitizeApiKey(key: string): string {
  return key.trim();
}

export async function registerRoutes(app: Express): Promise<Server> {
  const server = new Server(app);

  // API Keys management
  app.post("/api/keys", async (req, res) => {
    try {
      const data = insertApiKeySchema.parse(req.body);
      const apiKey = await storage.createApiKey({
        ...data,
        key: sanitizeApiKey(data.key),
        userId: SYSTEM_USER_ID,
        // If isUserProvided is not explicitly provided, default to true
        isUserProvided: data.isUserProvided !== undefined ? data.isUserProvided : true
      });
      res.json({ success: true, key: { ...apiKey, key: "***" } });
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({ error: error.errors });
      } else {
        res.status(500).json({ error: "Failed to store API key" });
      }
    }
  });

  app.get("/api/keys", async (req, res) => {
    try {
      const keys = await storage.getApiKeys(SYSTEM_USER_ID);
      // Hide actual keys in response
      const sanitizedKeys = keys.map(key => ({ ...key, key: "***" }));
      res.json(sanitizedKeys);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch API keys" });
    }
  });

  // Chat endpoint
  app.post("/api/chat", async (req, res) => {
    try {
      const { model, messages, preserveContext = false } = req.body;
      console.log(`Received request for model: ${model}, preserveContext: ${preserveContext}, messages count: ${messages?.length || 0}`);
      
      // Validate input
      if (!model) {
        return res.status(400).json({ error: "Model name is required" });
      }
      
      if (!messages || !Array.isArray(messages) || messages.length === 0) {
        return res.status(400).json({ error: "Messages array is required and must not be empty" });
      }
      
      // Determine which provider to use based on the model
      let provider = "";
      if (model.includes("claude")) provider = "anthropic";
      else if (model.includes("gpt") || model.includes("text-") || model.includes("o1-") || model.includes("o3-")) provider = "openai";
      else if (model.includes("gemini")) provider = "google";
      else if (model.includes("deepseek")) provider = "deepseek";
      else if (model.includes("llama")) provider = "meta";
      else if (model.includes("qwen")) provider = "alibaba";
      else if (model.includes("glm")) provider = "chatglm";
      else if (model.includes("yi")) provider = "yi";
      else if (model.includes("grok")) provider = "xai";
      else if (model.includes("athene")) provider = "athene";
      else provider = "openai"; // Default fallback
      
      console.log(`Provider detected for model ${model}: ${provider}`);
      
      // Get API key for the model
      const apiKey = await storage.getApiKeyByProvider(SYSTEM_USER_ID, provider);

      if (!apiKey) {
        console.log(`No API key found for provider: ${provider}`);
        return res.status(400).json({ 
          error: `No API key found for ${provider}`,
          details: `Please add an API key for ${provider} in your environment variables or through the API key management interface.`
        });
      }
      
      // Create client for the provider
      let client;
      let completion;
      
      try {
        console.log(`Creating client for provider: ${provider} with model: ${model}`);
        
        switch (provider) {
          case "anthropic": {
            client = new Anthropic({ apiKey: apiKey.key });
            console.log("Making request to Anthropic API...");
            completion = await client.messages.create({
              model,
              max_tokens: 4096,
              messages,
              temperature: 0.9,
            });
            break;
          }
          
          case "openai": {
            client = new OpenAI({ apiKey: apiKey.key });
            console.log("Making request to OpenAI API...");
            const openaiResponse = await client.chat.completions.create({
              model,
              messages,
              temperature: 0.9,
              max_tokens: 4096,
            });
            // Convert OpenAI response to standardized format
            completion = {
              id: openaiResponse.id,
              model: openaiResponse.model,
              choices: [
                {
                  message: openaiResponse.choices[0].message
                }
              ]
            };
            break;
          }
          
          case "google": {
            client = new GoogleGenerativeAI(apiKey.key);
            console.log("Making request to Google AI API...");
            const genAI = client.getGenerativeModel({ model });
            
            // Convert messages to Google API format
            // Google API expects different format, so we need to format our messages
            const googleMessages = messages.map(msg => ({
              role: msg.role,
              parts: [{ text: msg.content }]
            }));
            
            let googleChat;
            
            if (preserveContext && messages.length > 1) {
              // Create chat session for multi-turn conversations
              googleChat = genAI.startChat({
                history: googleMessages.slice(0, -1),
                generationConfig: {
                  temperature: 0.9,
                  maxOutputTokens: 4096,
                },
              });
              const lastMessage = googleMessages[googleMessages.length - 1];
              const response = await googleChat.sendMessage(lastMessage.parts[0].text);
              const responseText = response.response.text();
              
              // Format to match our standardized response
              completion = {
                model,
                choices: [
                  {
                    message: {
                      role: "assistant",
                      content: responseText
                    }
                  }
                ]
              };
            } else {
              // Single turn conversation
              const response = await genAI.generateContent({
                contents: googleMessages,
                generationConfig: {
                  temperature: 0.9,
                  maxOutputTokens: 4096,
                },
              });
              
              // Format to match our standardized response
              completion = {
                model,
                choices: [
                  {
                    message: {
                      role: "assistant",
                      content: response.response.text()
                    }
                  }
                ]
              };
            }
            break;
          }
          
          default:
            throw new Error(`Provider ${provider} not implemented yet`);
        }
      } catch (apiError) {
        console.error(`API error for ${provider}:`, apiError);
        return res.status(500).json({
          error: `API request to ${provider} failed`,
          details: apiError.message
        });
      }
      
      // Store the conversation if preserveContext is true
      if (preserveContext) {
        try {
          // Store user message
          const userMessage = messages[messages.length - 1];
          await storage.createChatMessage({
            userId: SYSTEM_USER_ID,
            model,
            role: userMessage.role,
            content: userMessage.content,
            metadata: null
          });
          
          // Store assistant response
          const assistantMessage = completion.choices[0].message;
          await storage.createChatMessage({
            userId: SYSTEM_USER_ID,
            model,
            role: assistantMessage.role,
            content: assistantMessage.content,
            metadata: null
          });
          
          console.log("Chat messages stored successfully");
        } catch (storageError) {
          console.error("Failed to store chat messages:", storageError);
          // We don't want to fail the API call if storage fails
        }
      }
      
      // Return the completion
      console.log("Returning completion to client");
      return res.json(completion);
      
    } catch (error) {
      console.error("Chat API error:", error);
      return res.status(500).json({
        error: "Failed to process chat request",
        details: error.message
      });
    }
  });
  
  // Get chat history
  app.get("/api/chat", async (req, res) => {
    try {
      const messages = await storage.getChatMessages(SYSTEM_USER_ID);
      res.json(messages);
    } catch (error) {
      console.error("Get chat history error:", error);
      res.status(500).json({ error: "Failed to get chat history" });
    }
  });

  return server;
}