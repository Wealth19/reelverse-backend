const dbConnection = require("../configuration/db");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/AppError");

// GET WALLET
const getWallet = catchAsync(async (req, res) => {
  const userId = req.user.id;

  const [[wallet]] = await dbConnection.query(
    `
    SELECT *
    FROM wallet
    WHERE user_id=?
    `,
    [userId],
  );

  if (!wallet) {
    throw new AppError("Wallet not found", 404);
  }

  res.status(200).json({
    status: "success",
    data: wallet,
  });
});

// DEPOSIT (UPDATED WITH HISTORY)

const deposit = catchAsync(async (req, res) => {
  const { amount } = req.body;
  const userId = req.user.id;

  if (amount <= 0) {
    throw new AppError("Invalid amount", 400);
  }

  const [[wallet]] = await dbConnection.query(
    "SELECT id, balance FROM wallet WHERE user_id=?",
    [userId],
  );

  if (!wallet) {
    throw new AppError("Wallet not found", 404);
  }

  const balanceBefore = Number(wallet.balance);
  const balanceAfter = balanceBefore + Number(amount);

  // update wallet
  await dbConnection.query(
    `
    UPDATE wallet
    SET balance=?
    WHERE id=?
    `,
    [balanceAfter, wallet.id],
  );

  // insert history (NEW STRUCTURE)
  await dbConnection.query(
    `
    INSERT INTO wallet_history
    (
      wallet_id,
      transaction_type,
      amount,
      balance_before,
      balance_after,
      reference_id,
      description
    )
    VALUES (?,?,?,?,?,?,?)
    `,
    [
      wallet.id,
      "deposit",
      amount,
      balanceBefore,
      balanceAfter,
      `DEP-${Date.now()}`,
      "Wallet deposit",
    ],
  );

  res.json({
    status: "success",
    message: "Deposit successful",
  });
});

// WITHDRAW (UPDATED WITH HISTORY)

const withdraw = catchAsync(async (req, res) => {
  const { amount } = req.body;
  const userId = req.user.id;

  const [[wallet]] = await dbConnection.query(
    "SELECT id, balance FROM wallet WHERE user_id=?",
    [userId],
  );

  if (!wallet) {
    throw new AppError("Wallet not found", 404);
  }

  if (wallet.balance < amount) {
    throw new AppError("Insufficient balance", 400);
  }

  const balanceBefore = Number(wallet.balance);
  const balanceAfter = balanceBefore - Number(amount);

  // update wallet
  await dbConnection.query(
    `
    UPDATE wallet
    SET balance=?
    WHERE id=?
    `,
    [balanceAfter, wallet.id],
  );

  // insert history
  await dbConnection.query(
    `
    INSERT INTO wallet_history
    (
      wallet_id,
      transaction_type,
      amount,
      balance_before,
      balance_after,
      reference_id,
      description
    )
    VALUES (?,?,?,?,?,?,?)
    `,
    [
      wallet.id,
      "withdraw",
      amount,
      balanceBefore,
      balanceAfter,
      `WTH-${Date.now()}`,
      "Wallet withdrawal",
    ],
  );

  res.json({
    status: "success",
    message: "Withdrawal successful",
  });
});

module.exports = {
  getWallet,
  deposit,
  withdraw,
};
