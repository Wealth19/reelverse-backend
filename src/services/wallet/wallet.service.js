// const dbConnection = require("../configuration/db");
// const AppError = require("../utils/AppError");
// const { createHistory } = require("./wallet-history.service");

// // GET WALLET
// const findOneWallet = async (id, lock = false) => {
//   let sqlQuery = `SELECT * FROM wallet WHERE id = ?`;

//   if (lock) {
//     sqlQuery += ` FOR UPDATE`;
//   }

//   const [[wallet]] = await dbConnection.query(sqlQuery, [id]);

//   if (!wallet) {
//     throw new AppError("Wallet record not found", 404);
//   }

//   return wallet;
// };

// const findOneWalletByUserId = async (
//   queryObject,
//   lock = false,
//   connection = dbConnection,
// ) => {
//   let sqlQuery = "SELECT * FROM wallet WHERE user_id = ?";

//   if (lock) {
//     sqlQuery += " FOR UPDATE";
//   }

//   const [[wallet]] = await connection.query(sqlQuery, [queryObject.userId]);

//   if (!wallet) {
//     throw new AppError("Wallet record not found", 404);
//   }

//   return wallet;
// };

// const createWallet = async (payload) => {
//   const [result] = await dbConnection.query(
//     `
//       INSERT INTO wallet
//       (user_id,balance)

//       VALUES(?,?)
//     `,
//     [payload.userId, payload.balance],
//   );

//   const queryObject = {
//     id: result.insertId,
//   };

//   const createdWallet = await findOneWallet(queryObject.id);

//   return createdWallet;
// };

// const creditWalletBalance = async (
//   payload,
//   queryObject,
//   connection = dbConnection,
// ) => {
//   await connection.query(
//     `
//       UPDATE wallet
//       SET balance = balance + ?
//       WHERE id = ?
//     `,
//     [payload.balance, queryObject.id],
//   );
// };

// const debitWalletBalance = async (
//   payload,
//   queryObject,
//   connection = dbConnection,
// ) => {
//   await connection.query(
//     `
//       UPDATE wallet
//       SET balance=balance-?
//       WHERE user_id=?

//     `,
//     [payload.balance, queryObject.userId],
//   );
// };

// // DEPOSIT (UPDATED WITH HISTORY)
// const fundWallet = async (amount, userId) => {
//   const connection = await dbConnection.getConnection();

//   try {
//     await connection.query("SET TRANSACTION ISOLATION LEVEL REPEATABLE READ");

//     await connection.beginTransaction();

//     // fix isolation level
//     const queryObject = {
//       userId: userId,
//     };

//     const wallet = await findOneWalletByUserId(queryObject, true, connection);

//     const balanceBefore = Number(wallet.balance);
//     const balanceAfter = balanceBefore + Number(amount);

//     // update wallet
//     const updatePayload = {
//       balance: amount,
//     };

//     const updateQuery = {
//       id: wallet.id,
//     };

//     await creditWalletBalance(updatePayload, updateQuery, connection);

//     const historyPayload = {
//       walletId: wallet.id,
//       transactionType: "credit",
//       amount,
//       balanceBefore,
//       balanceAfter,
//       referenceId: `DEP-${Date.now()}`,
//       description: `${amount} Wallet deposit for ${wallet.id}`,
//     };

//     // insert history (NEW STRUCTURE)
//     await createHistory(historyPayload, connection);

//     // Commit transaction
//     await connection.commit();
//   } catch (error) {
//     // Roll back on error
//     await connection.rollback();

//     if (error instanceof AppError) {
//       throw error;
//     }

//     throw new AppError("Deposit failed", 400);
//   } finally {
//     connection.release();
//   }
// };

// // WITHDRAW (UPDATED WITH HISTORY)
// const debitWallet = async (amount, userId) => {
//   const connection = await dbConnection.getConnection();

//   try {
//     await connection.query("SET TRANSACTION ISOLATION LEVEL REPEATABLE READ");

//     await connection.beginTransaction();

//     // fix isolation level
//     const queryObject = {
//       userId: userId,
//     };

//     const wallet = await findOneWalletByUserId(queryObject, true, connection);

//     const balanceBefore = Number(wallet.balance);
//     const debitAmount = Number(amount);

//     if (balanceBefore < debitAmount) {
//       throw new AppError("Insufficient balance", 400);
//     }

//     const balanceAfter = balanceBefore - debitAmount;

//     // update wallet
//     const updatePayload = {
//       balance: debitAmount,
//     };

//     const updateQuery = {
//       id: wallet.id,
//     };

//     await debitWalletBalance(updatePayload, updateQuery, connection);

//     const historyPayload = {
//       walletId: wallet.id,
//       transactionType: "debit",
//       amount: debitAmount,
//       balanceBefore,
//       balanceAfter,
//       referenceId: `WTH-${Date.now()}`,
//       description: `${debitAmount} Wallet withdrawal for ${wallet.id}`,
//     };

//     // insert history (NEW STRUCTURE)
//     await createHistory(historyPayload, connection);

//     // Commit transaction
//     await connection.commit();

//     return {
//       balanceBefore,
//       balanceAfter,
//     };
//   } catch (error) {
//     await connection.rollback();

//     if (error instanceof AppError) {
//       throw error;
//     }

//     throw new AppError("Withdrawal failed", 400);
//   } finally {
//     connection.release();
//   }
// };

// module.exports = {
//   findOneWalletByUserId,
//   findOneWallet,
//   fundWallet,
//   debitWallet,
// };

const dbConnection = require("../../configuration/db");
const AppError = require("../../utils/AppError");

const {
  creditWallet,
  debitWallet: debitWalletBalance,
} = require("./wallet-balance.service");

const { findOneWallet, findOneWalletByUserId } = require("./wallet-query.service");

// =========================
// CREATE WALLET
// =========================
// =========================
// CREATE WALLET
// =========================
const createWallet = async (
  payload,
  connection = dbConnection,
) => {
  const [result] = await connection.query(
    `
      INSERT INTO wallet
      (
        user_id,
        balance
      )
      VALUES (?, ?)
    `,
    [
      payload.userId,
      payload.balance,
    ],
  );

  return await findOneWallet(
    result.insertId,
    false,
    connection,
  );
};

// =========================
// FUND WALLET
// =========================
const fundWallet = async (amount, userId) => {
  const connection = await dbConnection.getConnection();

  try {
    await connection.query("SET TRANSACTION ISOLATION LEVEL REPEATABLE READ");

    await connection.beginTransaction();

    const wallet = await creditWallet(
      {
        userId,
        amount,
        referenceId: `DEP-${Date.now()}`,
        description: "Wallet Deposit",
      },
      connection,
    );

    await connection.commit();

    return wallet;
  } catch (error) {
    await connection.rollback();

    if (error instanceof AppError) {
      throw error;
    }

    throw new AppError("Unable to fund wallet.", 500);
  } finally {
    connection.release();
  }
};

// =========================
// DEBIT WALLET
// =========================
const debitWallet = async (amount, userId) => {
  const connection = await dbConnection.getConnection();

  try {
    await connection.query("SET TRANSACTION ISOLATION LEVEL REPEATABLE READ");

    await connection.beginTransaction();

    const wallet = await debitWalletBalance(
      {
        userId,
        amount,
        referenceId: `WTH-${Date.now()}`,
        description: "Wallet Withdrawal",
      },
      connection,
    );

    await connection.commit();

    return wallet;
  } catch (error) {
    await connection.rollback();

    if (error instanceof AppError) {
      throw error;
    }

    throw new AppError("Unable to debit wallet.", 500);
  } finally {
    connection.release();
  }
};

module.exports = {
  createWallet,
  fundWallet,
  debitWallet,
};