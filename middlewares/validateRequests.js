const { celebrate, Joi, Segments } = require('celebrate');
const validator = require('validator');

// Custom URL validator using validator package
const urlValidator = (value, helpers) => {
  if (!validator.isURL(value)) {
    return helpers.error('any.invalid');
  }
  return value;
};

// Validation for creating a clothing item
const validateCreateItem = celebrate({
  [Segments.BODY]: Joi.object().keys({
    name: Joi.string().required(),
    imageUrl: Joi.string().required().custom(urlValidator, 'URL validation'),
    weather: Joi.string().required().valid('hot', 'cold', 'rainy', 'snowy'),
  }),
});

// Validation for signup
const validateSignup = celebrate({
  [Segments.BODY]: Joi.object().keys({
    name: Joi.string().required(),
    avatar: Joi.string().required().custom(urlValidator, 'URL validation'),
    email: Joi.string().required().email(),
    password: Joi.string().required().min(6),
  }),
});

// Validation for login
const validateLogin = celebrate({
  [Segments.BODY]: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
});

// Validation for user update
const validateUpdateProfile = celebrate({
  [Segments.BODY]: Joi.object().keys({
    name: Joi.string().required(),
    avatar: Joi.string().required().custom(urlValidator, 'URL validation'),
  }),
});

// Validation for item ID in params
const validateItemIdParam = celebrate({
  [Segments.PARAMS]: Joi.object().keys({
    itemId: Joi.string().hex().length(24).required(),
  }),
});

module.exports = {
  validateCreateItem,
  validateSignup,
  validateLogin,
  validateUpdateProfile,
  validateItemIdParam,
};