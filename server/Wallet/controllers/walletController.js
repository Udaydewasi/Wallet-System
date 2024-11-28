const { query } = require('../config/db');

// const Wallet = require("../models/Wallet");

exports.createWallet = async (userId) => {
  try {
    // Check if the wallet already exists for the user
    const existingWallet = await Wallet.findOne({ userId });
    if (existingWallet) {
      console.log("Wallet already exists for this user");
      return;
    }

    // Create a new wallet for the user
    const newWallet = await Wallet.create({
      userId: userId,
      balance: 0.00, // Initial balance is 0
    });

    console.log("Wallet created successfully:", newWallet);
  } catch (error) {
    console.error("Error creating wallet:", error.message);
  }
};

exports.getBalance = async (req, res) => {
    const userId = req.user.id; // Get user ID from JWT

    try {
        const result = await query('SELECT balance FROM wallets WHERE user_id = $1', [userId]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Wallet not found' });
        }

        res.status(200).json({ balance: result.rows[0].balance });
    } catch (error) {
        console.error('Error fetching balance:', error.message);
        res.status(500).json({ error: 'Server error' });
    }
};

const { transaction } = require('../config/db');

exports.transferFunds = async (req, res) => {
    const { recipientId, amount } = req.body;
    const senderId = req.user.id; // Get user ID from JWT

    if (senderId === recipientId) {
        return res.status(400).json({ error: "Can't transfer to self" });
    }

    if (amount <= 0) {
        return res.status(400).json({ error: 'Invalid amount' });
    }

    try {
        await transaction(async (client) => {
            // Lock sender wallet for update
            const sender = await client.query(
                'SELECT balance FROM wallets WHERE user_id = $1 FOR UPDATE',
                [senderId]
            );
            if (sender.rows.length === 0) throw new Error('Sender wallet not found');
            if (sender.rows[0].balance < amount) throw new Error('Insufficient balance');

            // Lock recipient wallet for update
            const recipient = await client.query(
                'SELECT balance FROM wallets WHERE user_id = $1 FOR UPDATE',
                [recipientId]
            );
            if (recipient.rows.length === 0) throw new Error('Recipient wallet not found');

            // Update balances
            await client.query(
                'UPDATE wallets SET balance = balance - $1 WHERE user_id = $2',
                [amount, senderId]
            );
            await client.query(
                'UPDATE wallets SET balance = balance + $1 WHERE user_id = $2',
                [amount, recipientId]
            );

            // Record transaction
            await client.query(
                'INSERT INTO transactions (sender_id, receiver_id, amount, status) VALUES ($1, $2, $3, $4)',
                [senderId, recipientId, amount, 'SUCCESS']
            );
        });

        res.status(200).json({ message: 'Transfer successful' });
    } catch (error) {
        console.error('Error transferring funds:', error.message);
        res.status(400).json({ error: error.message || 'Transaction failed' });
    }
};


// const { query } = require('../config/db');

exports.getTransactions = async (req, res) => {
    const userId = req.user.id; // Get user ID from JWT
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    try {
        const result = await query(`
            SELECT * FROM transactions
            WHERE sender_id = $1 OR receiver_id = $1
            ORDER BY created_at DESC
            LIMIT $2 OFFSET $3
        `, [userId, limit, offset]);

        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Error fetching transactions:', error.message);
        res.status(500).json({ error: 'Server error' });
    }
};