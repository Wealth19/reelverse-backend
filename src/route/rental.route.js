const express = require("express");

const {rentalValidation} = require("../dto/rental.validator");

const rentalRoute = express.Router();

const protect = require("../middlewares/auth.middleware");

const { rentMovie } = require("../controller/rental.controller");

rentalRoute.post("/", protect, rentalValidation, rentMovie);

module.exports = rentalRoute;
