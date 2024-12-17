const { uploadImageToS3 } = require('../utils/s3Uploader');
const logger = require("../logs/logger");
const User = require('../models/User');


exports.getAllUserDetails = async (req, res) => {
    try {
      const id = req.user.id
      const userDetails = await User.findById(id);
      console.log(userDetails)
      res.status(200).json({
        success: true,
        message: "User Data fetched successfully",
        data: userDetails,
      })
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      })
    }
 }
  

exports.updateDisplayPicture = async (req, res) => {
  try {
    logger.info("working stage1");
    const id = req.user.user_id;


    logger.info(`userId : ${req.user.user_id}`);

    const displayPicture = req.files.displayPicture;
    logger.info(`displayPicture: ${JSON.stringify(displayPicture)}`);

    // If displayPicture.data is already a Buffer, no need to convert it
    const fileBuffer = displayPicture.data;
    
    logger.info(`fileBuffer length: ${fileBuffer.length}`);
    if (!req.files || !req.files.displayPicture) {
      return res.status(400).json({
        success: false,
        message: "No picture attachted, please attach",
      }); 
    }

    const user = await User.findById(id);

    logger.info(`UserIdfromDB: ${user}`);

    logger.info(`displayPicture: ${displayPicture} and ${id}`);
    logger.info("working stage 3");
    // Upload image to S3
    const imageUrl = await uploadImageToS3(
      displayPicture,
      process.env.FOLDER_NAME || '' // S3 folder name
    );

    logger.info("working stage 4");
    // Update user profile with the new image URL
    const updatedProfile = await User.findByIdAndUpdate(
      id,
      { image: imageUrl },
      { new: true }
    );
    
    res.status(200).json({
      success: true,
      message: `Image updated successfully`,
      data: updatedProfile,
    });
  } catch (error) {
    console.error('Error uploading image:', error.message);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

  

  exports.deleteAccount = async (req, res) => {
    try {
      const id = req.user.id
      console.log(id)
      const user = await User.findById({ _id: id })
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        })
      }

      // Delete Assosiated Profile with the User
      //Delete the wallet data from postgress
      //Something missing

      // Now Delete User
      await User.findByIdAndDelete({ _id: id })
      res.status(200).json({
        success: true,
        message: "User deleted successfully",
      })
      
    } catch (error) {
      console.log(error)
      res
        .status(500)
        .json({ success: false, message: "User Cannot be deleted successfully" })
    }
  }

