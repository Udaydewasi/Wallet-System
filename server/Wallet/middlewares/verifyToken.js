// Importing required modules
const jwt = require("jsonwebtoken");
const logger = require("../../../logs/logger");
require('dotenv').config();


// This function is used as middleware to authenticate user requests
exports.verifyToken = async (req, res, next) => {
	try {
		logger.info("1working till here....")
		// Extracting JWT from request cookies, body or header
		const token =
				req.cookies?.token ||
				req.body?.token ||
  				req.header("Authorization")?.replace(/^Bearer\s+"?/, "").replace(/"?$/, "");

		
		logger.info(`Extracted Token: ${token}`);  // Log the token to see what you are getting


		// If JWT is missing, return 401 Unauthorized response
		if (!token) {
			return res.status(401).json({ success: false, message: `Token Missing` });
		}
		logger.info("code working stage3");

		try {
			logger.info("code working stage4");

			logger.info(`Authorization Header: ${req.header("Authorization")}`);

			const decodedToken = jwt.decode(token, { complete: true });
			logger.info(`Decoded Token: ${decodedToken}`);


			// Verifying the JWT using the secret key stored in environment variables
			const decode = await jwt.verify(token, process.env.JWT_SECRET);

			logger.info("code working stage5")
			// Storing the decoded JWT payload in the request object for further use
			req.user_id = decode.user_id;
			req.email = decode.email;

			logger.info(`userId: ${req.user_id}`);
			
			// return res.status(200).json({
			// 	success: true,
			// 	message: "Token verified",
			// });
		} catch (error) {
			logger.error(`JWT Error: ${error.name} - ${error.message}`);
			// If JWT verification fails, return 401 Unauthorized response
			return res
				.status(401)
				.json({ success: false, message: "token is invailid" });
		}

		// If JWT is valid, move on to the next middleware or request handler
		next();
	} catch (error) {
		logger.error(`JWT Error: ${error.name} - ${error.message}`);
		// If there is an error during the authentication process, return 401 Unauthorized response
		return res.status(401).json({
			success: false,
			message: `Something Went Wrong While Validating the Token`
		});
	}
};