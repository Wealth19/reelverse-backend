const Joi = require("joi");

const rentalValidation = (req, res, next) => {
  const schema = Joi.object({
    movie_id: Joi.number().required(),
  });

  const { error } = schema.validate(req.body);

  if (error) {
    return res.status(400).json({
      message: error.details[0].message,
    });
  }

  next();
};

module.exports = { rentalValidation };

