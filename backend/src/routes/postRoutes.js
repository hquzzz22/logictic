const express = require('express');
const router = express.Router();
const {
  getPosts,
  getAdminPosts,
  getPostBySlug,
  createPost,
  updatePost,
  deletePost,
} = require('../controllers/postController');
const { protect, admin } = require('../middlewares/authMiddleware');

// /admin phải đặt TRƯỚC /:slug để tránh conflict
router.get('/admin', protect, admin, getAdminPosts);

router.route('/').get(getPosts).post(protect, admin, createPost);

// /:id cho PUT/DELETE (dùng MongoDB _id)
router.route('/:id')
  .put(protect, admin, updatePost)
  .delete(protect, admin, deletePost);

// /:slug cho GET public (dùng slug)
router.get('/slug/:slug', getPostBySlug);

module.exports = router;
