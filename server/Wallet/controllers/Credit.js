const { query } = require('../config/db');  // Import query from your db config

exports.creditFunds = async (req, res) => {
  const { amount } = req.body;  // Amount to deposit
  const userId = req.userId;    // User ID from JWT (Authenticated User)

  // Validate the amount
  if (!amount || amount <= 0) {
    return res.status(400).json({ success: false, message: "Invalid amount" });
  }

  try {
    // 1. Fetch the wallet for the user
    const result = await query('SELECT balance FROM wallets WHERE user_id = $1', [userId]);

    if (result.rows.length === 0) {
      // Wallet not found
      return res.status(404).json({ success: false, message: "Wallet not found" });
    }

    const wallet = result.rows[0];

    // 2. Check if the wallet has sufficient balance
    if (wallet.balance < amount) {
      return res.status(403).json({ success: false, message: "Insufficient balance in wallet" });
    }

    // 3. Deduct the amount from the wallet balance
    const newBalance = wallet.balance - amount;

    // 4. Update the wallet balance in the database
    const updateResult = await query(
      'UPDATE wallets SET balance = $1 WHERE user_id = $2 RETURNING balance',
      [newBalance, userId]
    );

    // 5. Return the updated wallet balance
    const updatedBalance = updateResult.rows[0].balance;

    return res.status(200).json({
      success: true,
      message: `Credited ${amount} from wallet`,
      balance: updatedBalance,
    });
  } catch (error) {
    console.error("Error crediting funds:", error.message);
    return res.status(500).json({ success: false, message: "Error crediting funds" });
  }
};