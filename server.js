require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const app=express();
connectDB();
app.use(express.json());
app.get("/",(req,res)=> {
    res.send("Server running.");
});
app.use(cors());
app.use("/api/auth",authRoutes);
const PORT = 5000;
app.listen(PORT,()=> {
    console.log(`Server running on port ${PORT}`)
});
