const Post = require('../models/Post');

// @desc    Get all published posts
// @route   GET /api/posts
// @access  Public
const getPosts = async (req, res, next) => {
  try {
    const filter = { isPublished: true };
    if (req.query.category) {
      const PostCategory = require('../models/PostCategory');
      const cat = await PostCategory.findOne({ slug: req.query.category });
      if (cat) filter.category = cat._id;
    }
    const posts = await Post.find(filter)
      .populate('author', 'name')
      .populate('category', 'name slug')
      .sort({ createdAt: -1 });
    res.json(posts);
  } catch (error) {
    next(error);
  }
};

// @desc    Get all posts for Admin
// @route   GET /api/posts/admin
// @access  Private/Admin
const getAdminPosts = async (req, res, next) => {
  try {
    const posts = await Post.find({})
      .populate('author', 'name')
      .populate('category', 'name slug')
      .sort({ createdAt: -1 });
    res.json(posts);
  } catch (error) {
    next(error);
  }
};

// @desc    Get post by slug
// @route   GET /api/posts/slug/:slug
// @access  Public
const getPostBySlug = async (req, res, next) => {
  try {
    const post = await Post.findOne({ slug: req.params.slug }).populate('author', 'name');
    if (post) {
      res.json(post);
    } else {
      res.status(404);
      throw new Error('Không tìm thấy bài viết');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Get post by ID
// @route   GET /api/posts/:id
// @access  Private/Admin
const getPostById = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    if (post) {
      res.json(post);
    } else {
      res.status(404);
      throw new Error('Không tìm thấy bài viết');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Create a post
// @route   POST /api/posts
// @access  Private/Admin
const createPost = async (req, res, next) => {
  try {
    const { title, slug, content, image, isPublished, category, tags } = req.body;

    if (!title || !slug || !content) {
      res.status(400);
      throw new Error('Vui lòng điền đầy đủ tiêu đề, slug và nội dung');
    }

    const postExists = await Post.findOne({ slug });
    if (postExists) {
      res.status(400);
      throw new Error('Slug này đã tồn tại, vui lòng chọn slug khác');
    }

    const post = new Post({
      title,
      slug,
      content,
      image: image || '',
      category: category || undefined,
      tags: tags || [],
      author: req.user._id,
      isPublished: isPublished !== undefined ? isPublished : true,
    });

    const createdPost = await post.save();
    const populated = await createdPost.populate(['author', 'category']);
    res.status(201).json(populated);
  } catch (error) {
    next(error);
  }
};

// @desc    Update a post
// @route   PUT /api/posts/:id
// @access  Private/Admin
const updatePost = async (req, res, next) => {
  try {
    const { title, slug, content, image, isPublished, category, tags } = req.body;
    const post = await Post.findById(req.params.id);

    if (post) {
      if (slug && slug !== post.slug) {
        const slugExists = await Post.findOne({ slug, _id: { $ne: post._id } });
        if (slugExists) {
          res.status(400);
          throw new Error('Slug đã tồn tại');
        }
      }

      post.title = title !== undefined ? title : post.title;
      post.slug = slug !== undefined ? slug : post.slug;
      post.content = content !== undefined ? content : post.content;
      post.image = image !== undefined ? image : post.image;
      post.isPublished = isPublished !== undefined ? isPublished : post.isPublished;
      post.category = category !== undefined ? (category || undefined) : post.category;
      post.tags = tags !== undefined ? tags : post.tags;

      const updatedPost = await post.save();
      const populated = await updatedPost.populate(['author', 'category']);
      res.json(populated);
    } else {
      res.status(404);
      throw new Error('Không tìm thấy bài viết');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a post
// @route   DELETE /api/posts/:id
// @access  Private/Admin
const deletePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);

    if (post) {
      await Post.deleteOne({ _id: post._id });
      res.json({ message: 'Đã xóa bài viết' });
    } else {
      res.status(404);
      throw new Error('Không tìm thấy bài viết');
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getPosts,
  getAdminPosts,
  getPostBySlug,
  getPostById,
  createPost,
  updatePost,
  deletePost,
};
