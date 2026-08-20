const db = require("../../configuration/db");

const monnifyService = require("../../third-party/monnify/monnify.service");

const { creditWallet } = require("../wallet/wallet-balance.service");

const AppError = require("../../utils/AppError");

class WebhookService {
  async handleMonnifyWebhook(req) {
    const signature = req.headers["monnify-signature"];

    const rawBody = req.rawBody || JSON.stringify(req.body);

    // VERIFY SIGNATURE

    const isValid = monnifyService.verifyWebhookSignature(signature, rawBody);

    if (!isValid) {
      throw new AppError("Invalid Monnify webhook signature.", 401);
    }

    const payload = req.body;

    // Ignore other events

    if (payload.eventType !== "SUCCESSFUL_TRANSACTION") {
      return {
        message: "Event ignored",
      };
    }

    const transactionData = payload.eventData;

    const paymentReference = transactionData.paymentReference;

    const transactionReference = transactionData.transactionReference;

    const amountPaid = Number(transactionData.amountPaid);

    const connection = await db.getConnection();

    try {
      await connection.beginTransaction();

      // FIND PAYMENT

      const [[payment]] = await connection.query(
        `
          SELECT *
          FROM payment_transactions
          WHERE payment_reference = ?
          FOR UPDATE
        `,

        [paymentReference],
      );

      if (!payment) {
        throw new AppError("Payment transaction not found.", 404);
      }

      // PREVENT DOUBLE CREDIT

      if (payment.wallet_credited === 1) {
        await connection.commit();

        return {
          message: "Wallet already credited",
        };
      }

      // VERIFY PAYMENT WITH MONNIFY

      const verifiedTransaction =
        await monnifyService.verifyTransaction(transactionReference);

      if (verifiedTransaction.paymentStatus !== "PAID") {
        throw new AppError("Payment has not been completed.", 400);
      }

      // CREDIT WALLET

      await creditWallet(
        {
          userId: payment.user_id,

          amount: amountPaid,

          referenceId: transactionReference,

          description: "Monnify Wallet Funding",
        },

        connection,
      );

      // UPDATE PAYMENT RECORD

      await connection.query(
        `
          UPDATE payment_transactions

          SET

          status = 'SUCCESS',

          transaction_reference = ?,

          payment_method = ?,

          response_body = ?,

          wallet_credited = TRUE,

          credited_at = CURRENT_TIMESTAMP


          WHERE id = ?

        `,

        [
          transactionReference,

          verifiedTransaction.paymentMethod || null,

          JSON.stringify(payload),

          payment.id,
        ],
      );

      await connection.commit();

      return {
        message: "Payment processed successfully",
      };
    } catch (error) {
      await connection.rollback();

      if (error instanceof AppError) {
        throw error;
      }

      throw new AppError("Unable to process webhook.", 500);
    } finally {
      connection.release();
    }
  }
}

module.exports = new WebhookService();
