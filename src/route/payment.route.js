const express = require("express");

const router = express.Router();

const paymentController = require("../controller/payment.controller");

const authenticate = require("../middlewares/auth.middleware");

// Initialize payment
router.post("/initialize", authenticate, paymentController.initializePayment);

// Manual verification
router.get(
  "/verify/:transactionReference",
  authenticate,
  paymentController.verifyPayment,
);

// Monnify webhook
router.post("/webhook/monnify", paymentController.handleWebhook);

module.exports = router;
