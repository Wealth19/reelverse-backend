const dbConnection = require("../configuration/db");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/AppError");
const bcrypt = require("bcryptjs");

// GET MY PROFILE
const getMyProfile = catchAsync(async (req, res) => {
  const userId = req.user.id;

  const [[user]] = await dbConnection.query(
    `
    SELECT 
      id,
      name,
      email,
      role,
      created_at

    FROM users

    WHERE id=?
    `,
    [userId],
  );

  if (!user) {
    throw new AppError("User not found", 404);
  }

  res.status(200).json({
    status: "success",
    data: user,
  });
});

// UPDATE PROFILE
const updateProfile = catchAsync(async (req, res) => {
  const userId = req.user.id;

  const { name, email, password } = req.body;

  const [[existingUser]] = await dbConnection.query(
    `SELECT * FROM users WHERE id=?`,
    [userId],
  );

  if (!existingUser) {
    throw new AppError("User not found", 404);
  }

  let hashedPassword = existingUser.password;

  if (password) {
    hashedPassword = await bcrypt.hash(password, 10);
  }

  existingUser.name = name ?? existingUser.name;
  existingUser.email = email ?? existingUser.email;
  existingUser.hashedPassword = hashedPassword ?? existingUser.hashedPassword;

  const sql =
    "UPDATE users SET name = ?, email = ?, password = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?";

  const [result] = await dbConnection.query(sql, [
    existingUser.name,
    existingUser.email,
    existingUser.hashedPassword,
    id,
  ]);

  res.status(200).json({
    status: "success",
    message: "Profile updated successfully",
    data: existingUser,
  });
});

// DELETE ACCOUNT (SELF DELETE)
const deleteMyAccount = catchAsync(async (req, res) => {
  const userId = req.user.id;

  const [result] = await dbConnection.query(
    `
    DELETE FROM users
    WHERE id=?
    `,
    [userId],
  );

  if (result.affectedRows === 0) {
    throw new AppError("User not found", 404);
  }

  res.status(204).send();
});



// FIND ALL USERS
const findAll = catchAsync(async (req, res) => {
  const [usersRecord] = await dbConnection.query(
    "SELECT id, name, email, role, created_at, updated_at FROM users",
  );
  res.status(200).json({
    status: "success",

    count: usersRecord.length,

    data: usersRecord,
  });
});

module.exports = {
  getMyProfile,
  updateProfile,
  deleteMyAccount,
  findAll,
};
