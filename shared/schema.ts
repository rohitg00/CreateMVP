// shared/schema.ts
import { pgTable, serial, text, timestamp, integer, boolean } from "drizzle-orm/pg-core";
import { z } from "zod";

/** 
 * A “system” user ID for any operations not tied to a real end-user.
 * We pick 0 here because your serial PKs will start at 1, so 0 never collides.
 */
export const SYSTEM_USER_ID = 0;

/** Drizzle table defs */
export const api_keys = pgTable("api_keys", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  provider: text("provider").notNull(),
  key:      text("api_key").notNull(),
  isUserProvided: boolean("is_user_provided")
                     .notNull()
                     .default(true),
  createdAt:      timestamp("created_at", { withTimezone: true })
                     .defaultNow(),
});

export const chat_messages = pgTable("chat_messages", {
  id:        serial("id").primaryKey(),
  userId:    integer("user_id").notNull(),
  model:     text("model").notNull(),
  role:      text("role").notNull(),
  content:   text("content").notNull(),
  metadata:  text("metadata"),            // or .json() if you prefer
  createdAt: timestamp("created_at", { withTimezone: true })
                 .defaultNow(),
});

/** Zod schemas for validating incoming payloads */
export const insertApiKeySchema = z.object({
  provider:        z.string().min(1),
  key:             z.string().min(1),
  isUserProvided:  z.boolean().optional(),
});

export const insertChatMessageSchema = z.object({
  model:           z.string().min(1),
  messages:        z.array(z.object({
                     role:    z.string().min(1),
                     content: z.string().min(1),
                   })),
  preserveContext: z.boolean().optional(),
});
