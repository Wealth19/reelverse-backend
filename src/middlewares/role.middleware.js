const AppError = require("../utils/AppError");


const allowRole = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      // return res.status(403).json({
      //   message: "You don't have permission",

      throw new AppError("You don't have permission.", 403);
    };

    next();
  };
};

module.exports = allowRole;
