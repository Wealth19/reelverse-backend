const express = require("express");

const {
  getMyProfile,
  deleteMyAccount,
  updateMyProfile,
  updatePassword,
} = require("../controller/user.controller");

const protect = require("../middlewares/auth.middleware");

const {
  updateProfileValidation,
  changePasswordValidation,
  deleteAccountValidation,
} = require("../dto/user.validator");

const userRoute = express.Router();

// PROFILE

userRoute.get("/profile", protect, getMyProfile);

userRoute.put("/profile", protect, updateProfileValidation, updateMyProfile);

userRoute.delete("/profile", protect, deleteAccountValidation, deleteMyAccount);

// PASSWORD

userRoute.put(
  "/change-password",
  protect,
  changePasswordValidation,
  updatePassword,
);

module.exports = userRoute;
