const db = require("../configuration/db");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/AppError");

const purchaseMovie = catchAsync(async (req, res) => {
  const userId = req.user.id;

  const { movie_id, payment_method } = req.body;

  const [[movie]] = await db.query(
    `
    SELECT purchase_price
    FROM movies
    WHERE id=?
  `,
    [movie_id],
  );

  if (!movie) {
    throw new AppError("Movie not found", 404);
  }

  const [[wallet]] = await db.query(
    `
    SELECT balance
    FROM wallet
    WHERE user_id=?
    
  `,
    [userId],
  );

  if (wallet.balance < movie.purchase_price) {
    throw new AppError("Insufficient wallet balance", 400);
  }

  // deduct money

  await db.query(
    `
    UPDATE wallet

    SET balance = balance - ?

    WHERE user_id=?
  `,
    [movie.purchase_price, userId],
  );

  // save purchase

  await db.query(
    `
    INSERT INTO purchases
    (user_id,movie_id,amount,payment_method)

    VALUES(?,?,?,?)
  `,
    [userId, movie_id, movie.purchase_price, payment_method],
  );

  res.json({
    status: "success",

    message: "Movie purchased",
  });
});

module.exports = {
  purchaseMovie,
};
