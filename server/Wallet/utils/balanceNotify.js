const axios = require("axios");
const logger = require('../logs/logger');
require('dotenv').config();
const UPDATEBALANCE_URL = process.env.UPDATEBALANCE_URL;

exports.notifyBalanceUpdate = async (user_id, updatedBalance) => {
  try {
    // Make an HTTP PUT request to the balance update API
    const response = await axios.put(UPDATEBALANCE_URL, {
      user_id,
      updatedBalance,
    });

    logger.info(`Balance update notification sent for user ${user_id}: ${updatedBalance}`);
    
  } catch (error) {
    // Log the error if the request fails
    logger.error(`Error notifying balance update for user ${user_id}: ${error.message}`);
  }
};
