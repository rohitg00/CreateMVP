import { type ApiKey, type ChatMessage } from "@shared/schema";

export interface IStorage {
  createApiKey(key: Omit<ApiKey, "id" | "createdAt">): Promise<ApiKey>;
  getApiKeys(userId: number): Promise<ApiKey[]>;
  getApiKeyByProvider(userId: number, provider: string): Promise<ApiKey | undefined>;
  createChatMessage(message: Omit<ChatMessage, "id" | "createdAt">): Promise<ChatMessage>;
  getChatMessages(userId: number): Promise<ChatMessage[]>;
}

export class MemStorage implements IStorage {
  private apiKeys: Map<number, ApiKey>;
  private chatMessages: Map<number, ChatMessage>;
  private currentId: number;

  constructor() {
    this.apiKeys = new Map();
    this.chatMessages = new Map();
    this.currentId = 1;
  }

  async createApiKey(key: Omit<ApiKey, "id" | "createdAt">): Promise<ApiKey> {
    const id = this.currentId++;
    const apiKey: ApiKey = {
      ...key,
      id,
      // Ensure isUserProvided has a default value if not provided
      isUserProvided: key.isUserProvided !== undefined ? key.isUserProvided : true,
      createdAt: new Date(),
    };
    this.apiKeys.set(id, apiKey);
    return apiKey;
  }

  async getApiKeys(userId: number): Promise<ApiKey[]> {
    return Array.from(this.apiKeys.values()).filter(
      (key) => key.userId === userId,
    );
  }

  async getApiKeyByProvider(userId: number, provider: string): Promise<ApiKey | undefined> {
    return Array.from(this.apiKeys.values()).find(
      (key) => key.userId === userId && key.provider === provider,
    );
  }

  async createChatMessage(message: Omit<ChatMessage, "id" | "createdAt">): Promise<ChatMessage> {
    const id = this.currentId++;
    const chatMessage: ChatMessage = {
      ...message,
      id,
      createdAt: new Date(),
    };
    this.chatMessages.set(id, chatMessage);
    return chatMessage;
  }

  async getChatMessages(userId: number): Promise<ChatMessage[]> {
    return Array.from(this.chatMessages.values())
      .filter((msg) => msg.userId === userId)
      .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
  }
}

export const storage = new MemStorage();