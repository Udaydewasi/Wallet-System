const s3 = require('../config/s3Client');
const path = require('path');
const { v4: uuidv4 } = require('uuid'); // To generate unique filenames

/**
 * Uploads an image to S3
 * @param {Object} file - The image file to upload
 * @param {String} folder - The folder name in the S3 bucket
 * @returns {Object} - The uploaded image's S3 URL
 */
const uploadImageToS3 = async (file, folder) => {
  const fileExtension = path.extname(file.name);
  const fileName = `${folder}/${uuidv4()}${fileExtension}`;

  const params = {
    Bucket: process.env.AWS_BUCKET_NAME, // Your bucket name
    Key: fileName, // File path in S3
    Body: file.data, // File content
    ACL: 'public-read', // File permissions
    ContentType: file.mimetype, // File MIME type
  };

  return new Promise((resolve, reject) => {
    s3.upload(params, (err, data) => {
      if (err) {
        return reject(err);
      }
      resolve(data.Location); // Return the uploaded file's S3 URL
    });
  });
};

module.exports = { uploadImageToS3 };
