const { query } = require("../config/db"); // PostgreSQL query function

exports.createWallet = async (userId) => {
  try {
    // Check if the wallet already exists for the user
    const existingWalletResult = await query("SELECT * FROM wallets WHERE user_id = $1", [userId]);

    if (existingWalletResult.rows.length > 0) {
      console.log("Wallet already exists for this user");
      return;
    }

    // Create a new wallet for the user with an initial balance of 0
    const newWalletResult = await query(
      "INSERT INTO wallets (user_id, balance) VALUES ($1, $2) RETURNING *",
      [userId, 0.0] // Initial balance is 0.00
    );

    const newWallet = newWalletResult.rows[0]; // Get the created wallet details
    console.log("Wallet created successfully:", newWallet);

    return newWallet;
  } catch (error) {
    console.error("Error creating wallet:", error.message);
    throw new Error("Unable to create wallet");
  }
};
