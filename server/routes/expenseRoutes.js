const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const {
  saveExpense,
  getExpenseByMonth,
  getAllExpenses,
  deleteExpense,
} = require("../controllers/expenseController");

router.post("/", authMiddleware, saveExpense);
router.get("/", authMiddleware, getAllExpenses);
router.get("/:month/:year", authMiddleware, getExpenseByMonth);
router.delete("/:id", authMiddleware, deleteExpense);

module.exports = router;