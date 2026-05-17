const express = require('express');
const router = express.Router();
const { getPostCategories, createPostCategory, updatePostCategory, deletePostCategory } = require('../controllers/postCategoryController');
const { protect, admin } = require('../middlewares/authMiddleware');

router.route('/').get(getPostCategories).post(protect, admin, createPostCategory);
router.route('/:id').put(protect, admin, updatePostCategory).delete(protect, admin, deletePostCategory);

module.exports = router;
