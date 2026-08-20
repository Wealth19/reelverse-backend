// // const Joi = require("joi");

// // // UPDATE PROFILE VALIDATION

// // const updateProfileValidation = (req, res, next) => {
// //   const schema = Joi.object({
// //     name: Joi.string().trim().min(3).max(100).required(),

// //     phone: Joi.string().trim().max(20).allow("", null).optional(),

// //     bio: Joi.string().trim().max(300).allow("", null).optional(),
// //   });

// //   const { error } = schema.validate(req.body);

// //   if (error) {
// //     return res.status(400).json({
// //       status: "fail",
// //       message: error.details[0].message,
// //     });
// //   }

// //   next();
// // };

// // // CHANGE PASSWORD VALIDATION

// // const changePasswordValidation = (req, res, next) => {
// //   const schema = Joi.object({
// //     currentPassword: Joi.string().required(),

// //     newPassword: Joi.string()
// //       .min(8)
// //       .max(30)
// //       .pattern(
// //         new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[@$!%*?&]).+$"),
// //       )
// //       .required(),
// //   });

// //   const { error } = schema.validate(req.body);

// //   if (error) {
// //     return res.status(400).json({
// //       status: "fail",
// //       message: error.details[0].message,
// //     });
// //   }

// //   next();
// // };

// // // DELETE ACCOUNT VALIDATION

// // const deleteAccountValidation = (req, res, next) => {
// //   const schema = Joi.object({
// //     password: Joi.string().required(),
// //   });

// //   const { error } = schema.validate(req.body);

// //   if (error) {
// //     return res.status(400).json({
// //       status: "fail",
// //       message: error.details[0].message,
// //     });
// //   }

// //   next();
// // };

// // module.exports = {
// //   updateProfileValidation,
// //   changePasswordValidation,
// //   deleteAccountValidation,
// // };

// const Joi = require("joi");

// // UPDATE PROFILE VALIDATION

// const updateProfileValidation = (req, res, next) => {
//   const schema = Joi.object({
//     name: Joi.string().trim().min(3).max(100).required(),

//     email: Joi.string().email().trim().lowercase().max(254).required(),
//   });

//   const { error } = schema.validate(req.body);

//   if (error) {
//     return res.status(400).json({
//       status: "fail",
//       message: error.details[0].message,
//     });
//   }

//   next();
// };

// // CHANGE PASSWORD VALIDATION

// const changePasswordValidation = (req, res, next) => {
//   const schema = Joi.object({
//     currentPassword: Joi.string().required(),

//     newPassword: Joi.string()
//       .min(8)
//       .max(30)
//       .pattern(
//         new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[@$!%*?&]).+$"),
//       )
//       .required(),
//   });

//   const { error } = schema.validate(req.body);

//   if (error) {
//     return res.status(400).json({
//       status: "fail",
//       message: error.details[0].message,
//     });
//   }

//   next();
// };

// // DELETE ACCOUNT VALIDATION

// const deleteAccountValidation = (req, res, next) => {
//   const schema = Joi.object({
//     password: Joi.string().required(),
//   });

//   const { error } = schema.validate(req.body);

//   if (error) {
//     return res.status(400).json({
//       status: "fail",
//       message: error.details[0].message,
//     });
//   }

//   next();
// };

// module.exports = {
//   updateProfileValidation,
//   changePasswordValidation,
//   deleteAccountValidation,
// };

const Joi = require("joi");

/*
|--------------------------------------------------------------------------
| UPDATE PROFILE VALIDATION
|--------------------------------------------------------------------------
*/

const updateProfileValidation = (req, res, next) => {
  const schema = Joi.object({
    name: Joi.string().trim().min(3).max(100).required().messages({
      "string.empty": "Name is required",
      "string.min": "Name must be at least 3 characters",
      "string.max": "Name cannot exceed 100 characters",
      "any.required": "Name is required",
    }),

    email: Joi.string()
      .email()
      .trim()
      .lowercase()
      .max(254)
      .required()
      .messages({
        "string.empty": "Email is required",
        "string.email": "Please provide a valid email",
        "any.required": "Email is required",
      }),
  });

  const { error } = schema.validate(req.body, {
    abortEarly: true,
    stripUnknown: true,
  });

  if (error) {
    return res.status(400).json({
      status: "fail",
      message: error.details[0].message,
    });
  }

  next();
};

/*
|--------------------------------------------------------------------------
| CHANGE PASSWORD VALIDATION
|--------------------------------------------------------------------------
*/

const changePasswordValidation = (req, res, next) => {
  const schema = Joi.object({
    currentPassword: Joi.string().required().messages({
      "string.empty": "Current password is required",
      "any.required": "Current password is required",
    }),

    newPassword: Joi.string()
      .min(8)
      .max(30)
      .pattern(
        new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[@$!%*?&]).+$"),
      )
      .required()
      .messages({
        "string.empty": "New password is required",
        "string.min": "New password must be at least 8 characters",
        "string.max": "New password cannot exceed 30 characters",
        "string.pattern.base":
          "New password must contain uppercase, lowercase, number and special character",
        "any.required": "New password is required",
      }),
  });

  const { error } = schema.validate(req.body, {
    abortEarly: true,
    stripUnknown: true,
  });

  if (error) {
    return res.status(400).json({
      status: "fail",
      message: error.details[0].message,
    });
  }

  next();
};

/*
|--------------------------------------------------------------------------
| DELETE ACCOUNT VALIDATION
|--------------------------------------------------------------------------
*/

const deleteAccountValidation = (req, res, next) => {
  const schema = Joi.object({
    password: Joi.string().required().messages({
      "string.empty": "Password is required",
      "any.required": "Password is required",
    }),
  });

  const { error } = schema.validate(req.body, {
    abortEarly: true,
    stripUnknown: true,
  });

  if (error) {
    return res.status(400).json({
      status: "fail",
      message: error.details[0].message,
    });
  }

  next();
};

module.exports = {
  updateProfileValidation,
  changePasswordValidation,
  deleteAccountValidation,
};