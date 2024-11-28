const { query } = require('../config/db');

const Transaction = {
    // Log a new transaction
    createTransaction: async (senderId, receiverId, amount, status = 'PENDING') => {
        await query(
            'INSERT INTO transactions (sender_id, receiver_id, amount, status) VALUES ($1, $2, $3, $4)',
            [senderId, receiverId, amount, status]
        );
    },

    // Get transaction history
    getTransactions: async (userId, limit, offset) => {
        const result = await query(`
            SELECT * FROM transactions
            WHERE sender_id = $1 OR receiver_id = $1
            ORDER BY created_at DESC
            LIMIT $2 OFFSET $3
        `, [userId, limit, offset]);
        return result.rows;
    }
};

module.exports = Transaction;