const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const { parseEntry, getInsights } = require("../controllers/aiController");

router.post("/parse-entry", authMiddleware, parseEntry);
router.get("/insights/:month/:year", authMiddleware, getInsights);

module.exports = router;