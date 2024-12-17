const User = require("../models/User");
const logger = require('../logs/logger'); 

exports.updateBalance = async (req, res) => {
  try {

    logger.info('calling to updateBalance in Mongodb');
    const { user_id, updatedBalance } = req.body;

    // Find the user in MongoDB and update their wallet balance
    const updatedUser = await User.findOneAndUpdate(
      { _id: user_id }, // Match the user by their ID
      { walletBalance: updatedBalance }, // Update the balance
      { new: true } // Return the updated document
    );

    // If no user is found, return a 404 error
    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    logger.info(`Balance updated for user ${user_id}: ${updatedBalance}`);

    // Return the updated user information
    return res.status(200).json({
      success: true,
      message: "Wallet balance updated successfully",
      data: updatedUser,
    });
  } catch (error) {
    logger.error(`Error updating balance for user: ${error.message}`);
    return res.status(500).json({
      success: false,
      message: "Error updating wallet balance",
    });
  }
};
