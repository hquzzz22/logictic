const mongoose = require('mongoose');

const postCategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  slug: {
    type: String,
    required: true,
    unique: true,
  },
  description: {
    type: String,
    default: '',
  },
}, {
  timestamps: true,
});

const PostCategory = mongoose.model('PostCategory', postCategorySchema);
module.exports = PostCategory;
