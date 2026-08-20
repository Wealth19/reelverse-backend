const dbConnection = require("../../configuration/db");
const AppError = require("../../utils/AppError");

// =====================================
// CREATE PAYMENT TRANSACTION
// =====================================

const createPaymentTransaction = async (payload, connection = dbConnection) => {
  const [result] = await connection.query(
    `
    INSERT INTO payment_transactions
    (
      user_id,
      provider,
      payment_reference,
      amount,
      currency,
      payment_description,
      status,
      wallet_credited
    )

    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `,

    [
      payload.userId,

      payload.provider,

      payload.paymentReference,

      payload.amount,

      payload.currency || "NGN",

      payload.paymentDescription,

      payload.status || "PENDING",

      false,
    ],
  );

  return await findPaymentTransactionById(result.insertId, false, connection);
};

// =====================================
// FIND BY ID
// =====================================

const findPaymentTransactionById = async (
  id,
  lock = false,
  connection = dbConnection,
) => {
  let sql = `

    SELECT *
    FROM payment_transactions
    WHERE id = ?

  `;

  if (lock) {
    sql += " FOR UPDATE";
  }

  const [[payment]] = await connection.query(sql, [id]);

  if (!payment) {
    throw new AppError("Payment transaction not found.", 404);
  }

  return payment;
};

// =====================================
// FIND BY PAYMENT REFERENCE
// =====================================

const findPaymentTransactionByReference = async (
  paymentReference,
  lock = false,
  connection = dbConnection,
) => {
  let sql = `

    SELECT *
    FROM payment_transactions
    WHERE payment_reference = ?

  `;

  if (lock) {
    sql += " FOR UPDATE";
  }

  const [[payment]] = await connection.query(sql, [paymentReference]);

  if (!payment) {
    throw new AppError("Payment transaction not found.", 404);
  }

  return payment;
};

// =====================================
// UPDATE PAYMENT TRANSACTION
// =====================================

const updatePaymentTransaction = async (
  paymentReference,
  payload,
  connection = dbConnection,
) => {
  await connection.query(
    `
    UPDATE payment_transactions

    SET

      transaction_reference = COALESCE(?, transaction_reference),

      payment_method = COALESCE(?, payment_method),

      status = COALESCE(?, status),

      response_body = COALESCE(?, response_body),

      failure_reason = COALESCE(?, failure_reason),

      wallet_credited = COALESCE(?, wallet_credited),

      credited_at = COALESCE(?, credited_at),

      updated_at = CURRENT_TIMESTAMP


    WHERE payment_reference = ?

    `,

    [
      payload.transactionReference,

      payload.paymentMethod,

      payload.status,

      payload.responseBody,

      payload.failureReason,

      payload.walletCredited,

      payload.creditedAt,

      paymentReference,
    ],
  );

  return await findPaymentTransactionByReference(
    paymentReference,

    false,

    connection,
  );
};

// =====================================
// MARK PAYMENT SUCCESS
// =====================================

const markPaymentSuccessful = async (
  paymentReference,
  transactionReference,
  responseBody,
  connection = dbConnection,
) => {
  return await updatePaymentTransaction(
    paymentReference,

    {
      transactionReference,

      status: "SUCCESS",

      responseBody: JSON.stringify(responseBody),

      walletCredited: true,

      creditedAt: new Date(),
    },

    connection,
  );
};

module.exports = {
  createPaymentTransaction,

  findPaymentTransactionById,

  findPaymentTransactionByReference,

  updatePaymentTransaction,

  markPaymentSuccessful,
};
