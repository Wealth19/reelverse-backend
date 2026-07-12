const express = require("express");

const {
  registerValidation,
  loginValidation,
  refreshValidation,
} = require("../dto/auth.validator");

const {
  register,
  loginUser,
  refreshAuthToken,
} = require("../controller/auth.controller");

const protect = require("../middlewares/auth.middleware");

const authRoute = express.Router();

authRoute.post("/register", registerValidation, register);

authRoute.post("/login", loginValidation, loginUser);

authRoute.post("/refresh", refreshValidation, refreshAuthToken);

module.exports = authRoute;
