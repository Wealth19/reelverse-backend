const express = require("express");

const {
  registerValidation,
  loginValidation,
  refreshValidation,
} = require("../dto/auth.validator");

const {
  register,
  login,
  refreshAuthToken,
  logout,
} = require("../controller/auth.controller");

const authRoute = express.Router();

// ============================================================
// REGISTER
// ============================================================

authRoute.post("/register", registerValidation, register);

// ============================================================
// LOGIN
// ============================================================

authRoute.post("/login", loginValidation, login);

// ============================================================
// REFRESH ACCESS TOKEN
// ============================================================

authRoute.post("/refresh", refreshValidation, refreshAuthToken);

// ============================================================
// LOGOUT
// ============================================================

authRoute.post("/logout", logout);

module.exports = authRoute;
