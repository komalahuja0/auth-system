const Expense = require("../models/Expense");

const ANTHROPIC_URL = "https://api.anthropic.com/v1/messages";

const callClaude = async (systemPrompt, userMessage) => {
  const response = await fetch(ANTHROPIC_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": process.env.ANTHROPIC_API_KEY,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-6",
      max_tokens: 500,
      system: systemPrompt,
      messages: [{ role: "user", content: userMessage }],
    }),
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Anthropic API error: ${errText}`);
  }

  const data = await response.json();
  const textBlock = data.content.find((c) => c.type === "text");
  return textBlock ? textBlock.text : "";
};

// Parse a natural language sentence like "spent 200 on coffee and 50 on bus"
// into structured { name, amount } entries
const parseEntry = async (req, res) => {
  try {
    const { text } = req.body;

    if (!text || !text.trim()) {
      return res.status(400).json({
        success: false,
        message: "Please describe what you spent.",
      });
    }

    const systemPrompt = `You convert a casual sentence about spending money into a strict JSON array.
Each item must be: {"name": "short expense label", "amount": number}.
Rules:
- Extract every distinct expense mentioned, even if multiple are in one sentence.
- "amount" must be a plain number (no currency symbols, no commas).
- If no clear amount is mentioned for an item, skip that item.
- Respond with ONLY the JSON array. No prose, no markdown fences, no explanation.
- If nothing parseable is found, respond with [].`;

    const raw = await callClaude(systemPrompt, text);
    const cleaned = raw.replace(/```json|```/g, "").trim();

    let parsed;
    try {
      parsed = JSON.parse(cleaned);
    } catch {
      parsed = [];
    }

    if (!Array.isArray(parsed)) parsed = [];

    const entries = parsed
      .filter((e) => e && e.name && typeof e.amount === "number" && e.amount > 0)
      .map((e) => ({ name: String(e.name).trim(), amount: e.amount }));

    res.status(200).json({
      success: true,
      entries,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Generate spending insights for a given month
const getInsights = async (req, res) => {
  try {
    const { month, year } = req.params;

    const expense = await Expense.findOne({
      userId: req.user.userId,
      month,
      year,
    });

    if (!expense || !expense.entries || expense.entries.length === 0) {
      return res.status(200).json({
        success: true,
        insight: "Add a few expenses first and I'll find patterns and tips for you.",
      });
    }

    const totalSpent = expense.entries.reduce((sum, e) => sum + e.amount, 0);
    const summary = expense.entries
      .map((e) => `${e.name}: Rs.${e.amount}`)
      .join(", ");

    const systemPrompt = `You are a concise personal finance assistant inside a budgeting app.
Given a user's monthly budget and their list of expenses, give short, genuinely useful insights.
Keep it to 3-4 short sentences max. Be specific (mention categories/amounts where relevant).
Mention if they're on track, overspending, or where most money is going.
Do not use markdown, headers, or bullet points - plain conversational sentences only.
Do not give generic advice like "track your spending" - they're already doing that here.`;

    const userMessage = `Monthly budget: Rs.${expense.budget}. Total spent so far: Rs.${totalSpent}. Expenses: ${summary}.`;

    const insight = await callClaude(systemPrompt, userMessage);

    res.status(200).json({
      success: true,
      insight: insight.trim(),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  parseEntry,
  getInsights,
};