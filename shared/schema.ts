import {
  sqliteTable,
  text, 
  integer
} from 'drizzle-orm/sqlite-core';

// Users table - simplified for self-hosted version
export const users = sqliteTable('users', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  username: text('username').unique().notNull(),
  email: text('email').unique(),
  hashedPassword: text('hashed_password'),
  firstName: text('first_name'),
  lastName: text('last_name'),
  bio: text('bio'),
  profileImageUrl: text('profile_image_url'),
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
});

// API keys table for LLM providers
export const apiKeys = sqliteTable('api_keys', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  userId: integer('user_id').references(() => users.id).notNull(),
  provider: text('provider').notNull(),
  key: text('key').notNull(),
  isUserProvided: integer('is_user_provided', { mode: 'boolean' }).notNull().default(true),
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date())
});

// Chat messages table
export const chatMessages = sqliteTable('chat_messages', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  userId: integer('user_id').references(() => users.id).notNull(),
  model: text('model').notNull(),
  role: text('role').notNull(),
  content: text('content').notNull(),
  metadata: text('metadata'),
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date())
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

export type ApiKey = typeof apiKeys.$inferSelect;
export type InsertApiKey = typeof apiKeys.$inferInsert;

export type ChatMessage = typeof chatMessages.$inferSelect;
export type InsertChatMessage = typeof chatMessages.$inferInsert;
