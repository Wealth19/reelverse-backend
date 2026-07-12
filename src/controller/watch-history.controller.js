const db = require("../configuration/db");
const catchAsync = require("../utils/catchAsync");

const watchMovie = catchAsync(async (req, res) => {
  const userId = req.user.id;

  const movieId = req.params.id;

  await db.query(
  `
    INSERT INTO watch_history
    (user_id,movie_id)

    VALUES(?,?)

  `,
    [userId, movieId],
  );

  res.json({
    message: "Watch history saved",
  });
});


module.exports = {
  watchMovie,
};