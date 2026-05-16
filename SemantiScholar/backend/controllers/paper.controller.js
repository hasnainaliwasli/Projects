const pdf = require("pdf-parse");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const Paper = require("../models/Paper");
const asyncHandler = require("../middleware/asyncHandler");
const { AppError } = require("../middleware/errorHandler");
const { sendResponse } = require("../utils/response");

/**
 * Split text into chunks of roughly roughly 500-1000 words.
 * Simple implementation: split by paragraphs, then combine until word limit.
 */
const chunkText = (text, minWords = 500, maxWords = 1000) => {
  const paragraphs = text.split(/\n\s*\n/);
  const chunks = [];
  let currentChunk = "";
  let currentWordCount = 0;

  for (const para of paragraphs) {
    const cleanedPara = para.trim();
    if (!cleanedPara) continue;

    const paraWordCount = cleanedPara.split(/\s+/).length;

    if (currentWordCount + paraWordCount > maxWords && currentWordCount >= minWords) {
      chunks.push(currentChunk.trim());
      currentChunk = cleanedPara + "\n\n";
      currentWordCount = paraWordCount;
    } else {
      currentChunk += cleanedPara + "\n\n";
      currentWordCount += paraWordCount;
    }
  }

  if (currentChunk.trim()) {
    chunks.push(currentChunk.trim());
  }

  return chunks;
};

/**
 * @desc    Upload and process a PDF paper
 * @route   POST /api/papers/upload
 * @access  Private
 */
const uploadPaper = asyncHandler(async (req, res, next) => {
  if (!req.file) {
    return next(new AppError("Please upload a PDF file", 400));
  }

  if (req.file.mimetype !== "application/pdf") {
    return next(new AppError("Only PDF files are allowed", 400));
  }

  try {
    // Extract text from PDF buffer
    const pdfData = await pdf(req.file.buffer);
    const extractedText = pdfData.text;

    if (!extractedText || extractedText.trim().length === 0) {
      return next(new AppError("No readable text found. Please ensure the PDF contains selectable text and is not a scanned image.", 400));
    }

    // Chunk the text
    const textChunks = chunkText(extractedText);

    // Generate embeddings if Gemini API key is available
    let chunks = [];
    if (process.env.GEMINI_API_KEY) {
      try {
        const { GoogleGenerativeAI } = require("@google/generative-ai");
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const embeddingModel = genAI.getGenerativeModel({ model: "text-embedding-004" });
        
        chunks = await Promise.all(textChunks.map(async (text) => {
          const result = await embeddingModel.embedContent(text);
          return {
            text,
            embedding: result.embedding.values
          };
        }));
      } catch (err) {
        console.error("Embedding generation failed:", err);
        chunks = textChunks.map(text => ({ text, embedding: [] }));
      }
    } else {
      chunks = textChunks.map(text => ({ text, embedding: [] }));
    }

    // Save PDF file to disk
    const uploadsDir = path.join(__dirname, "../uploads");
    if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });
    const uniqueName = crypto.randomUUID() + ".pdf";
    const filePath = path.join(uploadsDir, uniqueName);
    fs.writeFileSync(filePath, req.file.buffer);

    // Save to database
    const paper = await Paper.create({
      userId: req.user.id,
      fileName: req.file.originalname,
      filePath,
      extractedText,
      chunks,
    });

    sendResponse(res, 201, "Paper uploaded and processed successfully", {
      _id: paper._id,
      fileName: paper.fileName,
      chunkCount: chunks.length,
      createdAt: paper.createdAt,
      // Provide a preview of the text
      preview: extractedText.substring(0, 300) + "...",
    });
  } catch (error) {
    console.error("PDF Upload Failed:", error);
    return next(new AppError("Error processing PDF file: " + error.message, 500));
  }
});

/**
 * @desc    Get all papers for the current user
 * @route   GET /api/papers
 * @access  Private
 */
const getPapers = asyncHandler(async (req, res) => {
  const papers = await Paper.find({ userId: req.user.id })
    .select("-extractedText -chunks") // Exclude heavy text fields for the list
    .sort({ createdAt: -1 });

  sendResponse(res, 200, "Papers retrieved successfully", papers);
});

/**
 * @desc    Get a specific paper with its content
 * @route   GET /api/papers/:id
 * @access  Private
 */
const getPaperById = asyncHandler(async (req, res, next) => {
  const paper = await Paper.findOne({
    _id: req.params.id,
    userId: req.user.id,
  });

  if (!paper) {
    return next(new AppError("Paper not found", 404));
  }

  sendResponse(res, 200, "Paper retrieved successfully", paper);
});

/**
 * @desc    Update paper notes/annotations
 * @route   PUT /api/papers/:id/notes
 * @access  Private
 */
const updatePaperNotes = asyncHandler(async (req, res, next) => {
  const { notes } = req.body;

  const paper = await Paper.findOneAndUpdate(
    { _id: req.params.id, userId: req.user.id },
    { notes },
    { new: true, runValidators: true }
  ).select("-extractedText -chunks");

  if (!paper) {
    return next(new AppError("Paper not found", 404));
  }

  sendResponse(res, 200, "Notes updated successfully", paper);
});

/**
 * @desc    Serve the original PDF file
 * @route   GET /api/papers/:id/file
 * @access  Private
 */
const getFile = asyncHandler(async (req, res, next) => {
  const paper = await Paper.findOne({ _id: req.params.id, userId: req.user.id }).select("filePath");
  if (!paper || !paper.filePath) return next(new AppError("File not found", 404));
  const absPath = path.resolve(paper.filePath);
  if (!fs.existsSync(absPath)) return next(new AppError("File not found on disk", 404));
  res.set("Content-Type", "application/pdf");
  res.sendFile(absPath);
});

/**
 * @desc    Add a highlight to a paper
 * @route   POST /api/papers/:id/highlights
 * @access  Private
 */
const addHighlight = asyncHandler(async (req, res, next) => {
  const { selectedText, startOffset, endOffset, heading, note, color } = req.body;

  if (!selectedText || startOffset === undefined || endOffset === undefined) {
    return next(new AppError("selectedText, startOffset, and endOffset are required", 400));
  }

  const paper = await Paper.findOne({ _id: req.params.id, userId: req.user.id });
  if (!paper) return next(new AppError("Paper not found", 404));

  paper.highlights.push({ selectedText, startOffset, endOffset, heading, note, color });
  await paper.save();

  const newHighlight = paper.highlights[paper.highlights.length - 1];
  sendResponse(res, 201, "Highlight added", newHighlight);
});

/**
 * @desc    Delete a highlight from a paper
 * @route   DELETE /api/papers/:id/highlights/:highlightId
 * @access  Private
 */
const deleteHighlight = asyncHandler(async (req, res, next) => {
  const paper = await Paper.findOne({ _id: req.params.id, userId: req.user.id });
  if (!paper) return next(new AppError("Paper not found", 404));

  const highlight = paper.highlights.id(req.params.highlightId);
  if (!highlight) return next(new AppError("Highlight not found", 404));

  highlight.deleteOne();
  await paper.save();

  sendResponse(res, 200, "Highlight deleted");
});

/**
 * @desc    Delete a paper and its file
 * @route   DELETE /api/papers/:id
 * @access  Private
 */
const deletePaper = asyncHandler(async (req, res, next) => {
  const paper = await Paper.findOne({ _id: req.params.id, userId: req.user.id });
  if (!paper) return next(new AppError("Paper not found", 404));

  // Remove PDF file from disk
  if (paper.filePath && fs.existsSync(paper.filePath)) {
    fs.unlinkSync(paper.filePath);
  }

  await paper.deleteOne();
  sendResponse(res, 200, "Paper deleted successfully");
});

module.exports = {
  uploadPaper,
  getPapers,
  getPaperById,
  updatePaperNotes,
  addHighlight,
  deleteHighlight,
  getFile,
  deletePaper,
};
