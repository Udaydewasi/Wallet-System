const s3 = require('../config/s3Client');
const path = require('path');
const { v4: uuidv4 } = require('uuid'); // To generate unique filenames
const logger = require('../../../logs/logger');
/**
 * Uploads an image to S3
 * @param {Object} file - The image file to upload
 * @param {String} folder - (Optional) The folder name in the S3 bucket
 * @returns {Object} - The uploaded image's S3 URL
 */
const uploadImageToS3 = async (file, folder = '') => {

  logger.info(`file: ${file}`);
  const fileExtension = path.extname(file.name).toLowerCase();

  logger.info(`fileExtension: ${fileExtension}`);

  const folderName = folder || 'udaydewasi'; // Use root if no folder is specified
  const fileName = folderName
    ? `${folderName}/${uuidv4()}${fileExtension}`
    : `${uuidv4()}${fileExtension}`;

  logger.info(`filename: ${fileName}`);

  const params = {
    Bucket: process.env.AWS_BUCKET_NAME, // Your bucket name
    Key: fileName, // File path in S3
    Body: file.data, // File content
    // ACL: 'public-read', // File permissions
    ContentType: file.mimetype, // File MIME type
  };
  logger.info(`params: ${params}`);

  return new Promise((resolve, reject) => {
    s3.upload(params, (err, data) => {
      if (err) {
        logger.error("Error at stage5 s3");
        return reject(err);
      }
      
      resolve(data.Location); // Return the uploaded file's S3 URL
    });
  });
};

module.exports = { uploadImageToS3 };
