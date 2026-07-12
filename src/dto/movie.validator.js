const Joi = require("joi");

const createMovieValidation = (req, res, next) => {
  const schema = Joi.object({
    title: Joi.string().min(2).max(100).required().messages({
      "any.required": "Movie title is required",
      "string.empty": "Movie title cannot be empty",
    }),

    description: Joi.string().optional(),

    rental_price: Joi.number().min(0).required().messages({
      "any.required": "Rental price is required",
      "number.base": "Rental price must be a number",
    }),

    purchase_price: Joi.number().min(0).required().messages({
      "any.required": "Purchase price is required",

      "number.base": "Purchase price must be a number",
    }),
  });

  const { error } = schema.validate(req.body);

  if (error) {
    return res.status(400).json({
      message: error.details[0].message,
    });
  }

  next();
};

module.exports = { createMovieValidation };
