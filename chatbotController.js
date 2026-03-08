const OpenAI = require("openai");
const db = require("./db");
const systemPrompt = require("./systemPrompt");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Retry logic with exponential backoff
async function makeAPICallWithRetry(maxRetries = 2) {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: message }
        ]
      });
      return response;
    } catch (error) {
      // 429 = Rate limit, 401 = Invalid API key, 403 = Quota exceeded
      if (error.status === 429 && attempt < maxRetries) {
        const delayMs = Math.pow(2, attempt) * 1000; // 2s, 4s
        console.log(`Rate limited. Retrying in ${delayMs}ms...`);
        await new Promise(resolve => setTimeout(resolve, delayMs));
      } else if (error.status === 429 || error.code === 'insufficient_quota') {
        throw new Error("API quota exceeded. Please check your OpenAI billing at https://platform.openai.com/account/billing");
      } else {
        throw error;
      }
    }
  }
}

async function handleChat(message){

  const response = await makeAPICallWithRetry();

  const aiResult = JSON.parse(response.choices[0].message.content);

  if(aiResult.action === "create_expense"){

    db.run(
      "INSERT INTO expenses (amount,category,merchant,date) VALUES (?,?,?,?)",
      [
        aiResult.amount,
        aiResult.category,
        aiResult.merchant,
        aiResult.date
      ]
    );

    return `Added $${aiResult.amount} for ${aiResult.merchant}`;
  }

  if(aiResult.action === "read_expense"){

    return new Promise((resolve)=>{
      db.get(
        "SELECT SUM(amount) as total FROM expenses WHERE category=?",
        [aiResult.category],
        (err,row)=>{
          resolve(`You spent $${row.total || 0} on ${aiResult.category}`);
        }
      );
    });

  }

  if(aiResult.action === "update_expense"){

    db.run(
      "UPDATE expenses SET amount=? WHERE id=(SELECT id FROM expenses ORDER BY id DESC LIMIT 1)",
      [aiResult.amount]
    );

    return "Last expense updated";
  }

  if(aiResult.action === "delete_expense"){

    db.run(
      "DELETE FROM expenses WHERE id=(SELECT id FROM expenses ORDER BY id DESC LIMIT 1)"
    );

    return "Last expense deleted";
  }

  return "Sorry, I couldn't understand.";
}

module.exports = handleChat;