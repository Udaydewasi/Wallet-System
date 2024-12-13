const { query, transaction } = require('../config/db'); // Import query and transaction utilities
const redisClient = require('../config/redisClient'); // Redis client
const logger = require('../../../logs/logger');
const { mailSender } = require('../utils/mailSender');
const { transactionEmail } = require('../mailTemplate/transaction');
const { getIO } = require('../utils/socket'); // Socket.IO instance
const {notifyBalanceUpdate} = require('../utils/balanceNotify');

exports.transferFunds = async (req, res) => {
  logger.info("Entered in the TransferFunds");
  const { receiver_id, amount, receiverEmail } = req.body; // Receiver, and Amount
  const sender_id = req.user_id;
  const senderEmail = req.email;

  logger.info("stagw 1");

  
  const Amount = Number(amount);
  logger.info(`s: ${sender_id}, r : ${receiver_id}`);
  // Validate input
  if (!sender_id || !receiver_id) {
    logger.info("yha pr");
    return res.status(400).json({ 
        success: false, 
        message: "Sender and receiver IDs are required" 
    });
  }

  logger.info("stagw 2");
  if (sender_id === receiver_id) {
    return res.status(400).json({ 
        success: false, 
        message: "Cannot transfer funds to the same wallet" 
    });
  }

  logger.info("stagw 3");
  if (!Amount || Amount <= 0) {
    return res.status(400).json({ 
        success: false, 
        message: "Invalid transfer amount" 
    });
  }

  try {
    // Use a transaction to ensure atomicity
    await transaction(async (client) => {
      // 1. Check sender's wallet balance (from Redis first)
      const cachedSenderBalance = await new Promise((resolve, reject) => {
        redisClient.get(`wallet_balance:${sender_id}`, (err, data) => {
          if (err) reject(err);
          resolve(data); // Resolve with cached balance if available
        });
      });


      // let senderBalance = cachedSenderBalance ? Number(cachedSenderBalance) : null;
      let senderBalance;
      if(cachedSenderBalance && !isNaN(Number(cachedSenderBalance))){
        senderBalance = Number(cachedSenderBalance);
      }else {
        const senderResult = await query('SELECT balance FROM wallets WHERE user_id = $1 FOR UPDATE', [sender_id]);
        if (senderResult.rows.length === 0) {
          throw new Error("Sender's wallet not found");
        }
        senderBalance = Number(senderResult.rows[0].balance);
      }
      
      if (senderBalance < Amount) {
        throw new Error("Insufficient funds in sender's wallet");
      }

      // 2. Check receiver's wallet balance (from Redis first)
      const cachedReceiverBalance = await new Promise((resolve, reject) => {
        redisClient.get(`wallet_balance:${receiver_id}`, (err, data) => {
          if (err) reject(err);
          resolve(data); // Resolve with cached balance if available
        });
      });
      
      logger.info("stage1");

      // let receiverBalance = cachedReceiverBalance ? Number(cachedReceiverBalance) : null;
      let receiverBalance;
      if(cachedReceiverBalance && !isNaN(Number(cachedReceiverBalance))){
        receiverBalance = Number(cachedReceiverBalance);
      }else{
        const receiverResult = await query('SELECT balance FROM wallets WHERE user_id = $1 FOR UPDATE', [receiver_id]);
        if (receiverResult.rows.length === 0) {
          throw new Error("Receiver's wallet not found");
        }
        receiverBalance = Number(receiverResult.rows[0].balance);
      }

      // 3. Deduct amount from sender's wallet
      const newSenderBalance = senderBalance - Amount;
      await query('UPDATE wallets SET balance = $1 WHERE user_id = $2', [newSenderBalance, sender_id]);

      // 4. Add amount to receiver's wallet
      const newReceiverBalance = receiverBalance + Amount;
      await query('UPDATE wallets SET balance = $1 WHERE user_id = $2', [newReceiverBalance, receiver_id]);

      // 5. Log the transaction in the transactions table
      const senderTransaction = await query(
        'INSERT INTO transactions (wallet_id, type, amount, description) VALUES ($1, $2, $3, $4) RETURNING id',
        [sender_id, 'debit', Amount, `Transferred to user ${receiver_id}`]
      );
      const receiverTransaction = await query(
        'INSERT INTO transactions (wallet_id, type, amount, description) VALUES ($1, $2, $3, $4) RETURNING id',
        [receiver_id, 'credit', Amount, `Received from user ${sender_id}`]
      );

      const senderTransactionId = senderTransaction.rows[0].id;
      const receiverTransactionId = receiverTransaction.rows[0].id;

      // 6. Update Redis cache for both sender and receiver
      redisClient.setex(`wallet_balance:${sender_id}`, 300, newSenderBalance); // Cache for 5 minutes
      redisClient.setex(`wallet_balance:${receiver_id}`, 300, newReceiverBalance);

      // 7. Notify clients via Socket.IO
      const io = getIO();
      io.emit('walletUpdated', {
        sender_id,
        sender_balance: newSenderBalance,
        receiver_id,
        receiver_balance: newReceiverBalance,
      });

      //update mongodb balance of sender
      notifyBalanceUpdate(sender_id, newSenderBalance);
      //update mongodb balance of reciever
      notifyBalanceUpdate(receiver_id, newReceiverBalance);


      // 8. Send email notifications
      if (senderEmail) {
        mailSender(
          senderEmail,
          `Funds Transferred`,
          transactionEmail('Debited', Amount, sender_id)
        );
      }
      if (receiverEmail) {
        mailSender(
          receiverEmail,
          `Funds Received`,
          transactionEmail('Credited', Amount, receiver_id)
        );
      }

      logger.info(`Funds transferred: ${Amount} from ${sender_id} to ${receiver_id}`);

      // Respond to the client
      res.status(200).json({
        success: true,
        message: `Transferred ${Amount} from ${sender_id} to ${receiver_id}`,
        sender_balance: newSenderBalance,
        receiver_balance: newReceiverBalance,
        sender_transaction_id: senderTransactionId,
        receiver_transaction_id: receiverTransactionId,
      });
    });
  } catch (error) {
    logger.error(`Error transferring funds: ${error.message}`);
    res.status(500).json({ success: false, message: error.message });
  }
};
