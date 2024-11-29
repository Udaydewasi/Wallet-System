const express = require('express');
const http = require('http'); // To create an HTTP server
const transactionRoutes = require('./routes/transactionRoutes');
const { connectDB } = require('./config/db'); // PostgreSQL connection
const { init } = require('./utils/socket'); // Import the socket initializer

require('dotenv').config();

const app = express();
const server = http.createServer(app); // Attach Express to an HTTP server

app.use(express.json()); // Middleware to parse JSON requests

// Setting up port number
const PORT = process.env.PORT || 3004;

// Connect to the database
connectDB();

// Initialize Socket.IO
init(server); // Initialize Socket.IO and attach it to the HTTP server

// Health check endpoint
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Server is up and running...',
  });
});

// Define routes
app.use('/api/v1/wallet', transactionRoutes);

// Start the server
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
