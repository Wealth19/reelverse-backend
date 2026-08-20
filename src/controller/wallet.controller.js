// const dbConnection = require("../configuration/db");
// const AppError = require("../utils/AppError");
// const catchAsync = require("../utils/catchAsync");
// const {
//   fundWallet,
//   debitWallet,
//   findOneWalletByUserId,
// } = require("../services/wallet.service.js");

// // GET WALLET
// const getWallet = catchAsync(async (req, res) => {
//   const userId = req.user.id;

//   const queryObject = {
//     userId,
//   };

//   const wallet = await findOneWalletByUserId(queryObject);

//   res.status(200).json({
//     status: "success",
//     data: wallet,
//   });
// });

// // DEPOSIT (UPDATED WITH HISTORY)
// const deposit = catchAsync(async (req, res) => {
//   const { amount } = req.body;
//   const userId = req.user.id;

//   await fundWallet(amount, userId);

//   res.json({
//     status: "success",
//     message: "Deposit successful",
//   });
// });

// // WITHDRAW (UPDATED WITH HISTORY)
// const withdraw = catchAsync(async (req, res) => {
//   const { amount } = req.body;
//   const userId = req.user.id;

//   await debitWallet(amount, userId);

//   res.json({
//     status: "success",
//     message: "Withdrawal successful",
//   });
// });

// module.exports = {
//   getWallet,
//   deposit,
//   withdraw,
// };

const catchAsync = require("../utils/catchAsync");
const {
  fundWallet,
  debitWallet,
  findOneWalletByUserId,
} = require("../services/wallet");


// GET WALLET
const getWallet = catchAsync(async (req, res) => {
  const wallet = await findOneWalletByUserId({
    userId: req.user.id,
  });

  res.status(200).json({
    status: "success",
    data: {
      wallet,
    },
  });
});

// DEPOSIT WALLET
//
// Note:
// Normal manual deposit.
// Actual Monnify funding will come through webhook.
const deposit = catchAsync(async (req, res) => {
  const { amount } = req.body;

  await fundWallet(amount, req.user.id);

  res.status(200).json({
    status: "success",
    message: "Wallet funded successfully.",
  });
});

// WITHDRAW WALLET
const withdraw = catchAsync(async (req, res) => {
  const { amount } = req.body;

  const result = await debitWallet(amount, req.user.id);

  res.status(200).json({
    status: "success",
    message: "Withdrawal successful.",
    data: result,
  });
});

module.exports = {
  getWallet,
  deposit,
  withdraw,
};