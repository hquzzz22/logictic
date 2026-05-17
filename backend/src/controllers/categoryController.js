const Category = require('../models/Category');

// @desc    Get all categories
// @route   GET /api/categories
// @access  Public
const getCategories = async (req, res, next) => {
  try {
    const categories = await Category.find({});
    res.json(categories);
  } catch (error) {
    next(error);
  }
};

// @desc    Get category by ID
// @route   GET /api/categories/:id
// @access  Public
const getCategoryById = async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id);
    if (category) {
      res.json(category);
    } else {
      res.status(404);
      throw new Error('Không tìm thấy danh mục');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Create a category
// @route   POST /api/categories
// @access  Private/Admin
const createCategory = async (req, res, next) => {
  try {
    const { name, slug, description, image } = req.body;

    if (!name || !slug) {
      res.status(400);
      throw new Error('Vui lòng điền tên và slug danh mục');
    }

    const categoryExists = await Category.findOne({ slug });
    if (categoryExists) {
      res.status(400);
      throw new Error('Danh mục với slug này đã tồn tại');
    }

    const category = new Category({
      name,
      slug,
      description: description || '',
      image: image || '',
    });

    const createdCategory = await category.save();
    res.status(201).json(createdCategory);
  } catch (error) {
    next(error);
  }
};

// @desc    Update a category
// @route   PUT /api/categories/:id
// @access  Private/Admin
const updateCategory = async (req, res, next) => {
  try {
    const { name, slug, description, image } = req.body;
    const category = await Category.findById(req.params.id);

    if (category) {
      if (slug && slug !== category.slug) {
        const slugExists = await Category.findOne({ slug, _id: { $ne: category._id } });
        if (slugExists) {
          res.status(400);
          throw new Error('Slug đã tồn tại');
        }
      }

      category.name = name !== undefined ? name : category.name;
      category.slug = slug !== undefined ? slug : category.slug;
      category.description = description !== undefined ? description : category.description;
      category.image = image !== undefined ? image : category.image;

      const updatedCategory = await category.save();
      res.json(updatedCategory);
    } else {
      res.status(404);
      throw new Error('Không tìm thấy danh mục');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a category
// @route   DELETE /api/categories/:id
// @access  Private/Admin
const deleteCategory = async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id);
    if (category) {
      await Category.deleteOne({ _id: category._id });
      res.json({ message: 'Đã xóa danh mục' });
    } else {
      res.status(404);
      throw new Error('Không tìm thấy danh mục');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Get categories with their products (hiển thị trang chủ)
// @route   GET /api/categories/with-products
// @access  Public
const getCategoriesWithProducts = async (req, res, next) => {
  try {
    const Product = require('../models/Product');
    const limit = parseInt(req.query.limit) || 8;

    const categories = await Category.find({ showOnHome: true }).sort({ order: 1, name: 1 });

    const result = await Promise.all(
      categories.map(async (cat) => {
        const products = await Product.find({ category: cat._id })
          .populate('category', 'name slug')
          .sort({ isFeatured: -1, createdAt: -1 })
          .limit(limit);
        return {
          _id: cat._id,
          name: cat.name,
          slug: cat.slug,
          description: cat.description,
          image: cat.image,
          order: cat.order,
          products,
        };
      })
    );

    res.json(result.filter((c) => c.products.length > 0));
  } catch (error) {
    next(error);
  }
};

// @desc    Reorder categories (admin)
// @route   PUT /api/categories/reorder
// @access  Private/Admin
const reorderCategories = async (req, res, next) => {
  try {
    const { items } = req.body; // [{ _id, order, showOnHome }]
    if (!items || !Array.isArray(items)) {
      res.status(400);
      throw new Error('Dữ liệu không hợp lệ');
    }

    await Promise.all(
      items.map((item) =>
        Category.findByIdAndUpdate(item._id, {
          order: item.order,
          showOnHome: item.showOnHome !== undefined ? item.showOnHome : true,
        })
      )
    );

    res.json({ message: 'Đã cập nhật thứ tự danh mục' });
  } catch (error) {
    next(error);
  }
};

module.exports = { getCategories, getCategoryById, getCategoriesWithProducts, reorderCategories, createCategory, updateCategory, deleteCategory };
