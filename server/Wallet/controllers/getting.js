const { query, transaction } = require('../config/db');  // Import query from the db config

exports.getBalance = async (req, res) => {
  const {user_id} = req.body;  // User ID from JWT (Authenticated User)

  try {
    // 1. Fetch the wallet balance for the given userId
    const result = await query('SELECT balance FROM wallets WHERE user_id = $1', [user_id]);

    // 2. If wallet not found
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: "Wallet not found" });
    }

    // 3. Return the wallet balance
    const wallet = result.rows[0];  // The first row contains the balance
    return res.status(200).json({
      success: true,
      balance: wallet.balance,
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