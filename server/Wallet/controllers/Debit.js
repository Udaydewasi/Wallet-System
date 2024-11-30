const { query } = require('../config/db');  // Import query from your db config
const {mailSender} = require('../utils/mailSender');
const {transactionEmail} = require('../mailTemplate/transaction');
 
exports.debitFunds = async (req, res) => {
  const { amount, user_id, email } = req.body;  // Amount to deposit
  // const user_id = req.user_id;    // User ID from JWT (Authenticated User)
  // const email = req.email;  

  const Amount = Number(amount);
  // Validate the amount
  if (!Amount || Amount <= 0) {
    return res.status(400).json({ success: false, message: "Invalid amount" });
  }

  try {
    // 1. Fetch the wallet for the user
  
    const result = await query('SELECT balance FROM wallets WHERE user_id = $1', [user_id]);

    if (result.rows.length === 0) {
      // Wallet not found
      return res.status(404).json({ success: false, message: "Wallet not found", user_id : user_id});
    }

    
    const wallet = result.rows[0];
    const walletBalance = Number(wallet.balance); // Convert to a number

    // 2. Check if the wallet has sufficient balance
    if (walletBalance < Amount) {
      return res.status(403).json({ success: false, message: "Insufficient balance in wallet"});
    }

    // 3. Deduct the amount from the wallet balance
    const newBalance = walletBalance - Amount;

    // 4. Update the wallet balance in the database
    const updateResult = await query(
      'UPDATE wallets SET balance = $1 WHERE user_id = $2 RETURNING balance',
      [newBalance, user_id]
    );

    // 5. Return the updated wallet balance
    const updatedBalance = updateResult.rows[0].balance;

    //insert transaction in the history table

    await query(
      'INSERT INTO transactions (wallet_id, type, amount) VALUES ($1, $2, $3)',
      [user_id, 'debited', Amount]
    );

     // Emit event to notify clients of the updated balance
     const io = require('../utils/socket').getIO(); // Get Socket.IO instance
     io.emit('walletUpdated', { user_id, balance: newBalance });
    
     //mail to inform to account holder
     await mailSender(
      email,
      `Payment Debited`,
      transactionEmail(
        'Debited',
        amount,
        user_id
      )
    );

    return res.status(200).json({
      success: true,
      message: `Debited ${Amount} from wallet`,
      balance: updatedBalance,
    });
  } catch (error) {
    console.error("Error debiting funds:", error.message);
    return res.status(500).json({
      success: false, 
      message: "Error debiting funds" 
    });
  }
};