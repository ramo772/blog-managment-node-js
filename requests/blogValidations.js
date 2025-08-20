const Joi = require('joi');

const createBlogValidation = Joi.object({
  title: Joi.string().min(5).max(50).required(),
  content: Joi.string().min(5).max(1024).required(),
  category: Joi.array().items(Joi.string().min(3).max(50)).required(), 
});

const updateBlogValidation = Joi.object({
  title: Joi.string().min(5).max(50),
  content: Joi.string().min(5).max(1024),
  category: Joi.array().items(Joi.string().min(3).max(50)), 
});

module.exports = {
  createBlogValidation,
  updateBlogValidation
};
