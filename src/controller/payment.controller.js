const catchAsync = require("../utils/catchAsync");
const paymentService = require("../services/payment/payment.service");
const paymentVerificationService = require("../services/payment/payment.verification.service");
const webhookService = require("../services/payment/webhook.service");


class PaymentController {
  initializePayment = catchAsync(async (req, res) => {
    const payment = await paymentService.initializePayment(req.user, req.body);

    res.status(201).json({
      success: true,
      message: "Payment initialized successfully.",
      data: payment,
    });
  });

  verifyPayment = catchAsync(async (req, res) => {
    const payment = await paymentVerificationService.verifyTransaction(
      req.params.transactionReference,
    );

    res.status(200).json({
      success: true,
      data: payment,
    });
  });

  handleWebhook = catchAsync(async (req, res) => {
    await webhookService.processWebhook(req);

    res.status(200).json({
      success: true,
    });
  });
}

module.exports = new PaymentController();