const express = require('express');
const router = express.Router();
const multer = require('multer');
const { uploadToR2 } = require('../services/r2.service');
const { protect, admin } = require('../middlewares/authMiddleware');

// Image upload — max 5MB
const imageUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) cb(null, true);
    else cb(new Error('Chỉ hỗ trợ file hình ảnh!'), false);
  },
});

// Video upload — max 200MB
const videoUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 200 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = ['video/mp4', 'video/webm', 'video/ogg', 'video/quicktime'];
    if (allowed.includes(file.mimetype)) cb(null, true);
    else cb(new Error('Chỉ hỗ trợ file video MP4, WebM, OGG!'), false);
  },
});

// POST /api/upload — upload ảnh
router.post('/', protect, admin, (req, res, next) => {
  imageUpload.single('image')(req, res, (err) => {
    if (err) { res.status(400); return next(new Error(err.message)); }
    next();
  });
}, async (req, res, next) => {
  try {
    if (!req.file) { res.status(400); throw new Error('Vui lòng chọn file ảnh'); }
    const url = await uploadToR2(req.file);
    res.json({ url });
  } catch (error) { next(error); }
});

// POST /api/upload/video — upload video
router.post('/video', protect, admin, (req, res, next) => {
  videoUpload.single('video')(req, res, (err) => {
    if (err) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        res.status(400);
        return next(new Error('File video vượt quá 200MB'));
      }
      res.status(400);
      return next(new Error(err.message));
    }
    next();
  });
}, async (req, res, next) => {
  try {
    if (!req.file) { res.status(400); throw new Error('Vui lòng chọn file video'); }
    console.log('Uploading video:', req.file.originalname, req.file.mimetype, (req.file.size / 1024 / 1024).toFixed(1) + 'MB');
    const url = await uploadToR2(req.file);
    console.log('Video upload success:', url);
    res.json({ url });
  } catch (error) { next(error); }
});

module.exports = router;
