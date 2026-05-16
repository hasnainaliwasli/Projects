const express = require("express");
const router = express.Router();
const { queryAI, generateSummary } = require("../controllers/ai.controller");
const { protect } = require("../middleware/auth");

router.post("/query", protect, queryAI);
router.post("/summary", protect, generateSummary);

module.exports = router;
