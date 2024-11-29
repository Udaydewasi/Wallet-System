const { query } = require('../config/db');  // Assuming query function from your config/db.js

exports.depositFunds = async (req, res) => {
  const { amount } = req.body;  // Amount to deposit
  const user_id = req.user_id;   // User ID from JWT (Authenticated User)

  const Amount = Number(amount);
  // Validate the amount
  if (!Amount || Amount <= 0) {
    return res.status(400).json({ success: false, message: "Invalid amount" });
  }

  try {
    // 1. Fetch the wallet for the user
    const result = await query('SELECT balance FROM wallets WHERE user_id = $1', [user_id]);

    if (result.rows.length === 0) {
      // 2. If the wallet is not found
      return res.status(404).json({ success: false, message: "Wallet not found" });
    }

    const wallet = result.rows[0];  // Get the wallet balance
    const walletBalance = Number(wallet.balance); // Convert to a number

    // 3. Update the wallet balance by adding the deposit amount
    const newBalance = walletBalance + Amount;

    // 4. Update the wallet balance in the database
    const updateResult = await query(
      'UPDATE wallets SET balance = $1 WHERE user_id = $2 RETURNING balance',
      [newBalance, user_id]
    );

    // 5. Return the updated wallet balance
    const updatedBalance = updateResult.rows[0].balance;

    //Insert each transaction in the history table    
    await query(
      'INSERT INTO transactions (wallet_id, type, amount) VALUES ($1, $2, $3)',
      [user_id, 'deposited', Amount]
    );

    return res.status(200).json({
      success: true,
      message: `Deposited ${Amount} into wallet`,
      balance: updatedBalance,
    });
  } catch (error) {
    console.error("Error depositing funds:", error.message);
    return res.status(500).json({ success: false, message: "Error depositing funds" });
  }
};
