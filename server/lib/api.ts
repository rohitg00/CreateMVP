// Import and configure dotenv first to ensure environment variables are loaded
import 'dotenv/config';

import OpenAI from "openai";
import { GoogleGenerativeAI } from "@google/generative-ai";
import Anthropic from "@anthropic-ai/sdk";

// Declare client variables without initializing
let openai: OpenAI | undefined;
let anthropic: Anthropic | undefined;
let deepseek: OpenAI | undefined;
let genAI: GoogleGenerativeAI | undefined;

function getOpenAIClient(): OpenAI {
  if (!openai) {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error("OPENAI_API_KEY is not set in environment variables.");
    }
    openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }
  return openai;
}

function getAnthropicClient(): Anthropic {
  if (!anthropic) {
    if (!process.env.ANTHROPIC_API_KEY) {
      throw new Error("ANTHROPIC_API_KEY is not set in environment variables.");
    }
    anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });
  }
  return anthropic;
}

function getDeepSeekClient(): OpenAI {
  if (!deepseek) {
    if (!process.env.DEEPSEEK_API_KEY) {
      throw new Error("DEEPSEEK_API_KEY is not set in environment variables.");
    }
    deepseek = new OpenAI({
      apiKey: process.env.DEEPSEEK_API_KEY,
      baseURL: "https://api.deepseek.com/v1",
    });
  }
  return deepseek;
}

function getGoogleClient(): GoogleGenerativeAI {
  if (!genAI) {
    if (!process.env.GOOGLE_API_KEY) {
      throw new Error("GOOGLE_API_KEY is not set in environment variables.");
    }
    genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
  }
  return genAI;
}

/**
 * Make an API request to the appropriate AI provider based on the model
 */
export async function apiRequest(method: string, endpoint: string, data: any) {
  console.log(`API request to ${endpoint} with model: ${data.model}`);
  
  try {
    // OpenAI models (gpt-4, gpt-3.5-turbo, etc.)
    if (data.model?.startsWith("gpt") || data.model?.startsWith("text-")) {
      console.log("Using OpenAI API for model:", data.model);
      const client = getOpenAIClient();
      const response = await client.chat.completions.create({
        model: data.model,
        messages: data.messages,
        max_tokens: data.maxTokens || 2048,
        temperature: data.temperature || 0.7,
      });

      // Validate response structure
      if (!response.choices?.[0]?.message?.content) {
        throw new Error("Invalid response structure from OpenAI API");
      }

      return response;
    } 
    // Anthropic models (claude-3 variants)
    else if (data.model?.startsWith("claude")) {
      console.log("Using Anthropic API for model:", data.model);
      const client = getAnthropicClient();
      // the newest Anthropic model is "claude-3-7-sonnet-20250219" which was released February 24, 2025
      
      // Convert message format from OpenAI to Anthropic
      const messages = data.messages.map((msg: any) => ({
        role: msg.role === "user" ? "user" : "assistant",
        content: msg.content
      }));
      
      const response = await client.messages.create({
        model: data.model,
        messages: messages,
        max_tokens: data.maxTokens || 2048,
        temperature: data.temperature || 0.7,
      });

      // Check if we have a valid response
      const content = response.content?.[0];
      if (!content) {
        throw new Error("Invalid response structure from Anthropic API");
      }

      // Get content from the appropriate property based on type
      const contentText = 'text' in content ? content.text : JSON.stringify(content);
      
      // Format response to match expected structure
      return {
        choices: [
          {
            message: {
              content: contentText,
            },
          },
        ],
      };
    } 
    // DeepSeek models
    else if (data.model?.startsWith("deepseek")) {
      console.log("Using DeepSeek API for model:", data.model);
      const client = getDeepSeekClient();
      const response = await client.chat.completions.create({
        model: data.model,
        messages: data.messages,
        max_tokens: data.maxTokens || 2048,
        temperature: data.temperature || 0.7,
      });

      // Validate response structure
      if (!response.choices?.[0]?.message?.content) {
        throw new Error("Invalid response structure from DeepSeek API");
      }

      return response;
    } 
    // Google Gemini models
    else if (data.model?.startsWith("gemini")) {
      console.log("Using Google AI for model:", data.model);
      const client = getGoogleClient();
      // Use the correct model name from the request
      const model = client.getGenerativeModel({ model: data.model });
      
      // Format messages into Google Gemini format
      const formattedMessage = data.messages.reduce((acc: string, msg: any) => {
        return acc + `${msg.role.toUpperCase()}: ${msg.content}\n\n`;
      }, "");
      
      // Format the request with the proper Google Generative AI format
      // We need to use different request formats based on the model
      const result = await model.generateContent(formattedMessage);
      
      // Correctly extract the text from the response
      const text = result.response.text();

      if (!text) {
        throw new Error("Empty response from Gemini API");
      }

      // Format response to match expected structure
      return {
        choices: [
          {
            message: {
              content: text,
            },
          },
        ],
      };
    }
    
    // If model isn't recognized
    throw new Error(`Unsupported model: ${data.model}`);
  } catch (error: any) {
    console.error("API Request Error:", error.message);
    throw new Error(`API request failed: ${error.message}`);
  }
}