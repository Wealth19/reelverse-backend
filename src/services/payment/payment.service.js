const { randomUUID } = require("crypto");

const AppError = require("../../utils/AppError");

const monnifyService = require("../../third-party/monnify/monnify.service");

const {
  createPaymentTransaction,
  updatePaymentTransaction,
} = require("./payment-transaction.service");

class PaymentService {
  /**
   * Initialize wallet funding payment
   */
  async initializePayment(user, payload) {
    const amount = Number(payload.amount);

    if (Number.isNaN(amount) || amount <= 0) {
      throw new AppError("Invalid payment amount.", 400);
    }

    const paymentReference = `WALLET_${randomUUID()}`;

    // =================================
    // CREATE PENDING PAYMENT RECORD
    // =================================

    await createPaymentTransaction({
      userId: user.id,

      provider: "MONNIFY",

      paymentReference,

      amount,

      currency: "NGN",

      paymentDescription: "Wallet Funding",

      status: "PENDING",
    });

    try {
      const payment = await monnifyService.initializeTransaction({
        amount,

        paymentReference,

        customerName: user.name,

        customerEmail: user.email,

        paymentDescription: "Wallet Funding",
      });

      await updatePaymentTransaction(
        paymentReference,

        {
          transactionReference: payment.transactionReference,

          paymentMethod: null,

          status: "PENDING",

          responseBody: JSON.stringify(payment.responseBody),

          failureReason: null,

          walletCredited: false,

          creditedAt: null,
        },
      );

      return {
        paymentReference,

        transactionReference: payment.transactionReference,

        checkoutUrl: payment.checkoutUrl,
      };
    } catch (error) {
      await updatePaymentTransaction(
        paymentReference,

        {
          status: "FAILED",

          failureReason: error.message,

          responseBody: JSON.stringify(error.response?.data || {}),
        },
      );

      throw error;
    }
  }
}

module.exports = new PaymentService();
