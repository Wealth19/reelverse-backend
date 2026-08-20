const catchAsync = require("../utils/catchAsync");
const authService = require("../services/auth/auth.service");
const { generateToken, generateRefreshToken } = require("../utils/token");

// ============================================================
// REFRESH TOKEN COOKIE OPTIONS
// ============================================================

const refreshCookieOptions = {
  httpOnly: true,

  secure: process.env.NODE_ENV === "production",

  sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",

  maxAge: 7 * 24 * 60 * 60 * 1000,

  path: "/api/auth",
};

// ============================================================
// REGISTER
// ============================================================

const register = catchAsync(async (req, res) => {
  const user = await authService.registerUser(req.body);

  const accessToken = generateToken(user.id, user.email, user.role);

  const refreshToken = generateRefreshToken(user.id, user.email, user.role);

  // Store refresh token in HttpOnly cookie
  res.cookie("refreshToken", refreshToken, refreshCookieOptions);

  res.status(201).json({
    status: "success",
    message: "Account created successfully",

    data: {
      user,

      access: {
        token: accessToken,
        type: "Bearer",
        expires_in: process.env.JWT_ACCESS_TOKEN_EXPIRES_IN,
      },
    },
  });
});

// ============================================================
// LOGIN
// ============================================================

const login = catchAsync(async (req, res) => {
  const user = await authService.loginUser(req.body.email, req.body.password);

  const accessToken = generateToken(user.id, user.email, user.role);

  const refreshToken = generateRefreshToken(user.id, user.email, user.role);

  // Store refresh token in HttpOnly cookie
  res.cookie("refreshToken", refreshToken, refreshCookieOptions);

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
    },
  });
});

// ============================================================
// REFRESH ACCESS TOKEN
// ============================================================

const refreshAuthToken = catchAsync(async (req, res) => {
  const refreshToken = req.cookies?.refreshToken;

  const user = await authService.refreshAuthToken(refreshToken);

  const accessToken = generateToken(user.id, user.email, user.role);

  // Refresh-token rotation
  const newRefreshToken = generateRefreshToken(user.id, user.email, user.role);

  // Replace old refresh token
  res.cookie("refreshToken", newRefreshToken, refreshCookieOptions);

  res.status(200).json({
    status: "success",
    message: "Token refreshed successfully",

    data: {
      user,

      access: {
        token: accessToken,
        type: "Bearer",
        expires_in: process.env.JWT_ACCESS_TOKEN_EXPIRES_IN,
      },
    },
  });
});

// ============================================================
// LOGOUT
// ============================================================

const logout = catchAsync(async (req, res) => {
  // Delete the HttpOnly refresh-token cookie
  res.clearCookie("refreshToken", refreshCookieOptions);

  res.status(200).json({
    status: "success",
    message: "Logout successful",
  });
});

module.exports = {
  register,
  login,
  refreshAuthToken,
  logout,
};
