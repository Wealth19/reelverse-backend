const dbConnection = require("../configuration/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const path = require("path");

const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/AppError");
const { access } = require("fs");

require("dotenv").config({
  path: path.resolve(__dirname, "../../.env"),
});

// Generate JWT Token

const generateToken = (id, email, role) => {
  return jwt.sign(
    {
      id,
      email,
      role,
    },

    process.env.JWT_SECRET,

    {
      expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRES_IN,
    },
  );
};

const refreshToken = (id, email, role) => {
  return jwt.sign({ id, email, role }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.JWT_REFRESH_TOKEN_EXPIRES_IN,
  });
};

// // REGISTER
const register = catchAsync(async (req, res) => {
  const { name, email, password } = req.body;

  const [[existingUser]] = await dbConnection.query(
    `
      SELECT id
      FROM users
      WHERE email=?
    `,
    [email],
  );

  if (existingUser) {
    throw new AppError("Email already exists", 409);
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const role = "customer";

  const [result] = await dbConnection.query(
    `
      INSERT INTO users
      (name,email,password,role)

      VALUES(?,?,?,?)
    `,
    [name, email, hashedPassword, role],
  );

  const userId = result.insertId;

  await dbConnection.query(
    `
      INSERT INTO wallet
      (user_id,balance)

      VALUES(?,?)
    `,
    [userId, 0],
  );

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
    [userId],
  );

  const accessToken = generateToken(user.id, user.email, user.role);

  const refresh = refreshToken(user.id, user.email, user.role);

  res.status(201).json({
    status: "success",

    message: "Account created successfully",

    data: {
      user,

      accessToken,

      refreshToken: refresh,

      expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRES_IN,
    },
  });
});

// LOGIN
const loginUser = catchAsync(async (req, res) => {
  const { email, password } = req.body;

  const [[user]] = await dbConnection.query(
    `
      SELECT *
      FROM users
      WHERE email=?
    `,
    [email],
  );

  if (!user) {
    throw new AppError("Invalid email or password", 401);
  }

  const passwordMatch = await bcrypt.compare(password, user.password);

  if (!passwordMatch) {
    throw new AppError("Invalid email or password", 401);
  }

  const accessToken = generateToken(user.id, user.email, user.role);

  const refresh = refreshToken(user.id, user.email, user.role);

  res.status(200).json({
    status: "success",
    message: "Login successful",
    data: {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },

      access: {
        token: accessToken,
        type: "Bearer",
        expires_in: process.env.JWT_ACCESS_TOKEN_EXPIRES_IN,
      },

      refresh: {
        token: refresh,
        expires_in: process.env.JWT_REFRESH_TOKEN_EXPIRES_IN,
      },
    },
  });
});

// UPDATE
const refreshAuthToken = catchAsync(async (req, res) => {
  const { refreshToken: refreshTokenJwt } = req.body;

  const decoded = jwt.verify(refreshTokenJwt, process.env.JWT_REFRESH_SECRET);

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
    throw new AppError("User not found", 401);
  }

  const accessToken = generateToken(user.id, user.email, user.role);

  const refresh = refreshToken(user.id, user.email, user.role);

  res.status(200).json({
    status: "success",

    message: "Token refreshed successfully",

    data: {
      user,

      accessToken,

      refreshToken: refresh,

      expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRES_IN,
    },
  });
});

module.exports = {
  register,
  loginUser,
  refreshAuthToken,
};
