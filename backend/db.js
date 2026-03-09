const Database = require("better-sqlite3");
const path = require("path");

// Use absolute path for database
const dbPath = path.join(__dirname, "expenses.db");
const db = new Database(dbPath);

db.pragma("journal_mode = WAL");

// Create tables if they don't exist
db.exec(`
CREATE TABLE IF NOT EXISTS expenses(
id INTEGER PRIMARY KEY AUTOINCREMENT,
user_id INTEGER,
amount REAL,
currency TEXT,
category TEXT,
description TEXT,
date TEXT,
payment_method TEXT
)
`);

db.exec(`
CREATE TABLE IF NOT EXISTS categories(
id INTEGER PRIMARY KEY AUTOINCREMENT,
name TEXT
)
`);

db.exec(`
CREATE TABLE IF NOT EXISTS users(
id INTEGER PRIMARY KEY AUTOINCREMENT,
name TEXT,
email TEXT UNIQUE,
password TEXT
)
`);

db.exec(`
CREATE TABLE IF NOT EXISTS budgets(
id INTEGER PRIMARY KEY AUTOINCREMENT,
user_id INTEGER,
category TEXT,
amount REAL
)
`);

// Seed default categories if table is empty
try {
  const categoryCount = db.prepare("SELECT COUNT(*) as count FROM categories").get();
  if (categoryCount.count === 0) {
    const defaultCategories = [
      "Food",
      "Transport",
      "Shopping",
      "Groceries",
      "Entertainment",
      "Health",
      "Bills",
      "Education",
      "Travel",
      "General"
    ];
    
    const stmt = db.prepare("INSERT INTO categories(name) VALUES(?)");
    defaultCategories.forEach(cat => stmt.run(cat));
    
    console.log("Default categories seeded");
  }
} catch(e) {
  console.log("Category seeding error:", e.message);
}

module.exports = db;

