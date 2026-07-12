const Joi = require("joi");

// REGISTER VALIDATION
const registerValidation = (req, res, next) => {
  const schema = Joi.object({
    name: Joi.string()
      .trim()
      .min(3)
      .max(50)
      .pattern(/^[A-Za-z ]+$/)
      .required()
      .messages({
        "any.required": "Name is required",
        "string.empty": "Name cannot be empty",
        "string.min": "Name must be at least {#limit} characters",
        "string.max": "Name cannot exceed {#limit} characters",
        "string.pattern.base": "Name can only contain letters and spaces",
      }),

    email: Joi.string()
      .email()
      .trim()
      .lowercase()
      .max(254)
      .required()
      .messages({
        "any.required": "Email is required",
        "string.empty": "Email cannot be empty",
        "string.email": "Invalid email format",
      }),

    password: Joi.string()
      .min(8)
      .max(30)
      .pattern(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&]).+$"))
      .required()
      .messages({
        "any.required": "Password is required",
        "string.empty": "Password cannot be empty",
        "string.min": "Password must be at least 8 characters",
        "string.max": "Password cannot exceed 30 characters",
        "string.pattern.base":
          "Password must contain an uppercase letter, lowercase letter, number and special character",
      }),
  });

  const { error } = schema.validate(req.body);

  if (error) {
    return res.status(400).json({
      status: "fail",
      message: error.details[0].message,
    });
  }

  next();
};

// LOGIN VALIDATION
const loginValidation = (req, res, next) => {
  const schema = Joi.object({
    email: Joi.string().email().trim().lowercase().required().messages({
      "any.required": "Email is required",
      "string.empty": "Email cannot be empty",
      "string.email": "Invalid email format",
    }),

    password: Joi.string().required().messages({
      "any.required": "Password is required",
      "string.empty": "Password cannot be empty",
    }),
  });

  const { error } = schema.validate(req.body);

  if (error) {
    return res.status(400).json({
      status: "fail",
      message: error.details[0].message,
    });
  }

  next();
};

// REFRESH TOKEN VALIDATION
const refreshValidation = (req, res, next) => {
  const schema = Joi.object({
    refreshToken: Joi.string().required().messages({
      "any.required": "Refresh token is required",
      "string.empty": "Refresh token cannot be empty",
    }),
  });

  const { error } = schema.validate(req.body);

  if (error) {
    return res.status(400).json({
      status: "fail",
      message: error.details[0].message,
    });
  }

  next();
};

module.exports = {
  registerValidation,
  loginValidation,
  refreshValidation,
};
