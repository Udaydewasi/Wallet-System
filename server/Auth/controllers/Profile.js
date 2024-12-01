const { uploadImageToS3 } = require('../utils/s3Uploader');


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
    const displayPicture = req.files.displayPicture;
    const userId = req.user.id;

    // Upload image to S3
    const imageUrl = await uploadImageToS3(
      displayPicture,
      process.env.FOLDER_NAME // S3 folder name
    );

    console.log(imageUrl);

    // Update user profile with the new image URL
    const updatedProfile = await User.findByIdAndUpdate(
      userId,
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

