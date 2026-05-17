const Product = require('../models/Product');
const Category = require('../models/Category');

// @desc    Fetch all products (with optional filters)
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res, next) => {
  try {
    const { category, featured, search, sort } = req.query;

    const filter = {};

    if (category) {
      // Tìm category theo slug hoặc id
      const cat = await Category.findOne({ slug: category });
      if (cat) filter.category = cat._id;
    }

    if (featured === 'true') {
      filter.isFeatured = true;
    }

    if (search) {
      filter.name = { $regex: search, $options: 'i' };
    }

    let sortOption = { createdAt: -1 };
    if (sort === 'price_asc') sortOption = { price: 1 };
    else if (sort === 'price_desc') sortOption = { price: -1 };
    else if (sort === 'name') sortOption = { name: 1 };

    const products = await Product.find(filter)
      .populate('category', 'name slug')
      .sort(sortOption);

    res.json(products);
  } catch (error) {
    next(error);
  }
};

// @desc    Fetch single product by ID
// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id).populate('category', 'name slug');
    if (product) {
      res.json(product);
    } else {
      res.status(404);
      throw new Error('Không tìm thấy sản phẩm');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Fetch single product by slug
// @route   GET /api/products/slug/:slug
// @access  Public
const getProductBySlug = async (req, res, next) => {
  try {
    const product = await Product.findOne({ slug: req.params.slug }).populate('category', 'name slug');
    if (product) {
      res.json(product);
    } else {
      res.status(404);
      throw new Error('Không tìm thấy sản phẩm');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
const createProduct = async (req, res, next) => {
  try {
    const { name, slug, price, description, shortDescription, images, category, countInStock, isFeatured } = req.body;

    if (!name || !slug || !category) {
      res.status(400);
      throw new Error('Vui lòng điền đầy đủ thông tin: tên, slug, danh mục');
    }

    const slugExists = await Product.findOne({ slug });
    if (slugExists) {
      res.status(400);
      throw new Error('Slug đã tồn tại, vui lòng chọn slug khác');
    }

    const product = new Product({
      name,
      slug,
      price: price || 0,
      category,
      images: images || [],
      countInStock: countInStock || 0,
      shortDescription: shortDescription || '',
      description: description || '',
      isFeatured: isFeatured || false,
    });

    const createdProduct = await product.save();
    const populated = await createdProduct.populate('category', 'name slug');
    res.status(201).json(populated);
  } catch (error) {
    next(error);
  }
};

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = async (req, res, next) => {
  try {
    const { name, slug, price, description, shortDescription, images, category, countInStock, isFeatured } = req.body;

    const product = await Product.findById(req.params.id);

    if (product) {
      // Kiểm tra slug trùng (ngoại trừ chính nó)
      if (slug && slug !== product.slug) {
        const slugExists = await Product.findOne({ slug, _id: { $ne: product._id } });
        if (slugExists) {
          res.status(400);
          throw new Error('Slug đã tồn tại, vui lòng chọn slug khác');
        }
      }

      product.name = name !== undefined ? name : product.name;
      product.slug = slug !== undefined ? slug : product.slug;
      product.price = price !== undefined ? price : product.price;
      product.shortDescription = shortDescription !== undefined ? shortDescription : product.shortDescription;
      product.description = description !== undefined ? description : product.description;
      product.images = images !== undefined ? images : product.images;
      product.category = category !== undefined ? category : product.category;
      product.countInStock = countInStock !== undefined ? countInStock : product.countInStock;
      product.isFeatured = isFeatured !== undefined ? isFeatured : product.isFeatured;

      const updatedProduct = await product.save();
      const populated = await updatedProduct.populate('category', 'name slug');
      res.json(populated);
    } else {
      res.status(404);
      throw new Error('Không tìm thấy sản phẩm');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      await Product.deleteOne({ _id: product._id });
      res.json({ message: 'Đã xóa sản phẩm' });
    } else {
      res.status(404);
      throw new Error('Không tìm thấy sản phẩm');
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProducts,
  getProductById,
  getProductBySlug,
  deleteProduct,
  createProduct,
  updateProduct,
};
