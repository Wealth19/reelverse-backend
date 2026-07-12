const { promisify } = require("util");
const jwt = require("jsonwebtoken");

const dbConnection = require("../configuration/db");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/AppError");

require("dotenv").config();

const protect = catchAsync(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    throw new AppError("Access denied. User authentication required", 401);
  }

  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  const [[user]] = await dbConnection.query(
    `
    SELECT
    id,
    name,
    email,
    role

    FROM users

    WHERE id=?
  `,
    [decoded.id],
  );

  if (!user) {
    throw new AppError("User no longer exists", 401);
  }

  req.user = user;

  next();
});

module.exports = protect;
