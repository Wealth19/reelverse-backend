const express = require("express");

const walletRoute = express.Router();

const { createWalletValidation } = require("../dto/wallet.validator")

const protect = require("../middlewares/auth.middleware");

const {
  getWallet,
  deposit,
  withdraw,
} = require("../controller/wallet.controller");


walletRoute.get("/", protect, getWallet);

walletRoute.post("/deposit", protect, createWalletValidation, deposit);

walletRoute.post("/withdraw", protect, withdraw);

module.exports = walletRoute;
