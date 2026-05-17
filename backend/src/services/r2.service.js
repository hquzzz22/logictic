const { S3Client, PutObjectCommand, DeleteObjectCommand } = require('@aws-sdk/client-s3');
const crypto = require('crypto');
const path = require('path');

const s3Client = new S3Client({
  region: 'auto',
  endpoint: process.env.R2_ENDPOINT,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
  },
  // Bắt buộc với R2 — tắt checksum mặc định của AWS SDK v3
  requestChecksumCalculation: 'WHEN_REQUIRED',
  responseChecksumValidation: 'WHEN_REQUIRED',
});

const bucketName = process.env.R2_BUCKET_NAME;
const publicUrl = process.env.R2_PUBLIC_URL;

const uploadToR2 = async (file) => {
  const fileExtension = path.extname(file.originalname);
  const randomName = crypto.randomBytes(16).toString('hex') + fileExtension;

  const command = new PutObjectCommand({
    Bucket: bucketName,
    Key: randomName,
    Body: file.buffer,
    ContentType: file.mimetype,
    ContentLength: file.size,
  });

  try {
    await s3Client.send(command);
    return `${publicUrl}/${randomName}`;
  } catch (error) {
    console.error('R2 Upload Error:', error.message);
    console.error('R2 Error Code:', error.Code || error.code);
    // Ném lỗi với message cụ thể để frontend hiển thị
    throw new Error(`R2 Error: ${error.message}`);
  }
};

const deleteFromR2 = async (imageUrl) => {
  if (!imageUrl) return;
  try {
    const key = imageUrl.split('/').pop();
    const command = new DeleteObjectCommand({
      Bucket: bucketName,
      Key: key,
    });
    await s3Client.send(command);
  } catch (error) {
    console.error('Error deleting from R2:', error);
  }
};

module.exports = {
  uploadToR2,
  deleteFromR2,
};
