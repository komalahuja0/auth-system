const Expense = require("../models/Expense");

// Create or update the expense doc for a given month/year (upsert)
const saveExpense = async (req, res) => {
  try {
    const { month, year, budget, daysInMonth, entries } = req.body;

    if (!month || !year) {
      return res.status(400).json({
        success: false,
        message: "Month and year are required",
      });
    }

    const expense = await Expense.findOneAndUpdate(
      { userId: req.user.userId, month, year },
      { budget, daysInMonth, entries, userId: req.user.userId, month, year },
      { new: true, upsert: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: "Expense data saved",
      expense,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get a single month's data for the logged-in user
const getExpenseByMonth = async (req, res) => {
  try {
    const { month, year } = req.params;

    const expense = await Expense.findOne({
      userId: req.user.userId,
      month,
      year,
    });

    res.status(200).json({
      success: true,
      expense: expense || null,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get history (all months) for the logged-in user
const getAllExpenses = async (req, res) => {
  try {
    const expenses = await Expense.find({ userId: req.user.userId }).sort({
      year: -1,
      month: -1,
    });

    res.status(200).json({
      success: true,
      expenses,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Delete a month's record
const deleteExpense = async (req, res) => {
  try {
    const { id } = req.params;

    const expense = await Expense.findOneAndDelete({
      _id: id,
      userId: req.user.userId,
    });

    if (!expense) {
      return res.status(404).json({
        success: false,
        message: "Record not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Record deleted",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  saveExpense,
  getExpenseByMonth,
  getAllExpenses,
  deleteExpense,
};