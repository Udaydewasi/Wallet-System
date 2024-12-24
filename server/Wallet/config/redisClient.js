const redis = require('redis');
require("dotenv").config();

// const redisClient = redis.createClient();
// (async () => { await redisClient.connect(); })();

const redisClient = redis.createClient({
  legacyMode: true,
 // PORT: 5001,
   url: process.env.REDIS_URL || 'redis://localhost:5001',
})
redisClient.connect().catch(console.error)

module.exports = redisClient;
