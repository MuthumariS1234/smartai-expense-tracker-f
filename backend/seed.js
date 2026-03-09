const db = require("./db");

const categories = [
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

// Check if categories already exist before seeding
db.get("SELECT COUNT(*) as count FROM categories", (err, row) => {
  if (row.count === 0) {
    const stmt = db.prepare("INSERT INTO categories(name) VALUES(?)");
    categories.forEach(cat => stmt.run(cat));
    stmt.finalize();
    console.log("Categories seeded successfully!");
  } else {
    console.log("Categories already exist, skipping seed.");
  }
  process.exit(0);
});

