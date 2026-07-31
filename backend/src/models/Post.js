const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  title: {
    en: { type: String, default: '' },
    vi: { type: String, default: '' },
  },
  slug: {
    type: String,
    required: true,
    unique: true,
  },
  content: {
    en: { type: String, default: '' },
    vi: { type: String, default: '' },
  },
  description: {
    en: { type: String, default: '' },
    vi: { type: String, default: '' },
  },
  sidebarBanners: [{
    image: { type: String, default: '' },
    url: { type: String, default: '' }
  }],
  image: {
    type: String,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'PostCategory',
  },
  tags: [{
    type: String,
  }],
  author: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  isPublished: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
});

const Post = mongoose.model('Post', postSchema);
module.exports = Post;
