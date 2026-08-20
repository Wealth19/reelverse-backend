const AppError = require("../../utils/AppError");
const { createHistory } = require("./wallet-history.service");
const { findOneWalletByUserId } = require("./wallet-query.service");
/**
 * Credit a user's wallet.
 *
 * NOTE:
 * This service DOES NOT manage transactions.
 * The caller must handle:
 * - beginTransaction()
 * - commit()
 * - rollback()
 */
const creditWallet = async (payload, connection) => {
  const {
    userId,
    amount,
    referenceId,
    description,
    transactionType = "credit",
  } = payload;

  const creditAmount = Number(amount);

  if (Number.isNaN(creditAmount) || creditAmount <= 0) {
    throw new AppError("Invalid credit amount.", 400);
  }

  const wallet = await findOneWalletByUserId({ userId }, true, connection);

  const balanceBefore = Number(wallet.balance);

  const balanceAfter = balanceBefore + creditAmount;

  await connection.query(
    `
      UPDATE wallet
      SET balance = ?
      WHERE id = ?
    `,
    [balanceAfter, wallet.id],
  );

  await createHistory(
    {
      walletId: wallet.id,
      transactionType,
      amount: creditAmount,
      balanceBefore,
      balanceAfter,
      referenceId,
      description,
    },
    connection,
  );

  return {
    walletId: wallet.id,
    userId,
    amount: creditAmount,
    balanceBefore,
    balanceAfter,
  };
};

/**
 * Debit a user's wallet.
 *
 * NOTE:
 * This service DOES NOT manage transactions.
 * The caller must handle:
 * - beginTransaction()
 * - commit()
 * - rollback()
 */
const debitWallet = async (payload, connection) => {
  const {
    userId,
    amount,
    referenceId,
    description,
    transactionType = "debit",
  } = payload;

  const debitAmount = Number(amount);

  if (Number.isNaN(debitAmount) || debitAmount <= 0) {
    throw new AppError("Invalid debit amount.", 400);
  }

  const wallet = await findOneWalletByUserId({ userId }, true, connection);

  const balanceBefore = Number(wallet.balance);

  if (balanceBefore < debitAmount) {
    throw new AppError("Insufficient wallet balance.", 400);
  }

  const balanceAfter = balanceBefore - debitAmount;

  await connection.query(
    `
      UPDATE wallet
      SET balance = ?
      WHERE id = ?
    `,
    [balanceAfter, wallet.id],
  );

  await createHistory(
    {
      walletId: wallet.id,
      transactionType,
      amount: debitAmount,
      balanceBefore,
      balanceAfter,
      referenceId,
      description,
    },
    connection,
  );

  return {
    walletId: wallet.id,
    userId,
    amount: debitAmount,
    balanceBefore,
    balanceAfter,
  };
};

module.exports = {
  creditWallet,
  debitWallet,
};
