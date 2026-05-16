const mongoose = require("mongoose");

const paperSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    fileName: {
      type: String,
      required: true,
    },
    filePath: {
      type: String,
      default: "",
    },
    extractedText: {
      type: String,
      required: true,
    },
    chunks: [
      {
        text: String,
        embedding: [Number],
      },
    ],
    notes: {
      type: String,
      default: "",
    },
    highlights: [
      {
        selectedText: { type: String, required: true },
        startOffset: { type: Number, required: true },
        endOffset: { type: Number, required: true },
        heading: { type: String, default: "" },
        note: { type: String, default: "" },
        color: { type: String, default: "#FBBF24" },
        pageNumber: { type: Number, default: 0 },
        createdAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Paper", paperSchema);
