const express = require("express");
const multer = require("multer");
const router = express.Router();
const { uploadPaper, getPapers, getPaperById, updatePaperNotes, addHighlight, deleteHighlight, getFile, deletePaper } = require("../controllers/paper.controller");
const { protect } = require("../middleware/auth");

// Configure multer to use memory storage
const storage = multer.memoryStorage();
const upload = multer({ 
  storage,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

// Protect all routes in this router
router.use(protect);

router.post("/upload", upload.single("file"), uploadPaper);
router.get("/", getPapers);
router.get("/:id", getPaperById);
router.get("/:id/file", getFile);
router.put("/:id/notes", updatePaperNotes);
router.post("/:id/highlights", addHighlight);
router.delete("/:id/highlights/:highlightId", deleteHighlight);
router.delete("/:id", deletePaper);

module.exports = router;
