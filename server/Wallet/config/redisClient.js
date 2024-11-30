const redis = require('redis');

// const redisClient = redis.createClient();
// (async () => { await redisClient.connect(); })();

const redisClient = redis.createClient({
  legacyMode: true,
  PORT: 5001
})
redisClient.connect().catch(console.error)

module.exports = redisClient;