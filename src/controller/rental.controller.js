const db = require("../configuration/db");
const catchAsync = require("../utils/catchAsync");

const rentMovie = catchAsync(async (req, res) => {
  const userId = req.user.id;

  const { movie_id } = req.body;

  const [[movie]] = await db.query(
  `
    SELECT rental_price
    FROM movies
    WHERE id=?

  `,
    [movie_id],
  );

  const [[wallet]] = await db.query(
  `
    SELECT balance
    FROM wallet
    WHERE user_id=?
  
  `,
    [userId],
  );

  if (wallet.balance < movie.rental_price) {
    return res.status(400).json({
      message: "Insufficient balance",
    });
  }

  await db.query(
  `
    UPDATE wallet
    SET balance=balance-?
    WHERE user_id=?
    
  `,
    [movie.rental_price, userId],
  );

  await db.query(
    `
    INSERT INTO rentals
    (user_id,movie_id)

    VALUES(?,?)
  `,
    [userId, movie_id],
  );

  res.json({
    message: "Movie rented",
  });
});

module.exports = {
  rentMovie,
};
