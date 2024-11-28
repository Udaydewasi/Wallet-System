const { query } = require('../config/db');
const fs = require('fs');

const createTable = async () => {
  try {
    const sql = fs.readFileSync('wallets.sql', 'utf-8');
    await query(sql);
    console.log('Wallets table created successfully.');
  } catch (error) {
    console.error('Error creating wallets table:', error.message);
  }
};

createTable();
