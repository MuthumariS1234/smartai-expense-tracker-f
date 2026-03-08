require("dotenv").config()

const express = require("express")
const cors = require("cors")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const Groq = require("groq-sdk")
const db = require("./database")

const app = express()

app.use(cors())
app.use(express.json())

const SECRET = "expense_secret_key"

// Initialize Groq
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
})

/* ===========================
   USER SIGNUP
=========================== */

app.post("/api/signup", async (req, res) => {

  const { name, email, password } = req.body

  try {

    const hashedPassword = await bcrypt.hash(password, 10)

    const stmt = db.prepare("INSERT INTO users(name,email,password) VALUES (?,?,?)")
    const result = stmt.run(name, email, hashedPassword)

    res.json({
      message: "User created successfully",
      user_id: result.lastInsertRowid
    })

  } catch (err) {
    res.status(500).json(err)
  }

})


/* ===========================
   USER LOGIN
=========================== */

app.post("/api/login", async (req, res) => {

  const { email, password } = req.body

  const user = db.prepare("SELECT * FROM users WHERE email=?").get(email)

  if (!user) {
    return res.status(400).json({ message: "User not found" })
  }

  const valid = await bcrypt.compare(password, user.password)

  if (!valid) {
    return res.status(400).json({ message: "Invalid password" })
  }

  const token = jwt.sign({ id: user.id }, SECRET)

  res.json({
    message: "Login successful",
    token,
    user_id: user.id
  })

})


/* ===========================
   ADD EXPENSE
=========================== */

/* ===========================
   ADD EXPENSE
=========================== */

/* ===========================
   ADD EXPENSE
=========================== */

app.post("/api/expenses", (req, res) => {

  const { user_id, amount, currency, category, description, date } = req.body

  try {

    // check if category already exists
    const existing = db
      .prepare("SELECT * FROM categories WHERE name=?")
      .get(category)

    // if not, add it
    if(!existing){
      db.prepare("INSERT INTO categories(name) VALUES(?)")
      .run(category)
    }

    const stmt = db.prepare(`
      INSERT INTO expenses(user_id,amount,currency,category,description,date)
      VALUES (?,?,?,?,?,?)
    `)

    const result = stmt.run(
      user_id,
      amount,
      currency,
      category,
      description,
      date
    )

    res.json({
      message:"Expense added",
      id: result.lastInsertRowid
    })

  } catch(err){
    res.status(500).json(err)
  }

})
app.put("/api/update-expense/:id", (req, res) => {

  const id = req.params.id
  const { category, description, amount } = req.body

  try {

    db.prepare(`
      UPDATE expenses
      SET category=?, description=?, amount=?
      WHERE id=?
    `).run(category, description, amount, id)

    res.json({ success: true })

  } catch (err) {

    console.log(err)
    res.json({ success: false })

  }

})

/* ===========================
   GET USER EXPENSES
=========================== */

app.get("/api/expenses/:user_id", (req, res) => {

  const { user_id } = req.params

  const rows = db.prepare(
    "SELECT * FROM expenses WHERE user_id=? ORDER BY date DESC"
  ).all(user_id)

  res.json(rows)

})


/* ===========================
   ANALYTICS DATA
=========================== */

app.get("/api/analytics/:user_id", (req, res) => {

  const { user_id } = req.params

  const rows = db.prepare(`
    SELECT category,
    SUM(amount) as total
    FROM expenses
    WHERE user_id=?
    GROUP BY category
  `).all(user_id)

  res.json(rows)

})


/* ===========================
   CATEGORIES & BUDGETS
=========================== */

// return all predefined categories for expense form
app.get("/api/categories", (req, res) => {
  const rows = db.prepare("SELECT * FROM categories").all();
  res.json(rows);
});

// fetch budgets for a given user
app.get("/api/budgets/:user_id", (req, res) => {
  const { user_id } = req.params;
  const rows = db.prepare("SELECT * FROM budgets WHERE user_id = ?").all(user_id);
  res.json(rows);
});

// create or update a budget
app.post("/api/budget", (req, res) => {
  const { user_id, category, amount } = req.body;
  try {
    const existing = db
      .prepare("SELECT id FROM budgets WHERE user_id=? AND category=?")
      .get(user_id, category);
    if (existing) {
      db.prepare("UPDATE budgets SET amount=? WHERE id=?").run(amount, existing.id);
    } else {
      db
        .prepare("INSERT INTO budgets(user_id, category, amount) VALUES(?,?,?)")
        .run(user_id, category, amount);
    }
    res.json({ message: "Budget saved" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
app.delete("/api/delete-expense/:id", (req, res) => {

const id = req.params.id;

db.run(
"DELETE FROM expenses WHERE id = ?",
[id],
function(err){

if(err){
res.json({success:false})
return
}

res.json({success:true})

}

)

});
/* ===========================
   RECURRING EXPENSES
=========================== */

app.get("/api/recurring-expenses/:user_id", (req, res) => {

  const { user_id } = req.params

  const rows = db.prepare(`
    SELECT category, amount
    FROM expenses
    WHERE user_id = ?
  `).all(user_id)

  const map = {}
  const recurring = []

  rows.forEach(exp => {

    const key = exp.category + "_" + exp.amount

    map[key] = (map[key] || 0) + 1

    if (map[key] === 3) {
      recurring.push({
        category: exp.category,
        amount: exp.amount
      })
    }

  })

  res.json(recurring)

})

/* ===========================
   AI CHATBOT
=========================== */
/* ===========================
   AI CHATBOT
=========================== */

app.post("/api/chatbot", async (req, res) => {

  const { message, user_id } = req.body;

  try {

    const ai = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
         messages: [
  {
    role: "system",
    content: `
You are an AI expense assistant.

Your job is to convert the user message into structured JSON actions for an expense tracking system.

IMPORTANT RULES

1. Always return VALID JSON.
2. Return JSON only. Do NOT include explanations, text, or markdown.
3. If there are multiple actions, return a JSON array.
4. If there is only one action, return a single JSON object.
5. NEVER return multiple JSON objects separately.
6. Only use these exact actions:

create_expense
read_expense
update_expense
delete_expense

7. Never invent new actions like "add", "show", "get", etc.

8. Categories should be short lowercase words such as:
food
transport
shopping
groceries
entertainment
health
general

9. If description is not mentioned, use the category as description.

10. Amount must always be a number.

11. If the user asks to see expenses for multiple categories, return multiple read_expense actions.

EXAMPLES



User: show food and shopping

[
 {"action":"read_expense","category":"food"},
 {"action":"read_expense","category":"shopping"}
]

User: delete food expenses

{
 "action":"delete_expense",
 "category":"food"
}

User: change transport expense to 300

{
 "action":"update_expense",
 "category":"transport",
 "amount":300
}
`
  },
  {
    role: "user",
    content: message
  }
]
      
    });

    const aiText = ai.choices[0].message.content;

    console.log("AI Response:", aiText);

    let result;

    try {
let cleaned = aiText.trim()

// remove markdown
cleaned = cleaned.replace(/```json/g, "").replace(/```/g, "")

const jsonMatch = cleaned.match(/\[[\s\S]*\]|\{[\s\S]*\}/)

if (!jsonMatch) {
  console.log("No JSON found:", aiText)
  return res.json({ reply: "I couldn't understand your request." })
}

result = JSON.parse(jsonMatch[0])
console.log("Parsed result:", result)
console.log("Is array:", Array.isArray(result))

    } catch (err) {

      console.log("JSON parse error:", aiText);

      return res.json({
        reply: "I couldn't understand your request."
      });

    }

    /* HANDLE ARRAY ACTIONS */

    /* HANDLE ARRAY ACTIONS */

/* HANDLE ARRAY ACTIONS */

if (Array.isArray(result)) {

  let created = 0
  let deleted = 0
  let updated = 0
  let reply = ""

  for (const item of result) {
    console.log("Processing action:", item.action, "category:", item.category)
    const action = (item.action || "").toLowerCase()
    const category = (item.category || "").toLowerCase().trim()

    /* CREATE EXPENSE */

    if (action === "create_expense") {

      const amount = item.amount || 0
      const description = item.description || category

      db.prepare(`
        INSERT INTO expenses(user_id,amount,currency,category,description,date)
VALUES (?,?,?,?,?,?)
      `).run(
        user_id,
        amount,
        category,
        description,
        new Date().toISOString().split("T")[0]
      )

      created++
    }


    /* READ EXPENSE */

     if (action === "read_expense") {

      const row = db.prepare(`
        SELECT SUM(amount) as total
        FROM expenses
        WHERE user_id=? AND LOWER(category)=LOWER(?)
      `).get(user_id, category)

      reply += `${category}: ₹${row?.total || 0}\n`
    }
    


    /* DELETE EXPENSE */

    if (action === "delete_expense") {

      const info = db.prepare(`
        DELETE FROM expenses
        WHERE user_id=? AND LOWER(category)=LOWER(?)
      `).run(user_id, category)

      deleted += info.changes
    }


    /* UPDATE EXPENSE */

    if (action === "update_expense") {

      db.prepare(`
        UPDATE expenses
        SET amount=?
        WHERE id = (
          SELECT id FROM expenses
          WHERE user_id=? AND LOWER(category)=LOWER(?)
          ORDER BY id DESC LIMIT 1
        )
      `).run(item.amount, user_id, category)

      updated++
    }

  }


  /* RESPONSE PRIORITY */

  if (reply && reply.trim() !== "") {
  return res.json({ reply });
}

if (created > 0) {
  return res.json({ reply: `Added ${created} expenses successfully` });
}

if (deleted > 0) {
  return res.json({ reply: `Deleted ${deleted} expenses` });
}

if (updated > 0) {
  return res.json({ reply: `Updated ${updated} expenses` });
}

return res.json({ reply: "No expenses found for that category." });
}

    /* SINGLE CREATE */

    if (result.action === "create_expense") {

      const amount = result.amount || 0;
      const category = result.category || "General";
      const description = result.description || category;

      db.prepare(`
        INSERT INTO expenses(user_id,amount,category,description,date)
        VALUES (?,?,?,?,?)
      `).run(
  user_id,
  amount,
  "₹",
  category,
  description,
  new Date().toISOString().split("T")[0]
      );

      return res.json({
        reply: `Added ₹${amount} for ${description}`
      });

    }

    /* SINGLE READ */

    if (result.action === "read_expense") {

      const categories = (result.category || "").split(/and|,/).map(c => c.trim());

      let reply = "";

      categories.forEach(cat => {

        const row = db.prepare(`
          SELECT SUM(amount) as total
          FROM expenses
          WHERE user_id=? AND LOWER(category)=LOWER(?)
        `).get(user_id, cat);

        reply += `${cat}: ₹${row?.total || 0}\n`;

      });

      return res.json({ reply });

    }

    /* SINGLE UPDATE */

    if (result.action === "update_expense") {

      db.prepare(`
        UPDATE expenses
        SET amount=?
        WHERE id = (
          SELECT id FROM expenses
          WHERE user_id=?
          ORDER BY id DESC LIMIT 1
        )
      `).run(result.amount, user_id);

      return res.json({
        reply: "Last expense updated"
      });

    }

    /* SINGLE DELETE */

    if (result.action === "delete_expense") {

      const info = db.prepare(`
        DELETE FROM expenses
        WHERE user_id=? AND LOWER(category)=LOWER(?)
      `).run(user_id, result.category);

      return res.json({
        reply: `Deleted ${info.changes} ${result.category} expenses`
      });

    }

    return res.json({
      reply: "I couldn't understand your request."
    });

  } catch (error) {

    console.error("Chatbot error:", error);

    res.status(500).json({
      reply: "Server error"
    });

  }

});
/* ===========================
   START SERVER
=========================== */

app.listen(5000, () => {

  console.log("Server running on port 5000")

})