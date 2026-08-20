const catchAsync = require("../utils/catchAsync");
const webhookService = require("../services/payment/webhook.service");

class WebhookController {
  handleMonnifyWebhook = catchAsync(async (req, res) => {
    await webhookService.processWebhook(req);

    return res.status(200).json({
      status: "success",
      message: "Webhook processed successfully.",
    });
  });
}

module.exports = new WebhookController();
