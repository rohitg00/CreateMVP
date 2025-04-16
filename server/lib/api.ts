import OpenAI from "openai";
import { GoogleGenerativeAI } from "@google/generative-ai";

const openai = new OpenAI({
  apiKey: process.env.DEEPSEEK_API_KEY,
  baseURL: "https://api.deepseek.com/v1",
});

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || '');

export async function apiRequest(method: string, endpoint: string, data: any) {
  try {
    if (data.model === "deepseek-r1") {
      const response = await openai.chat.completions.create({
        model: "deepseek-r1",
        messages: data.messages,
        response_format: { type: "json_object" },
      });

      // Validate response structure
      if (!response.choices?.[0]?.message?.content) {
        throw new Error("Invalid response structure from DeepSeek API");
      }

      return response;
    } else if (data.model.startsWith("gemini")) {
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      // Format the request like the working curl example
      const result = await model.generateContent({
        contents: [{
          parts: [{ text: data.messages[0].content }]
        }]
      });
      
      const response = await result.response;
      const text = response.text();

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
    throw new Error(`Unsupported model: ${data.model}`);
  } catch (error: any) {
    console.error("API Request Error:", error.message);
    throw new Error(`API request failed: ${error.message}`);
  }
}