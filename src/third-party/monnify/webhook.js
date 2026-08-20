const dbConnection = require("../../configuration/db");
const AppError = require("../../utils/AppError");
const monnifyService = require("../../third-party/monnify/monnify.service");
const paymentVerificationService = require("../../services/payment/payment.verification.service");
const { creditWallet } = require("../../services/wallet/wallet-balance.service");
const {
  findPaymentTransactionByReference,
  updatePaymentTransaction,
} = require("../../services/payment/payment-transaction.service");
// const {
//   findPaymentTransactionByReference,
// } = require("./payment-transaction.service");


class WebhookService {
  /**
   * Process Monnify webhook
   */
  async processWebhook(req) {
    /**
     * ----------------------------------------------------------------
     * Verify webhook signature
     * ----------------------------------------------------------------
     */
    const signature = req.headers["monnify-signature"];

    const rawBody =
      typeof req.body === "string" ? req.body : JSON.stringify(req.body);

    const isValidSignature = monnifyService.verifyWebhookSignature(
      signature,
      rawBody,
    );

    if (!isValidSignature) {
      throw new AppError("Invalid webhook signature.", 401);
    }

    /**
     * ----------------------------------------------------------------
     * Extract webhook payload
     * ----------------------------------------------------------------
     */

    const eventData = req.body.eventData;

    if (!eventData) {
      throw new AppError("Invalid webhook payload.", 400);
    }

    const { paymentReference, transactionReference } = eventData;

    if (!paymentReference || !transactionReference) {
      throw new AppError("Payment reference is missing.", 400);
    }

    /**
     * ----------------------------------------------------------------
     * Verify payment directly with Monnify
     *
     * Never trust webhook payload.
     * ----------------------------------------------------------------
     */

    const verifiedTransaction =
      await paymentVerificationService.verifyTransaction(transactionReference);

    /**
     * ----------------------------------------------------------------
     * Only successful payments should continue.
     * ----------------------------------------------------------------
     */

    if (verifiedTransaction.paymentStatus !== "PAID") {
      return;
    }

    /**
     * ----------------------------------------------------------------
     * Begin MySQL transaction
     * ----------------------------------------------------------------
     */

    const connection = await dbConnection.getConnection();

    try {
      await connection.query("SET TRANSACTION ISOLATION LEVEL REPEATABLE READ");

      await connection.beginTransaction();

      /**
       * ----------------------------------------------------------------
       * Lock payment row
       * ----------------------------------------------------------------
       */

      const payment = await findPaymentTransactionByReference(
        paymentReference,
        true,
        connection,
      );
      /**
       * ------------------------------------------------------------
       * Idempotency Check
       * ------------------------------------------------------------
       *
       * Monnify may resend the same webhook.
       * If we've already credited this payment,
       * do nothing.
       */
      if (payment.wallet_credited) {
        await connection.commit();
        return;
      }

      /**
       * ------------------------------------------------------------
       * Validate payment amount
       * ------------------------------------------------------------
       */

      if (Number(verifiedTransaction.amountPaid) !== Number(payment.amount)) {
        throw new AppError("Payment amount mismatch.", 400);
      }

      /**
       * ------------------------------------------------------------
       * Validate payment reference
       * ------------------------------------------------------------
       */

      if (verifiedTransaction.paymentReference !== payment.payment_reference) {
        throw new AppError("Payment reference mismatch.", 400);
      }

      /**
       * ------------------------------------------------------------
       * Credit user's wallet
       * ------------------------------------------------------------
       */
      await creditWallet(
        {
          userId: payment.user_id,
          amount: verifiedTransaction.amountPaid,
          referenceId: payment.payment_reference,
          description: "Wallet funding via Monnify",
          transactionType: "credit",
        },
        connection,
      );

      /**
       * ------------------------------------------------------------
       * Update payment transaction
       * ------------------------------------------------------------
       */

      await updatePaymentTransaction(
        payment.payment_reference,
        {
          transactionReference: verifiedTransaction.transactionReference,

          paymentMethod: verifiedTransaction.paymentMethod,

          status: "SUCCESS",

          responseBody: JSON.stringify(verifiedTransaction.rawResponse),

          failureReason: null,

          walletCredited: true,

          creditedAt: new Date(),
        },
        connection,
      );
      /**
       * ------------------------------------------------------------
       * Commit transaction
       * ------------------------------------------------------------
       */

      await connection.commit();

      return payment;
    } catch (error) {
      /**
       * ------------------------------------------------------------
       * Rollback on failure
       * ------------------------------------------------------------
       */

      await connection.rollback();

      throw error;
    } finally {
      /**
       * ------------------------------------------------------------
       * Always release connection
       * ------------------------------------------------------------
       */

      connection.release();
    }
  }
}

module.exports = new WebhookService();