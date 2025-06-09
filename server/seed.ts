import { db } from './db';
import { users } from '@shared/schema';
import { storage } from './storage';

/**
 * Seeds the database with initial data
 */
export async function seedDatabase() {
  try {
    console.log("Starting database seeding...");
    
    // Check if the system user exists
    const systemUser = await storage.getUser(1);
    
    if (!systemUser) {
      console.log("Creating system user (ID 1)...");
      
      // Create system user with ID 1
      const result = await db.insert(users).values({
        username: 'system',
        email: 'system@example.com',
        firstName: 'System',
        lastName: 'User',
        bio: 'System user for API keys and internal operations'
      }).returning();
      
      if (result.length > 0) {
        console.log("System user created successfully:", result[0]);
      } else {
        console.error("Failed to create system user");
      }
    } else {
      console.log("System user already exists:", systemUser);
    }
    
    console.log("Database seeding completed");
  } catch (error) {
    console.error("Error seeding database:", error);
    throw error;
  }
}
