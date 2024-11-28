--Create Wallets Table
CREATE TABLE wallets (
  user_id UUID PRIMARY KEY,           -- User ID is the primary key
  balance DECIMAL(10, 2) DEFAULT 0.00, -- Wallet balance, default 0.00
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP -- Timestamp for wallet creation
);


--for run above query use cli command
-- psql -U your_username -d your_database -f db/migrations/wallets.sql

--or can run using node.js
