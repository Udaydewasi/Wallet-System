// Import the required modules
const express = require("express");
const router = express.Router();
const {updateDisplayPicture} = require('../controllers/Profile');
const {fetchImage} = require('../controllers/fetchImage');
// Import the required controllers and middleware functions
const {
  login,
  signup,
  sendotp,
} = require("../controllers/Auth")
const {updateBalance} = require("../controllers/updateBalance");

const { auth } = require('../middlewares/auth');

// Routes for Login, Signup, OtpSend, ImageUpload and BalanceUpdate

// ********************************************************************************************************
//                                      Auth routes
// ********************************************************************************************************

// Route for user login
router.post("/login", login)

// Route for user signup
router.post("/signup", signup)

// Route for sending OTP to the user's email
router.post("/sendotp", sendotp)

//Route for updating or uploading image
router.put("/image", auth, updateDisplayPicture);

router.get("/profileimage", auth, fetchImage);

//Route for updating the balance from MongoDB
router.put("/updatebalance", updateBalance);

// Export the router for use in the main application
module.exports = router
