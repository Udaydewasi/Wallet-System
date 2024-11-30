const { query } = require('../config/db');  // Import query from the db config
const redisClient = require('../config/redisClient');


exports.getBalance = async (req, res) => {
  // const user_id = req.user_id;  // User ID from JWT (Authenticated User)
  const {user_id} = req.body;

  try {

    // Check if wallet balance is cached in Redis
    const cachedBalance = await new Promise((resolve, reject) => {
      redisClient.get(`wallet_balance:${user_id}`, (err, data) => {
        if (err) reject(err);
        resolve(data);  // Return the cached balance (if exists)
      });
    });

    if (cachedBalance) {
      // If cached balance is found, return it
      return res.status(200).json({
        success: true,
        balance: Number(cachedBalance), // Convert from string to number
        source: 'cache', // Indicate that this came from Redis
      });
    }

    // 1. Fetch the wallet balance for the given userId
    const result = await query('SELECT balance FROM wallets WHERE user_id = $1', [user_id]);

    // 2. If wallet not found
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: "Wallet not found" });
    }

    // 3. Return the wallet balance
    const balance = result.rows[0].balance;

    // Cache the balance in Redis with a TTL (Time to Live) of 60 seconds
    redisClient.setex(`wallet_balance:${user_id}`, 60, balance);

    return res.status(200).json({
      success: true,
      balance: balance,
      source: 'database',
    });
  } catch (error) {
    console.error("Error fetching wallet balance:", error.message);
    return res.status(500).json({ success: false, message: "Error fetching wallet balance" });
  }
};


exports.getHistory = async (req, res) => {
  const {user_id} = req.body;  // User ID from JWT (Authenticated User)

  try {
    // 1. Fetch the wallet balance for the given userId
    const result = await query('SELECT balance FROM wallets WHERE user_id = $1', [user_id]);

    // 2. If wallet not found
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: "Wallet not found" });
    }

    const transactionHistory = await query(
      'SELECT * FROM transactions WHERE wallet_id = $1 ORDER BY created_at DESC',
      [user_id]
    );

    
    return res.status(200).json({
      success: true,
      transaction: transactionHistory.rows,
    });
  } catch (error) {
    console.error("Error fetching wallet history:", error.message);
    return res.status(500).json({ success: false, message: "Error fetching wallet history" });
  }
};