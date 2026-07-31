const mongoose = require('mongoose');

const postCategorySchema = new mongoose.Schema({
  name: {
    en: { type: String, default: '' },
    vi: { type: String, default: '' },
  },
  slug: {
    type: String,
    required: true,
    unique: true,
  },
  description: {
    en: { type: String, default: '' },
    vi: { type: String, default: '' },
  },
}, {
  timestamps: true,
});

const PostCategory = mongoose.model('PostCategory', postCategorySchema);
module.exports = PostCategory;
