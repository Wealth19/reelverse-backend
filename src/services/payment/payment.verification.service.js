const AppError = require("../../utils/AppError");

const monnifyService = require("../../third-party/monnify/monnify.service");

class PaymentVerificationService {
  /**
   * Verify payment with Monnify
   *
   * @param {String} transactionReference
   * @returns {Object}
   */
  async verifyTransaction(transactionReference) {
    if (!transactionReference) {
      throw new AppError("Transaction reference is required.", 400);
    }

    const response =
      await monnifyService.verifyTransaction(transactionReference);

    if (!response) {
      throw new AppError("Unable to verify transaction.", 400);
    }

    return response;
  }
}

module.exports = new PaymentVerificationService();
