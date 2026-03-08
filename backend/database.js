const Database = require('better-sqlite3')

const db = new Database("./expenses.db")


console.log("Connected to SQLite database")

// Create tables
db.exec(`
CREATE TABLE IF NOT EXISTS users (

id INTEGER PRIMARY KEY AUTOINCREMENT,
name TEXT,
email TEXT UNIQUE,
password TEXT

)
`)



db.exec(`
CREATE TABLE IF NOT EXISTS expenses (

id INTEGER PRIMARY KEY AUTOINCREMENT,
user_id INTEGER,
amount INTEGER,
category TEXT,
description TEXT,
date TEXT,
payment_method TEXT

)
`)



db.exec(`
CREATE TABLE IF NOT EXISTS budgets (

id INTEGER PRIMARY KEY AUTOINCREMENT,
user_id INTEGER,
category TEXT,
amount INTEGER

)
`)



db.exec(`
CREATE TABLE IF NOT EXISTS categories (

id INTEGER PRIMARY KEY AUTOINCREMENT,
name TEXT UNIQUE

)
`)



db.exec(`
INSERT OR IGNORE INTO categories(name)
VALUES
('Food'),
('Transport'),
('Entertainment'),
('Bills'),
('Shopping'),
('Healthcare'),
('Education')
`)

module.exports = db