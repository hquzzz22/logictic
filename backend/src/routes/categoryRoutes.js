const express = require('express');
const router = express.Router();
const { getCategories, getCategoryById, getCategoriesWithProducts, reorderCategories, createCategory, updateCategory, deleteCategory } = require('../controllers/categoryController');
const { protect, admin } = require('../middlewares/authMiddleware');

// Static routes trước dynamic routes
router.get('/with-products', getCategoriesWithProducts);
router.put('/reorder', protect, admin, reorderCategories);

router.route('/')
  .get(getCategories)
  .post(protect, admin, createCategory);

router.route('/:id')
  .get(getCategoryById)
  .put(protect, admin, updateCategory)
  .delete(protect, admin, deleteCategory);

module.exports = router;
