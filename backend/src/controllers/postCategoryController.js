const PostCategory = require('../models/PostCategory');

// GET /api/post-categories
const getPostCategories = async (req, res, next) => {
  try {
    const categories = await PostCategory.find({}).sort({ name: 1 });
    res.json(categories);
  } catch (error) { next(error); }
};

// POST /api/post-categories
const createPostCategory = async (req, res, next) => {
  try {
    const { name, slug, description } = req.body;
    if (!name || !slug) { res.status(400); throw new Error('Vui lòng nhập tên và slug'); }

    const exists = await PostCategory.findOne({ slug });
    if (exists) { res.status(400); throw new Error('Slug đã tồn tại'); }

    const cat = await PostCategory.create({ name, slug, description: description || '' });
    res.status(201).json(cat);
  } catch (error) { next(error); }
};

// PUT /api/post-categories/:id
const updatePostCategory = async (req, res, next) => {
  try {
    const { name, slug, description } = req.body;
    const cat = await PostCategory.findById(req.params.id);
    if (!cat) { res.status(404); throw new Error('Không tìm thấy'); }

    if (slug && slug !== cat.slug) {
      const exists = await PostCategory.findOne({ slug, _id: { $ne: cat._id } });
      if (exists) { res.status(400); throw new Error('Slug đã tồn tại'); }
    }

    cat.name = name !== undefined ? name : cat.name;
    cat.slug = slug !== undefined ? slug : cat.slug;
    cat.description = description !== undefined ? description : cat.description;

    const updated = await cat.save();
    res.json(updated);
  } catch (error) { next(error); }
};

// DELETE /api/post-categories/:id
const deletePostCategory = async (req, res, next) => {
  try {
    const cat = await PostCategory.findById(req.params.id);
    if (!cat) { res.status(404); throw new Error('Không tìm thấy'); }
    await PostCategory.deleteOne({ _id: cat._id });
    res.json({ message: 'Đã xóa danh mục bài viết' });
  } catch (error) { next(error); }
};

module.exports = { getPostCategories, createPostCategory, updatePostCategory, deletePostCategory };
