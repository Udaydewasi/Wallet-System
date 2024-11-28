const { query } = require('../config/db');

const Wallet = {
    // Fetch wallet balance by user ID
    getBalance: async (userId) => {
        const result = await query('SELECT balance FROM wallets WHERE user_id = $1', [userId]);
        return result.rows[0]; // Return the first result (or null if not found)
    },

    // Update wallet balance
    updateBalance: async (userId, amount) => {
        await query('UPDATE wallets SET balance = balance + $1 WHERE user_id = $2', [amount, userId]);
    },

    // Create a wallet for a new user
    createWallet: async (userId) => {
        await query('INSERT INTO wallets (user_id, balance) VALUES ($1, $2)', [userId, 0.00]);
    }
};

module.exports = Wallet;
