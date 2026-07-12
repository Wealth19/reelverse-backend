const Joi = require("joi");

const createWalletValidation = (req, res, next) => {
  const schema = Joi.object({
    amount: Joi.number().positive().required().messages({
      "any.required": "Amount is required",

      "number.base": "Amount must be a number",

      "number.positive": "Amount must be greater than zero",
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

module.exports = {createWalletValidation};
