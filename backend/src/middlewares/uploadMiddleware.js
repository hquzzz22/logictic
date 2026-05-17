const multer = require('multer');

// Sử dụng memory storage để upload trực tiếp buffer lên R2
const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // Giới hạn 5MB
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Chỉ hỗ trợ upload file hình ảnh!'), false);
    }
  },
});

module.exports = upload;
