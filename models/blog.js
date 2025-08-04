const Joi = require('joi');
const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 50
  },
  content: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 1024
  },
  category: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 50
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
});
blogSchema.plugin(mongoosePaginate);

const Blog = mongoose.model('Blog', blogSchema);
exports.blogSchema = blogSchema;
exports.Blog = Blog; 
