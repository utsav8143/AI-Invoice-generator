import 'dotenv/config';
import Invoice from '../models/Invoice.js';
import { GoogleGenAI } from '@google/genai';


const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_GENAI_API_KEY});
const parseInvoiceFromText = async (req, res) => {
  const { text } = req.body;

  if (!text) return res.status(400).json({ message: "Text is required" });

  try {
    const prompt = `
    You are an expert invoice data extraction AI. Analyse the following text and extract the relevant information to create an invoice.
    The output MUST be a valid JSON object.
    The JSON object should have the following structure:
    {
      "clientName": "string",
      "email": "string (if available)",
      "address": "string (if available)",
      "items": [
        {
          "name": "string",
          "quantity": "number",
          "unitPrice": "number"
        }
      ]
    }
    Here is the text to parse:
    ---TEXT START---
    ${text}
    ---TEXT END---

    Extract the data and provide only the JSON object.`;

    const response = await ai.models.generateContent({
     model: "models/gemini-2.5-flash",
      contents: prompt,
    });

    const responseText = typeof response.text === "function"
      ? response.text()
      : response.text;

    if (!responseText) throw new Error("Could not extract text from AI response");

    const cleanedJson = responseText
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    const parsedData = JSON.parse(cleanedJson);

    res.status(200).json(parsedData);
  } catch (error) {
    console.error("Error parsing invoice with AI", error);
    res.status(500).json({
      message: "Failed to parse invoice data from text",
      details: error.message,
    });
  }
};

const generateReminderEmail = async (req, res) => {
  try {
    const {
      clientName,
      invoiceNumber,
      amount,
      dueDate,
      businessName,
      daysOverdue,
    } = req.body;

    // Basic validation
    if (!clientName || !invoiceNumber || !amount || !dueDate) {
      return res.status(400).json({
        message:
          "Missing required fields: clientName, invoiceNumber, amount, dueDate",
      });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `
Write a polite, professional payment reminder email for an unpaid invoice.

Details:
- Client name: ${clientName}
- Invoice number: ${invoiceNumber}
- Amount due: ${amount}
- Due date: ${dueDate}
${daysOverdue ? `- Days overdue: ${daysOverdue}` : ""}
${businessName ? `- Sent from: ${businessName}` : ""}

Requirements:
- Keep it concise (under 150 words)
- Friendly but firm tone, not aggressive
- Include a clear call to action to pay the invoice
- Do not invent details not provided above
- Return ONLY the email body text — no subject line, no markdown formatting
`;

    const result = await model.generateContent(prompt);
    const emailText = result.response.text();

    res.status(200).json({
      message: "Reminder email generated successfully",
      email: emailText,
    });
  } catch (error) {
    console.error("Error generating email with AI", error);
    res.status(500).json({
      message: "Failed to generate reminder email",
      details: error.message,
    });
  }
};

const getDashboardSummary = async (req, res) => {
  try {
    const invoices = await Invoice.find({ user: req.user.id });

    if (!invoices.length) {
      return res.status(200).json({ insights: ["No invoices yet. Create your first invoice."] });
    }

    const totalRevenue = invoices.reduce((sum, inv) => sum + (inv.total || 0), 0);
    const unpaid = invoices.filter(inv => inv.status !== "Paid").length;
    const summary = `Total invoices: ${invoices.length}, Total revenue: ₹${totalRevenue}, Unpaid invoices: ${unpaid}`;

    try {
      const prompt = `You are a financial assistant. Based on this invoice summary: "${summary}",
      provide exactly 3 short, actionable business insights as a JSON array of strings.
      Example: ["insight 1", "insight 2", "insight 3"]
      Return only the JSON array, no extra text.`;

      const response = await ai.models.generateContent({
        model: "models/gemini-2.5-flash",
        contents: prompt,
      });

      const responseText = typeof response.text === "function" ? response.text() : response.text;

      const cleaned = responseText
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();

      const insights = JSON.parse(cleaned);
      return res.status(200).json({ insights });

    } catch (aiError) {
      // AI failed (quota, downtime, bad JSON, etc.) — don't 500 the whole dashboard.
      console.error("AI insight generation failed, using fallback:", aiError.message);

      const fallbackInsights = [
        `You have ${invoices.length} invoice(s) totaling ₹${totalRevenue} in revenue.`,
        unpaid > 0
          ? `${unpaid} invoice(s) are still unpaid — consider sending a reminder.`
          : "All invoices are currently paid. Nice work staying on top of things.",
        "AI-powered insights are temporarily unavailable; showing basic stats instead.",
      ];

      return res.status(200).json({ insights: fallbackInsights, aiUnavailable: true });
    }

  } catch (error) {
    // Real server error (DB down, auth failure, etc.) — this one should 500.
    console.error("Error generating dashboard summary", error);
    res.status(500).json({
      message: "Failed to generate dashboard summary",
      details: error.message,
    });
  }
};

export { parseInvoiceFromText, generateReminderEmail, getDashboardSummary };