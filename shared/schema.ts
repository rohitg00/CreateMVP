import { pgTable, serial, text, boolean, timestamp, integer } from "drizzle-orm/pg-core";
import { z } from "zod";

// System user ID constant
export const SYSTEM_USER_ID = 1; // Default system user ID

// Zod validation schemas
export const insertApiKeySchema = z.object({
  provider: z.string(),
  key: z.string(),
  isUserProvided: z.boolean().optional(),
});

export const insertChatMessageSchema = z.object({
  userId: z.number(),
  model: z.string(),
  role: z.string(),
  content: z.string(),
  metadata: z.record(z.unknown()).nullable(),
});

// API Keys table
export const apiKeys = pgTable("api_keys", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  provider: text("provider").notNull(),
  key: text("key").notNull(),
  isUserProvided: boolean("is_user_provided").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Chat Messages table
export const chatMessages = pgTable("chat_messages", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  content: text("content").notNull(),
  role: text("role").notNull(),
  conversationId: text("conversation_id").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Users table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: text("email").unique().notNull(),
  name: text("name"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Other tables can be added as needed 