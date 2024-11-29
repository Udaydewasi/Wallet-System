const { Pool } = require('pg');
require('dotenv').config();
// PostgreSQL connection pool
const pool = new Pool({
    user: process.env.DB_USER || 'postgres',  // Replace with your PostgreSQL username
    host: process.env.DB_HOST || 'localhost',      // Replace with your PostgreSQL host
    database: process.env.DB_NAME || 'wallet_system', // Replace with your database name
    password: process.env.DB_PASSWORD || 'Uday@1234', // Replace with your PostgreSQL password
    port: process.env.DB_PORT || 5432,              // Default PostgreSQL port
    connectionTimeoutMillis: 5000,
});

const connectDB = async () => {
    try {
      const client = await pool.connect();
      console.log("PostgreSQL connected successfully!");
      client.release(); // Release connection back to pool
    } catch (error) {
      console.error("Error connecting to PostgreSQL:", error.message);
      process.exit(1); // Exit process with failure
    }
  };

// Query utility function
const query = async (text, params) => {
    const client = await pool.connect(); // Get a connection from the pool
    try {
        const result = await client.query(text, params); // Execute query with parameters
        return result;
    } catch (error) {
        console.error('Query error:', error.message);
        throw error;
    } finally {
        client.release(); // Release the connection back to the pool
    }
};
module.exports = {query};

// Transaction utility function
const transaction = async (callback) => {
    const client = await pool.connect(); // Get a connection from the pool
    try {
        await client.query('BEGIN'); // Start transaction
        await callback(client);     // Execute transaction logic in the callback
        await client.query('COMMIT'); // Commit transaction
    } catch (error) {
        await client.query('ROLLBACK'); // Rollback transaction on error
        console.error('Transaction error:', error.message);
        throw error;
    } finally {
        client.release(); // Release the connection back to the pool
    }
};

process.on('exit', () => {
    console.log('Closing PostgreSQL connection pool...');
    pool.end(); // Ensure the pool is closed when the server shuts down
  });
  
module.exports = {connectDB, query, transaction };
