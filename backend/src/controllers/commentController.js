const Comment = require('../models/Comment');

// GET /api/comments/:productId
const getCommentsByProduct = async (req, res, next) => {
  try {
    const comments = await Comment.find({ product: req.params.productId })
      .populate('user', 'name')
      .sort({ createdAt: -1 });
    res.json(comments);
  } catch (error) { next(error); }
};

// POST /api/comments
const createComment = async (req, res, next) => {
  try {
    const { product, content, rating, name } = req.body;

    if (!product || !content) {
      res.status(400);
      throw new Error('Vui lòng nhập nội dung đánh giá');
    }

    const comment = await Comment.create({
      product,
      user: req.user ? req.user._id : undefined,
      name: name || (req.user ? req.user.name : 'Khách'),
      content,
      rating: rating || 5,
    });

    const populated = await comment.populate('user', 'name');
    res.status(201).json(populated);
  } catch (error) { next(error); }
};

// DELETE /api/comments/:id (admin only)
const deleteComment = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) { res.status(404); throw new Error('Không tìm thấy'); }
    await Comment.deleteOne({ _id: comment._id });
    res.json({ message: 'Đã xóa bình luận' });
  } catch (error) { next(error); }
};

module.exports = { getCommentsByProduct, createComment, deleteComment };
