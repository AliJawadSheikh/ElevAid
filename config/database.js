// Centralized SQLite DB setup.
// In a real-world scenario, this could evolve to use ORM (e.g., Sequelize) or be abstracted for multi-environment configs.

import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Database file path
const dbPath = join(__dirname, '..', 'database.sqlite');

// Initialize database
export const initDatabase = () => {
  const db = new Database(dbPath);
  
  // Enable foreign keys
  db.pragma('foreign_keys = ON');
  
  // Create tables
  db.exec(`
    CREATE TABLE IF NOT EXISTS records (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      diagnosis TEXT,
      status TEXT,
      note TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
  
  console.log('✅ Database initialized successfully');
  return db;
};

// Get database instance
export const getDatabase = () => {
  return new Database(dbPath);
};

export default { initDatabase, getDatabase }; 