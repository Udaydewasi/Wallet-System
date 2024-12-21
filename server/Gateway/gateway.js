const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const rateLimit = require('express-rate-limit');
const axios = require('axios');
const logger = require('./logs/logger');
require('dotenv').config(); 

// Create the express app
const app = express();

// Rate limiting middleware (10 requests per minute)
const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10, // limit each IP to 10 requests per windowMs
  message: 'Too many requests, please try again later.',
});

app.use(limiter); // Apply rate limiting globally

// Proxy setup for Auth and Wallet microservices
const AUTH_SERVICE_URL = process.env.AUTH_SERVICE_URL || 'http://127.0.0.1:4000';
const WALLET_SERVICE_URL = process.env.WALLET_SERVICE_URL || 'http://127.0.0.1:4001';
const PORT = process.env.GATEWAY_PORT || 3000;


// Route requests to the appropriate service
app.use('/authgate', createProxyMiddleware({
  target: AUTH_SERVICE_URL,
  changeOrigin: true,
  pathRewrite: {
    '^/authgate': '/authgate', // rewrite paths if needed
  },
}));

app.use('/walletgate', createProxyMiddleware({
  target: WALLET_SERVICE_URL,
  changeOrigin: true,
  pathRewrite: {
    '^/walletgate': '/walletgate', // No path change
  },
}));


// Health check endpoint
app.get('/', (req, res) => {
    res.json({ message: 'API Gateway is running! Test gateway!' });
});

// Start the Gateway service
app.listen(PORT, () => {
  logger.info(`Gateway Service running on port ${PORT}`);
});
