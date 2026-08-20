// const dbConnection = require("../../configuration/db");
// const AppError = require("../../utils/AppError");

// // GET WALLET
// const indexHistory = async (queryObject) => {
//   const [histories] = await dbConnection.query(
//     `
//       SELECT *
//       FROM wallet_history
//       WHERE wallet_id = ?
//     `,
//     [queryObject.walletId],
//   );

//   return histories;
// };

// const findOneHistory = async (queryObject, connection = dbConnection) => {
//   const [[history]] = await connection.query(
//     "SELECT * FROM wallet_history WHERE id = ? AND wallet_id = ?",
//     [queryObject.id, queryObject.walletId],
//   );

//   if (!history) {
//     throw new AppError("Wallet history record not found", 404);
//   }

//   return history;
// };

// const createHistory = async (payload, connection = dbConnection) => {
//   const [result] = await connection.query(
//     `
//       INSERT INTO wallet_history
//       (
//         wallet_id,
//         transaction_type,
//         amount,
//         balance_before,
//         balance_after,
//         reference_id,
//         description
//       )
//       VALUES (?, ?, ?, ?, ?, ?, ?)
//     `,
//     [
//       payload.walletId,
//       payload.transactionType,
//       payload.amount,
//       payload.balanceBefore,
//       payload.balanceAfter,
//       payload.referenceId,
//       payload.description,
//     ],
//   );

//   const createdHistory = await findOneHistory(
//     { id: result.insertId, walletId: payload.walletId },
//     connection,
//   );

//   return createdHistory;
// };

// // const updateHistory = async function (payload, queryObject) {
// //   await dbConnection.query(
// //     `
// //       UPDATE wallet
// //       SET balance=balance-?
// //       WHERE user_id=?
// //     `,
// //     [payload.balance, queryObject.userId],
// //   );
// // };

// const history = {
//   // updateHistory,
//   createHistory,
//   indexHistory,
//   findOneHistory,
// };

// module.exports = history;

const dbConnection = require("../../configuration/db");
const AppError = require("../../utils/AppError");

/**
 * Get wallet history
 */
const indexHistory = async (queryObject, connection = dbConnection) => {
  const [histories] = await connection.query(
    `
      SELECT *
      FROM wallet_history
      WHERE wallet_id = ?
      ORDER BY created_at DESC
    `,
    [queryObject.walletId],
  );

  return histories;
};

/**
 * Find one wallet history record
 */
const findOneHistory = async (queryObject, connection = dbConnection) => {
  const [[history]] = await connection.query(
    `
      SELECT *
      FROM wallet_history
      WHERE id = ?
      AND wallet_id = ?
    `,
    [queryObject.id, queryObject.walletId],
  );

  if (!history) {
    throw new AppError("Wallet history record not found.", 404);
  }

  return history;
};

/**
 * Create wallet history
 */
const createHistory = async (payload, connection = dbConnection) => {
  const [result] = await connection.query(
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
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `,
    [
      payload.walletId,
      payload.transactionType,
      payload.amount,
      payload.balanceBefore,
      payload.balanceAfter,
      payload.referenceId,
      payload.description,
    ],
  );

  return await findOneHistory(
    {
      id: result.insertId,
      walletId: payload.walletId,
    },
    connection,
  );
};

module.exports = {
  createHistory,
  indexHistory,
  findOneHistory,
};
