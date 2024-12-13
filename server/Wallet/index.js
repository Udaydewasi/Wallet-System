const express = require('express');
const http = require('http'); // To create an HTTP server
const transactionRoutes = require('./routes/transactionRoutes');
const { connectDB } = require('./config/db'); // PostgreSQL connection
const { init } = require('./utils/socket'); // Import the socket initializer
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3004;
const server = http.createServer(app);

require('dotenv').config();
init(server);


app.use(cors({ 
  origin: "http://localhost:3000", // Adjust as per your frontend URL
  credentials: true,
  allowedHeaders: ["Authorization", "Content-Type"] 
}));

app.use(express.json()); // Middleware to parse JSON requests

// Connect to the database
connectDB();

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
