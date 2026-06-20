require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const expenseRoutes = require("./routes/expenseRoutes");
const app = express();
connectDB();
app.use(express.json());
app.get("/", (req, res) => {
    res.send("Server running.");
});
app.use(cors());
app.use("/api/auth", authRoutes);
app.use("/api/expenses", expenseRoutes);
const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
});