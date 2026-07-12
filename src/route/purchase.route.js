const express = require("express");

const purchaseRoute = express.Router();

const {purchaseValidation} = require("../dto/purchase.validator")

const protect = require("../middlewares/auth.middleware");

const { purchaseMovie } = require("../controller/purchase.controller");

purchaseRoute.post("/", protect, purchaseValidation, purchaseMovie);

module.exports = purchaseRoute;
