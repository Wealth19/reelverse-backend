const express = require("express");

const watchHistoryRoute = express.Router();

const protect = require("../middlewares/auth.middleware");

const { watchMovie } = require("../controller/watch-history.controller");

watchHistoryRoute.post("/:id", protect, watchMovie);

module.exports = watchHistoryRoute;
