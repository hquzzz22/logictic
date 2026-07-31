const PostCategory = require('../models/PostCategory');

// Helper: normalize bilingual field
function normalizeBilingual(value) {
  if (!value) return { en: '', vi: '' };
  if (typeof value === 'string') return { en: value, vi: '' };
  return { en: value.en || '', vi: value.vi || '' };
}

// GET /api/post-categories
const getPostCategories = async (req, res, next) => {
  try {
    const categories = await PostCategory.find({}).sort({ createdAt: -1 });
    res.json(categories);
  } catch (error) { next(error); }
};

// POST /api/post-categories
const createPostCategory = async (req, res, next) => {
  try {
    const { name, slug, description } = req.body;
    const normalizedName = normalizeBilingual(name);

    if (!normalizedName.en && !normalizedName.vi) {
      res.status(400);
      throw new Error('Vui lòng nhập tên danh mục (ít nhất 1 ngôn ngữ)');
    }
    if (!slug) {
      res.status(400);
      throw new Error('Vui lòng nhập slug');
    }

    const exists = await PostCategory.findOne({ slug });
    if (exists) { res.status(400); throw new Error('Slug đã tồn tại'); }

    const cat = await PostCategory.create({
      name: normalizedName,
      slug,
      description: normalizeBilingual(description),
    });
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

    if (name !== undefined) cat.name = normalizeBilingual(name);
    if (slug !== undefined) cat.slug = slug;
    if (description !== undefined) cat.description = normalizeBilingual(description);

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
