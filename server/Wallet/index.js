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
  origin: "http://localhost:3001", 
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPETIONS", "PATCH", "HEAD"],
  allowedHeaders: ["Authorization", "Content-Type", 'Origin', 'X-Request-With', 'Accept', 'x-client-token', 'x-client-secret'], 
}));

app.options('*', cors());

app.use(express.json()); // Middleware to parse JSON requests

// Connect to the database
connectDB();

// Health check endpoint
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Server is up and running... start',
  });
});

// Define routes
app.use('/api/v1/wallet', transactionRoutes);

// Start the server
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
