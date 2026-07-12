const express = require("express");

const {
  getMyProfile,
  updateProfile,
  deleteMyAccount,
  findAll,
} = require("../controller/user.controller");

const protect = require("../middlewares/auth.middleware");

const { updateValidation } = require("../dto/user.validator");

const userRoute = express.Router();

// GET PROFILE
userRoute.get("/profile", protect, getMyProfile);

// UPDATE PROFILE
userRoute.put("/users:id", protect, updateValidation, updateProfile);

// DELETE ACCOUNT
userRoute.delete("/users:id", protect, deleteMyAccount);

// FIND ALL USERS
userRoute.get("/", findAll);

module.exports = userRoute;
