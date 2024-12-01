const logger = require("../../../logs/logger");
const { query } = require("../config/db"); // PostgreSQL query function

exports.createWallet = async (req, res) => {
  try {
    // Extract user_id from the request body (since you're passing it from Postman)
    const user_id = req.user_id;

    logger.log("Creating wallet for user:", user_id);

    // Check if the wallet already exists for the user
    const existingWalletResult = await query("SELECT * FROM wallets WHERE user_id = $1", [user_id]);

    if (existingWalletResult.rows.length > 0) {
      logger.log("Wallet already exists for this user");
      return res.status(400).json({ message: "Wallet already exists" });
    }

    // Create a new wallet for the user with an initial balance of 0
    const newWalletResult = await query(
      "INSERT INTO wallets (user_id, balance) VALUES ($1, $2) RETURNING *",
      [user_id, 0.0] // Initial balance is 0.00
    );

    const newWallet = newWalletResult.rows[0]; // Get the created wallet details
    console.log("Wallet created successfully:", newWallet);

    return res.status(201).json({
      message: "Wallet created successfully",
      wallet: newWallet
    });
  } catch (error) {
    console.error("Error creating wallet:", error.message);
    return res.status(500).json({ error: error.message });
  }
};
