module.exports = {
  paymentService: require("./payment.service"),
  paymentVerificationService: require("./payment-verification.service"),

  ...require("./payment-transaction.service"),
};
