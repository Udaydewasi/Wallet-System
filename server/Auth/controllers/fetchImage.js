const User = require("../models/User");
const logger = require("../../../logs/logger");

const fetchImage = async(req, res) =>{
    const id = req.user.user_id;
    logger.info("Entered in the fetchImage ");
    logger.info(`${id}`);
    try {
      const result = await User.findById(id);
      if (!result) {
          logger.warn(`User with ID ${id} not found`);
          return res.status(404).json({
              success: false,
              message: "User not found",
          });
      }

      logger.info(`${result.image}`);
  
      return res.status(200).json({
          success: true,
          message: "Image fetched successfully",
          image: result.image,
      });
  } catch (error) {
      logger.error(`Error fetching user with ID ${id}: ${error.message}`);
      return res.status(500).json({
          success: false,
          message: "An error occurred while fetching the image",
      });
  }
  
}

exports.fetchImage = fetchImage;


