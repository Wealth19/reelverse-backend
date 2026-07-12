const express = require("express");

const walletHistoryRoute = express.Router();

const protect = require("../middlewares/auth.middleware");

const {
  getWalletHistory,

  getTransaction,
} = require("../controller/wallet-history.controller");

// user wallet history

walletHistoryRoute.get("/", protect, getWalletHistory);

// single transaction
walletHistoryRoute.get("/:id", protect, getTransaction);


module.exports = walletHistoryRoute;
