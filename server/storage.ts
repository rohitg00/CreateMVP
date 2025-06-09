import { eq, desc, and } from 'drizzle-orm';
import {
  User,
  InsertUser,
  ApiKey,
  InsertApiKey,
  ChatMessage,
  InsertChatMessage,
  users,
  apiKeys,
  chatMessages
} from '@shared/schema';
import { db } from './db';
import * as schema from '@shared/schema';

export interface IStorage {
  getUser(id: number): Promise<User | null>;
  getUserByUsername(username: string): Promise<User | null>;
  getUserByEmail(email: string): Promise<User | null>;
  getAllUsers(): Promise<User[]>;
  createUser(data: InsertUser): Promise<User>;
  updateUser(id: number, data: Partial<User>): Promise<User>;
  updateUserPassword(id: number, hashedPassword: string): Promise<User>;
  
  getApiKeys(userId: number): Promise<ApiKey[]>;
  getApiKeyByProvider(userId: number, provider: string): Promise<ApiKey | null>;
  getApiKeyById(id: number): Promise<ApiKey | null>;
  createApiKey(data: Omit<ApiKey, 'id' | 'createdAt'>): Promise<ApiKey>;
  updateApiKey(id: number, data: Partial<ApiKey>): Promise<ApiKey>;
  deleteApiKey(id: number): Promise<void>;
  getSystemApiKeys(): Promise<ApiKey[]>;
  
  getChatMessages(userId: number): Promise<ChatMessage[]>;
  createChatMessage(data: Omit<ChatMessage, 'id' | 'createdAt'>): Promise<ChatMessage>;
}

/**
 * SQLite storage implementation
 */
export class SqliteStorage implements IStorage {
  /**
   * Retrieves a user by ID
   */
  async getUser(id: number): Promise<User | null> {
    try {
      const results = await db.select().from(users).where(eq(users.id, id)).limit(1);
      return results.length > 0 ? results[0] : null;
    } catch (error) {
      console.error('Error getting user by ID:', error);
      throw error;
    }
  }

  /**
   * Retrieves a user by username
   */
  async getUserByUsername(username: string): Promise<User | null> {
    try {
      const results = await db.select().from(users).where(eq(users.username, username)).limit(1);
      return results.length > 0 ? results[0] : null;
    } catch (error) {
      console.error('Error getting user by username:', error);
      throw error;
    }
  }

  /**
   * Retrieves a user by email
   */
  async getUserByEmail(email: string): Promise<User | null> {
    try {
      const results = await db.select().from(users).where(eq(users.email, email)).limit(1);
      return results.length > 0 ? results[0] : null;
    } catch (error) {
      console.error('Error getting user by email:', error);
      throw error;
    }
  }

  /**
   * Creates a new user
   */
  async createUser(data: InsertUser): Promise<User> {
    try {
      // Ensure we never try to explicitly set the ID, let PostgreSQL auto-increment it
      // This prevents primary key conflicts with "Key (id)=(X) already exists" errors
      const insertData = { ...data };
      delete (insertData as any).id;
      
      console.log('Creating user with data:', JSON.stringify(insertData, null, 2));
      const result = await db.insert(users).values(insertData).returning();
      console.log('Created user:', JSON.stringify(result[0], null, 2));
      return result[0];
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }

  /**
   * Updates an existing user
   */
  async updateUser(id: number, data: Partial<User>): Promise<User> {
    try {
      // Add updatedAt timestamp
      if (!data.updatedAt) {
        data.updatedAt = new Date();
      }
      
      const result = await db.update(users).set(data).where(eq(users.id, id)).returning();
      
      if (result.length === 0) {
        throw new Error(`User with ID ${id} not found`);
      }
      
      return result[0];
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  }


  
  /**
   * Updates a user's password
   */
  async updateUserPassword(id: number, hashedPassword: string): Promise<User> {
    try {
      // Get current user to make sure it exists
      const user = await this.getUser(id);
      
      if (!user) {
        throw new Error(`User with ID ${id} not found`);
      }
      
      // Update user with new hashed password
      const result = await db.update(users)
        .set({ 
          hashedPassword: hashedPassword,
          updatedAt: new Date()
        })
        .where(eq(users.id, id))
        .returning();
      
      return result[0];
    } catch (error) {
      console.error('Error updating user password:', error);
      throw error;
    }
  }


  async getAllUsers(): Promise<User[]> {
    try {
      const results = await db.select().from(users);
      return results;
    } catch (error) {
      console.error('Error getting all users:', error);
      throw error;
    }
  }

  async getApiKeys(userId: number): Promise<ApiKey[]> {
    try {
      return await db.select().from(apiKeys).where(eq(apiKeys.userId, userId));
    } catch (error) {
      console.error('Error getting API keys:', error);
      throw error;
    }
  }

  /**
   * Retrieves an API key for a specific provider
   */
  async getApiKeyByProvider(userId: number, provider: string): Promise<ApiKey | null> {
    try {
      const results = await db.select().from(apiKeys).where(and(
        eq(apiKeys.userId, userId),
        eq(apiKeys.provider, provider)
      )).limit(1);
      
      return results.length > 0 ? results[0] : null;
    } catch (error) {
      console.error('Error getting API key by provider:', error);
      throw error;
    }
  }

  async createApiKey(data: Omit<ApiKey, 'id' | 'createdAt'>): Promise<ApiKey> {
    try {
      const apiKeyData = {
        ...data,
        createdAt: new Date()
      };
      const result = await db.insert(apiKeys).values(apiKeyData).returning();
      return result[0];
    } catch (error) {
      console.error('Error creating API key:', error);
      throw error;
    }
  }
  
  async getApiKeyById(id: number): Promise<ApiKey | null> {
    try {
      const results = await db.select().from(apiKeys).where(eq(apiKeys.id, id)).limit(1);
      return results.length > 0 ? results[0] : null;
    } catch (error) {
      console.error('Error getting API key by ID:', error);
      throw error;
    }
  }

  async updateApiKey(id: number, data: Partial<ApiKey>): Promise<ApiKey> {
    try {
      const result = await db.update(apiKeys)
        .set(data)
        .where(eq(apiKeys.id, id))
        .returning();
      
      return result[0];
    } catch (error) {
      console.error('Error updating API key:', error);
      throw error;
    }
  }
  
  async deleteApiKey(id: number): Promise<void> {
    try {
      await db.delete(apiKeys).where(eq(apiKeys.id, id));
    } catch (error) {
      console.error('Error deleting API key:', error);
      throw error;
    }
  }
  
  /**
   * Retrieves all system API keys (where isUserProvided=false)
   */
  async getSystemApiKeys(): Promise<ApiKey[]> {
    try {
      return await db.select()
        .from(apiKeys)
        .where(eq(apiKeys.isUserProvided, false));
    } catch (error) {
      console.error('Error getting system API keys:', error);
      throw error;
    }
  }

  async getChatMessages(userId: number): Promise<ChatMessage[]> {
    try {
      return await db.select()
        .from(chatMessages)
        .where(eq(chatMessages.userId, userId))
        .orderBy(desc(chatMessages.createdAt));
    } catch (error) {
      console.error('Error getting chat messages:', error);
      throw error;
    }
  }

  async createChatMessage(data: Omit<ChatMessage, 'id' | 'createdAt'>): Promise<ChatMessage> {
    try {
      const messageData = {
        ...data,
        createdAt: new Date()
      };
      const result = await db.insert(chatMessages).values(messageData).returning();
      return result[0];
    } catch (error) {
      console.error('Error creating chat message:', error);
      throw error;
    }
  }


}

export const storage = new SqliteStorage();
