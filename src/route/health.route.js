const express = require("express");

const { getHealth } = require("../controller/health.controller");

const healthRoute = express.Router();

healthRoute.get("/", getHealth);

module.exports = healthRoute;
