const Joi = require('joi');

const createBlogValidation = Joi.object({
  title: Joi.string().min(5).max(50).required(),
  content: Joi.string().min(5).max(1024).required(),
  category: Joi.string().min(3).max(50).required(),
  userId: Joi.string().required()
});

const updateBlogValidation = Joi.object({
  title: Joi.string().min(5).max(50),
  content: Joi.string().min(5).max(1024),
  category: Joi.string().min(3).max(50),
  userId: Joi.string().required()
});

module.exports = {
  createBlogValidation,
  updateBlogValidation
};
