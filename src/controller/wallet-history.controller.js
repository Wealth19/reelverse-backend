// const dbConnection = require("../configuration/db");
// const catchAsync = require("../utils/catchAsync");
// const AppError = require("../utils/AppError");
// const { findOneWalletByUserId } = require("../services/wallet.service");
// const { indexHistory, findOneHistory } = require("../services/wallet-history.service");

// // GET ALL WALLET HISTORY

// const getWalletHistory = catchAsync(async (req, res) => {
//   const queryObject = {
//     userId: req.user.id,
//   };

//   const wallet = await findOneWalletByUserId(queryObject);

//   const historyQuery = {
//     walletId: wallet.id,
//   };

//   const history = await indexHistory(historyQuery);

//   res.status(200).json({
//     status: "success",
//     results: history.length,
//     data: {
//       history,
//     },
//   });
// });

// // GET SINGLE TRANSACTION

// const getTransaction = catchAsync(async (req, res) => {
//   const queryObject = {
//     userId: req.user.id,
//   };

//   const wallet = await findOneWalletByUserId(queryObject);

//   const transaction = await findOneHistory({
//     id: req.params.id,
//     walletId: wallet.id,
//   });

//   res.status(200).json({
//     status: "success",
//     data: {
//       transaction,
//     },
//   });
// });

// module.exports = {
//   getWalletHistory,
//   getTransaction,
// };

const catchAsync = require("../utils/catchAsync");
const { findOneWalletByUserId } = require("../services/wallet");
const { indexHistory, findOneHistory } = require("../services/wallet/wallet-history.service");

const getWalletHistory = catchAsync(async (req, res) => {
  const wallet = await findOneWalletByUserId({
    userId: req.user.id,
  });

  const history = await indexHistory({
    walletId: wallet.id,
  });

  res.status(200).json({
    status: "success",
    results: history.length,
    data: {
      history,
    },
  });
});

const getTransaction = catchAsync(async (req, res) => {
  const wallet = await findOneWalletByUserId({
    userId: req.user.id,
  });

  const transaction = await findOneHistory({
    id: req.params.id,
    walletId: wallet.id,
  });

  res.status(200).json({
    status: "success",
    data: {
      transaction,
    },
  });
});

module.exports = {
  getWalletHistory,
  getTransaction,
};