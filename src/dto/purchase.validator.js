const Joi = require("joi");

const purchaseValidation = (req, res, next) => {
  const schema = Joi.object({
    movie_id: Joi.number().required(),

    payment_method: Joi.string()
      .valid("Cash", "Bank Transfer", "PayPal", "Others")
      .required(),
  });

  const { error } = schema.validate(req.body);

  if (error) {
    return res.status(400).json({
      message: error.details[0].message,
    });
  }

  next();
};

module.exports = { purchaseValidation };
