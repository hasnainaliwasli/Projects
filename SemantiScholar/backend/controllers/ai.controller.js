const OpenAI = require("openai");
const Paper = require("../models/Paper");
const asyncHandler = require("../middleware/asyncHandler");
const { AppError } = require("../middleware/errorHandler");
const { sendResponse } = require("../utils/response");

/**
 * @desc    Query the AI assistant about a specific paper
 * @route   POST /api/ai/query
 * @access  Private
 */
const queryAI = asyncHandler(async (req, res, next) => {
  const { query, paperId } = req.body;

  if (!query) {
    return next(new AppError("Please provide a query", 400));
  }

  if (!paperId) {
    return next(new AppError("Please select a paper to query", 400));
  }

  console.log("GROQ_API_KEY loaded:", process.env.GROQ_API_KEY ? "YES (" + process.env.GROQ_API_KEY.substring(0, 10) + "...)" : "NO");
  if (!process.env.GROQ_API_KEY) {
    return next(new AppError("AI features are not configured on this server. GROQ_API_KEY is missing from .env", 501));
  }

  try {
    // 1. Fetch the selected paper's full extracted text
    const paper = await Paper.findOne({ _id: paperId, userId: req.user.id }).select("fileName extractedText");

    if (!paper) {
      return next(new AppError("Paper not found", 404));
    }

    if (!paper.extractedText || paper.extractedText.trim().length === 0) {
      return sendResponse(res, 200, "Success", {
        answer: "This paper doesn't have any extracted text content. Please try re-uploading the document.",
        sources: [paper.fileName],
      });
    }

    // 2. Truncate context if it's extremely long (keep under ~25k chars for Groq free tier)
    const MAX_CONTEXT_CHARS = 25000;
    let context = paper.extractedText;
    if (context.length > MAX_CONTEXT_CHARS) {
      context = context.substring(0, MAX_CONTEXT_CHARS) + "\n\n[... text truncated for length ...]";
    }

    // 3. Build prompt and send to Groq (OpenAI-compatible API)
    const groq = new OpenAI({
      apiKey: process.env.GROQ_API_KEY,
      baseURL: "https://api.groq.com/openai/v1",
    });

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content: `You are a helpful, expert AI research assistant.
Answer the user's question based STRICTLY on the provided document text below.
Use very easy and simple wordings so anyone can understand clearly.
If the answer is not contained in the document, politely inform the user that you cannot find the answer in this specific paper. Do NOT use your own knowledge to answer.
Do not invent or hallucinate information.

DOCUMENT: "${paper.fileName}"
─────────────────────────────
${context}
─────────────────────────────`,
        },
        {
          role: "user",
          content: query,
        },
      ],
      temperature: 0.3,
      max_tokens: 2048,
    });

    const answer = completion.choices[0]?.message?.content || "Sorry, I couldn't generate a response.";

    // 4. Return Answer and Source
    sendResponse(res, 200, "Query processed successfully", {
      answer,
      sources: [paper.fileName],
    });

  } catch (error) {
    console.error("AI Query Error:", error);
    return next(new AppError("Failed to process AI query", 500));
  }
});

/**
 * @desc    Generate a summary of a specific paper
 * @route   POST /api/ai/summary
 * @access  Private
 */
const generateSummary = asyncHandler(async (req, res, next) => {
  const { paperId } = req.body;

  if (!paperId) {
    return next(new AppError("Please select a paper to summarize", 400));
  }

  if (!process.env.GROQ_API_KEY) {
    return next(new AppError("AI features are not configured on this server. GROQ_API_KEY is missing from .env", 501));
  }

  try {
    // 1. Fetch the selected paper
    const paper = await Paper.findOne({ _id: paperId, userId: req.user.id }).select("fileName extractedText");

    if (!paper) {
      return next(new AppError("Paper not found", 404));
    }

    if (!paper.extractedText || paper.extractedText.trim().length === 0) {
      return sendResponse(res, 200, "Success", {
        summary: "This paper doesn't have any extracted text content to summarize. Please try re-uploading the document.",
      });
    }

    // 2. Truncate context if it's extremely long
    const MAX_CONTEXT_CHARS = 25000;
    let context = paper.extractedText;
    if (context.length > MAX_CONTEXT_CHARS) {
      context = context.substring(0, MAX_CONTEXT_CHARS) + "\n\n[... text truncated for length ...]";
    }

    // 3. Build prompt and send to Groq
    const groq = new OpenAI({
      apiKey: process.env.GROQ_API_KEY,
      baseURL: "https://api.groq.com/openai/v1",
    });

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content: `You are a helpful, expert AI research assistant.
Your task is to provide a comprehensive, well-structured, and easy-to-understand summary of the provided document text.
Highlight the main objective, key findings, and conclusion of the paper.
Use clear headings or bullet points if necessary.

DOCUMENT: "${paper.fileName}"
─────────────────────────────
${context}
─────────────────────────────`,
        },
        {
          role: "user",
          content: "Please summarize this document.",
        },
      ],
      temperature: 0.3,
      max_tokens: 2048,
    });

    const summary = completion.choices[0]?.message?.content || "Sorry, I couldn't generate a summary.";

    // 4. Return Answer
    sendResponse(res, 200, "Summary generated successfully", {
      summary,
    });

  } catch (error) {
    console.error("AI Summary Error:", error);
    return next(new AppError("Failed to generate summary", 500));
  }
});

module.exports = {
  queryAI,
  generateSummary,
};
