const dbConnection = require("../configuration/db");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/AppError");


// CREATE MOVIE

const createMovie = catchAsync(async (req, res) => {
  const { title, rental_price, purchase_price } = req.body;

  // producer from JWT

  const producer_id = req.user.id;

  const [[existingMovie]] = await dbConnection.query(
    `
    SELECT id 
    FROM movies
    WHERE title=?

  `,
    [title],
  );

  if (existingMovie) {
    throw new AppError("Movie already exists", 400);
  }

  const [result] = await dbConnection.query(
   `
    INSERT INTO movies
    (title,rental_price,purchase_price,producer_id)

    VALUES(?,?,?,?)
  `,
    [title, rental_price, purchase_price, producer_id],
  );

  const [[movie]] = await dbConnection.query(
  `
    SELECT
    id,
    title,
    rental_price,
    purchase_price,
    producer_id

    FROM movies

    WHERE id=?

  `,
    [result.insertId],
  );

  res.status(201).json({
    status: "success",

    message: "Movie created successfully",

    data: movie,
  });
});



// Get a single Movie
const getMovie = catchAsync(async (req, res) => {
  const { id } = req.params;

  const [[movie]] = await dbConnection.query(
  `
    SELECT
    movies.id,
    movies.title,
    movies.description,
    movies.rental_price,
    movies.purchase_price,

    users.name AS producer

    FROM movies

    JOIN users
    ON movies.producer_id = users.id

    WHERE movies.id=?

  `,
    [id],
  );

  if (!movie) {
    throw new AppError("Movie not found", 404);
  }

  res.status(200).json({
    status: "success",

    data: movie,
  });
});


// Delete a movie

const deleteMovie = catchAsync(async (req, res) => {
  const movieId = req.params.id;

  const producerId = req.user.id;

  const [[movie]] = await dbConnection.query(
  `
    SELECT id 
    FROM movies
    WHERE id=? 
    AND producer_id=?

  `,
    [movieId, producerId],
  );

  // Check if the movie is there or not
  if (!movie) {
    throw new AppError("Movie not found or you don't own this movie", 403);
  }

  // deleteing movie
  await dbConnection.query(
  `
    DELETE FROM movies
    WHERE id=?

  `,
    [movieId],
  );

  res.status(200).json({
    status: "success",

    message: "Movie deleted successfully",
  });
});


module.exports = {
  createMovie,
  getMovie,
  deleteMovie
}