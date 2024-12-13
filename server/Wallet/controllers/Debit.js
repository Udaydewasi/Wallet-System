const { query } = require('../config/db');  // Import query from your db config
const {mailSender} = require('../utils/mailSender');
const {transactionEmail} = require('../mailTemplate/transaction');
const redisClient = require('../config/redisClient');
const logger = require('../../../logs/logger');
const {notifyBalanceUpdate} = require('../utils/balanceNotify');
 
exports.debitFunds = async (req, res) => {
  const { amount } = req.body;  // Amount to deposit
  const user_id = req.user_id;    // User ID from JWT (Authenticated User)
  const email = req.email;  
 
  const Amount = Number(amount);
  // Validate the amount
  if (!Amount || Amount <= 0) {
    return res.status(400).json({ success: false, message: "Invalid amount" });
  }

  try {
    const cachedBalance = await new Promise((resolve, reject) => {
      redisClient.get(`wallet_balance:${user_id}`, (err, data) => {
        if (err) {
          reject(err);  // Reject the promise on Redis error
        }
        resolve(data);  // Return cached balance if available
      });
    });
    logger.info("2Working till now...");
    let walletBalance = 0;

    // If balance is found in Redis cache, use it
    if (cachedBalance && !isNaN(Number(cachedBalance))) {
      walletBalance = Number(cachedBalance); // Convert string to number
      logger.info('Wallet balance retrieved from Redis cache');
    } else {
      // 2. If balance not found in Redis, fetch it from PostgreSQL
      const result = await query('SELECT balance FROM wallets WHERE user_id = $1', [user_id]);

      if (result.rows.length === 0) {
        return res.status(404).json({
          success: false,
          message: "Wallet not found"
        });
      }

      walletBalance = Number(result.rows[0].balance); // Get wallet balance from the database
    }

    if(walletBalance < Amount){
      return res.status(400).json({
        success: false,
        message: "walletBalance is not sufficient",
      });
    }
    // 3. Update the wallet balance by adding the deposit amount
    const newBalance = walletBalance - Amount;

    // 4. Update the wallet balance in the database
    const updateResult = await query(
      'UPDATE wallets SET balance = $1 WHERE user_id = $2 RETURNING balance',
      [newBalance, user_id]
    );

    const updatedBalance = updateResult.rows[0].balance;

    // Insert the transaction into the history table
    await query(
      'INSERT INTO transactions (wallet_id, type, amount) VALUES ($1, $2, $3)',
      [user_id, 'debited', Amount]
    );
    logger.info("3Working till now...");
    // 5. Update the Redis cache with the new balance
    redisClient.setex(`wallet_balance:${user_id}`, 600, updatedBalance); // Cache with 60 seconds TTL

    logger.info("4Working till now...");
    // Emit event to notify clients of the updated balance
    const io = require('../utils/socket').getIO(); // Get Socket.IO instance
    io.emit('walletUpdated', { user_id, balance: newBalance });

    logger.info('Balance debited and Redis cache updated');

    logger.info(`${Amount}`);
    //MongoDB balance update
    await notifyBalanceUpdate(user_id, newBalance);

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
    process.on('exit', () => {
      logger.info('Closing Redis connection...');
      redisClient.quit();
    });

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