const Joi = require('joi');
const registerSchema = Joi.object({
  name: Joi.string().min(5).max(50).required(),
  email: Joi.string().min(5).max(255).required().email(),
  password: Joi.string()
  .pattern(new RegExp('^(?=.*[A-Za-z])(?=.*\\d).{8,}$'))
  .required()
    .messages({
      'string.pattern.base': 'Password must be at least 8 characters long and include both letters and numbers.'
    })
});

const loginSchema = Joi.object({
  email: Joi.string().min(5).max(255).required().email(),
  password: Joi.string().min(5).max(255).required()
});

module.exports = {
  registerSchema,
  loginSchema
};
