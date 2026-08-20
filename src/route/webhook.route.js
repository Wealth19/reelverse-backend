const express = require("express");

const router = express.Router();

const webhookController = require("../controller/webhook.controller");

router.post("/monnify", webhookController.handleMonnifyWebhook);

module.exports = router;