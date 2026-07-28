const express = require("express");
require("dotenv").config();
const authRoutes = require("./routes/authRoutes");

require("./config/db");

const app = express();

const PORT = 5000;

// Middleware to parse JSON
app.use(express.json());

app.get("/", (req, res) => {
    res.send("Server is running");
});

// Routes
app.use("/api/auth", authRoutes);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});