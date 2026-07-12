const Joi = require("joi");

// UPDATE VALIDATION
const updateValidation = (req, res, next) => {
  const schema = Joi.object({
    name: Joi.string().alphanum().min(3).max(100),

    email: Joi.string().email().lowercase().trim().max(254),

    password: Joi.string()
      .min(8)
      .max(30)
      .pattern(
        new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[@$!%*?&]).+$"),
      ),
  });

  const { error } = schema.validate(req.body);

  if (error) {
    return res.status(400).json({
      message: error.details[0].message,
    });
  }

  next();
};

module.exports = {
  updateValidation,
};
