const redis = require('redis');
const logger = require('../logs/logger');

// Create a Redis client
const client = redis.createClient({
  host: '127.0.0.1',  // Redis server host
  port: 6379,         //(default is 6379)
});

client.on('connect', () => {
  logger.info('Connected to Redis');
});

client.on('error', (err) => {
  logger.error('Redis Error: ' + err);
});

module.exports = client;
