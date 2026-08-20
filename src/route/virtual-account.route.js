const express = require("express");

const authenticate = require("../middlewares/auth.middleware");

const {
  getVirtualAccount,
} = require("../controller/virtual-account.controller");

const router = express.Router();

router.get("/", authenticate, getVirtualAccount);

module.exports = router;

