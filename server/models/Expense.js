const mongoose = require("mongoose");

const entrySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  amount: {
    type: Number,
    required: true,
    min: 0,
  },
  date: {
    type: String, // stored as "YYYY-MM-DD" from the date input
    default: "",
  },
});

const expenseSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    month: {
      type: Number, // 1-12
      required: true,
    },
    year: {
      type: Number,
      required: true,
    },
    budget: {
      type: Number,
      required: true,
      default: 0,
    },
    daysInMonth: {
      type: Number,
      required: true,
    },
    entries: [entrySchema],
  },
  {
    timestamps: true,
  }
);

// One document per user per month/year
expenseSchema.index({ userId: 1, month: 1, year: 1 }, { unique: true });

const Expense = mongoose.model("Expense", expenseSchema);
module.exports = Expense;