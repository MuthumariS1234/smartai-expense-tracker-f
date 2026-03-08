const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database("expenses.db");

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS expenses(
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      amount REAL,
      category TEXT,
      merchant TEXT,
      date TEXT
    )
  `);
});

module.exports = db;