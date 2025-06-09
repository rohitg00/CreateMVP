import Database from 'better-sqlite3';
import fs from 'fs';
import path from 'path';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import { migrate } from 'drizzle-orm/better-sqlite3/migrator';

// Import our schema
import * as schema from '../shared/schema';

const DATABASE_PATH = process.env.DATABASE_PATH || './data/app.db';

const dataDir = path.dirname(DATABASE_PATH);
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Create SQLite connection
const sqlite = new Database(DATABASE_PATH);

// Initialize Drizzle ORM
export const db = drizzle(sqlite, { schema });

/**
 * Runs database migrations
 */
export async function runMigrations() {
  const migrationsFolder = path.join(process.cwd(), 'migrations');
  
  try {
    console.log('Running database migrations');
    console.log('Migrations folder path:', migrationsFolder);
    console.log('Database path:', DATABASE_PATH);
    
    // Check if the migrations folder exists
    if (!fs.existsSync(migrationsFolder)) {
      console.log('No migrations folder found, creating initial database structure');
      return;
    }
    
    // Run migrations if they exist
    await migrate(db, { migrationsFolder });
    console.log('Migrations completed successfully');
  } catch (error) {
    console.error('Error running migrations:', error);
    // For development, we can continue without migrations
    console.log('Continuing without migrations for development');
  }
}
