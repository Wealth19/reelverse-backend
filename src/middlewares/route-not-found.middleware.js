const AppError = require("../utils/AppError");

const notFoundRoute = (req, res, next) => {
  const error = new AppError(`Invalid resource!`, 404);

  next(error);
};

module.exports = {
  notFoundRoute,
};
