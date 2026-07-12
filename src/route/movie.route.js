const express = require("express");
const movieRoute = express.Router();

const { createMovieValidation } = require("../dto/movie.validator");
const {
  createMovie,
  getMovie,
  deleteMovie,
} = require("../controller/movie.controller");


const protect = require("../middlewares/auth.middleware");

const role = require("../middlewares/role.middleware");

// everybody can see movies

movieRoute.get("/", getMovie);

// producer only
movieRoute.post(
  "/",
  protect,
  role("producer"),
  createMovieValidation,
  createMovie,
);

movieRoute.delete("/:id", protect, role("producer"), deleteMovie);

module.exports = movieRoute;
