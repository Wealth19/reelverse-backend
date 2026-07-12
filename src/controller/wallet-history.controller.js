const dbConnection = require("../configuration/db");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/AppError");

// GET ALL WALLET HISTORY

const getWalletHistory = catchAsync(async (req, res) => {
  const userId = req.user.id;

  const [history] = await dbConnection.query(
    `
    SELECT 
      wh.id,
      wh.transaction_type,
      wh.amount,
      wh.balance_before,
      wh.balance_after,
      wh.reference_id,
      wh.description,
      wh.transaction_date

    FROM wallet_history wh

    JOIN wallet w ON w.id = wh.wallet_id

    WHERE w.user_id = ?

    ORDER BY wh.transaction_date DESC
    `,
    [userId],
  );

  res.status(200).json({
    status: "success",
    results: history.length,
    data: {
      history,
    },
  });
});

// GET SINGLE TRANSACTION

const getTransaction = catchAsync(async (req, res) => {
  const userId = req.user.id;
  const { id } = req.params;

  const [[transaction]] = await dbConnection.query(
    `
    SELECT 
      wh.id,
      wh.transaction_type,
      wh.amount,
      wh.balance_before,
      wh.balance_after,
      wh.reference_id,
      wh.description,
      wh.transaction_date

    FROM wallet_history wh

    JOIN wallet w ON w.id = wh.wallet_id

    WHERE wh.id = ?
    AND w.user_id = ?
    `,
    [id, userId],
  );

  if (!transaction) {
    throw new AppError("Transaction not found", 404);
  }

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
