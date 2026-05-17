const express = require('express');
const router = express.Router();
const { getCommentsByProduct, createComment, deleteComment } = require('../controllers/commentController');
const { protect, admin } = require('../middlewares/authMiddleware');

router.post('/', createComment); // Cho phép guest comment (không cần login)
router.get('/:productId', getCommentsByProduct);
router.delete('/:id', protect, admin, deleteComment);

module.exports = router;
