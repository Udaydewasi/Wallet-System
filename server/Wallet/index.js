const express = require('express');
// const walletRoutes = require('./routes/walletRoutes');
const transactionRoutes = require('./routes/transactionRoutes');
const { connectDB } = require("./config/db"); // PostgreSQL connection

const app = express();
app.use(express.json());
require('dotenv').config();

// Setting up port number
const PORT = process.env.PORT || 3004;


// Connecting to the database
connectDB();

// Setting up routes
// app.use("/api/v1/wallet", walletRoutes); // Wallet routes
app.use('/api/v1/wallet', transactionRoutes); //transaction routes

// Health check endpoint
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Server is up and running...",
  });
});

// Listening to the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
