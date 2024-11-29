CREATE TABLE transactions (
    id SERIAL PRIMARY KEY,          -- Auto-incrementing transaction ID
    wallet_id UUID NOT NULL,        -- Foreign key to the wallet
    type VARCHAR(10) NOT NULL,      -- Transaction type: 'credit' or 'debit'
    amount NUMERIC(10, 2) NOT NULL, -- Transaction amount
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Transaction timestamp
    description TEXT,               -- Optional description
    FOREIGN KEY (wallet_id) REFERENCES wallets(user_id) ON DELETE CASCADE
);
