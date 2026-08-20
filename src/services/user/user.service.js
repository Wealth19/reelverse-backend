// const dbConnection = require("../../configuration/db");
// const AppError = require("../../utils/AppError");
// const bcrypt = require("bcryptjs");

// // FIND USER BY ID
// const findOne = async (queryObject) => {
//   const [[user]] = await dbConnection.query(
//     `
//       SELECT
//       id,
//       name,
//       email,
//       role,
//       created_at

//       FROM users
//       WHERE id = ?
//     `,
//     [queryObject.id]
//   )

//   return user;
// };

// // UPDATE PROFILE
// const updateProfile = async (userId, payload) => {
//   const { name, email, password } = payload;

//   const [[existingUser]] = await dbConnection.query(
//     `
//       SELECT *
//       FROM users
//       WHERE id = ?
//     `,
//     [userId],
//   );

//   if (!existingUser) {
//     throw new AppError("User not found", 404);
//   }

//   if (email && email !== existingUser.email) {
//     const [[emailExists]] = await dbConnection.query(
//       `
//         SELECT id
//         FROM users
//         WHERE email = ?
//         AND id != ?
//       `,
//       [email, userId],
//     );

//     if (emailExists) {
//       throw new AppError("Email already exists", 409);
//     }
//   }

//   let hashedPassword = existingUser.password;

//   if (password) {
//     hashedPassword = await bcrypt.hash(password, 10);
//   }

//   await dbConnection.query(
//     `
//       UPDATE users
//       SET
//         name = ?,
//         email = ?,
//         password = ?,
//         updated_at = CURRENT_TIMESTAMP
//       WHERE id = ?
//     `,
//     [
//       name ?? existingUser.name,
//       email ?? existingUser.email,
//       hashedPassword,
//       userId,
//     ],
//   );
//   return await findOne({ id: userId });
// };

// // CHANGE PASSWORD
// const changePassword = async (userId, payload) => {
//   const { currentPassword, newPassword } = payload;

//   const [[user]] = await dbConnection.query(
//     `
//       SELECT id,password
//       FROM users
//       WHERE id=?
//     `,
//     [userId],
//   );

//   if (!user) {
//     throw new AppError("User not found", 404);
//   }

//   const passwordMatch = await bcrypt.compare(currentPassword, user.password);

//   if (!passwordMatch) {
//     throw new AppError("Current password is incorrect", 401);
//   }

//   const samePassword = await bcrypt.compare(newPassword, user.password);

//   if (samePassword) {
//     throw new AppError(
//       "New password must be different from current password",
//       400,
//     );
//   }

//   const hashedPassword = await bcrypt.hash(newPassword, 10);

//   await dbConnection.query(
//     `
//       UPDATE users
//       SET
//         password=?,
//         updated_at=CURRENT_TIMESTAMP
//       WHERE id=?
//     `,
//     [hashedPassword, userId],
//   );
// };

// // DELETE ACCOUNT
// const deleteUser = async (userId) => {
//   const [result] = await dbConnection.query(
//     `
//       DELETE FROM users
//       WHERE id=?
//     `,
//     [userId],
//   );

//   if (result.affectedRows === 0) {
//     throw new AppError("User not found", 404);
//   }
// };

// // FIND ALL USERS
// const findAll = async () => {
//   const [users] = await dbConnection.query(
//     `
//       SELECT
//         id,
//         name,
//         email,
//         role,
//         created_at,
//         updated_at
//       FROM users
//     `,
//   );

//   return users;
// };

// module.exports = {
//   findOne,
//   updateProfile,
//   changePassword,
//   deleteUser,
//   findAll,
// };

const dbConnection = require("../../configuration/db");
const AppError = require("../../utils/AppError");
const bcrypt = require("bcryptjs");

/*
|--------------------------------------------------------------------------
| FIND USER BY ID
|--------------------------------------------------------------------------
*/

const findOne = async (queryObject) => {
  const [[user]] = await dbConnection.query(
    `
      SELECT
        id,
        name,
        email,
        role,
        created_at,
        updated_at

      FROM users

      WHERE id = ?
    `,
    [queryObject.id],
  );

  if (!user) {
    throw new AppError("User not found", 404);
  }

  return user;
};

/*
|--------------------------------------------------------------------------
| UPDATE PROFILE
|--------------------------------------------------------------------------
*/

const updateProfile = async (userId, payload) => {
  const { name, email } = payload;

  const [[existingUser]] = await dbConnection.query(
    `
      SELECT
        id,
        name,
        email,
        role

      FROM users

      WHERE id = ?
    `,
    [userId],
  );

  if (!existingUser) {
    throw new AppError("User not found", 404);
  }

  if (email && email !== existingUser.email) {
    const [[emailExists]] = await dbConnection.query(
      `
        SELECT id
        FROM users
        WHERE email = ?
        AND id != ?
      `,
      [email, userId],
    );

    if (emailExists) {
      throw new AppError("Email already exists", 409);
    }
  }

  await dbConnection.query(
    `
      UPDATE users

      SET
        name = ?,
        email = ?,
        updated_at = CURRENT_TIMESTAMP

      WHERE id = ?
    `,
    [name ?? existingUser.name, email ?? existingUser.email, userId],
  );

  return await findOne({
    id: userId,
  });
};

/*
|--------------------------------------------------------------------------
| CHANGE PASSWORD
|--------------------------------------------------------------------------
*/

const changePassword = async (userId, payload) => {
  const { currentPassword, newPassword } = payload;

  /*
   * Make sure both passwords exist.
   *
   * Joi should already handle this, but keeping this
   * check here protects the service as well.
   */

  if (!currentPassword || !newPassword) {
    throw new AppError("Current password and new password are required", 400);
  }

  /*
   * Get the user's stored password hash.
   */

  const [[user]] = await dbConnection.query(
    `
      SELECT
        id,
        password

      FROM users

      WHERE id = ?
    `,
    [userId],
  );

  if (!user) {
    throw new AppError("User not found", 404);
  }

  /*
   * Make sure the database contains a bcrypt hash.
   *
   * bcrypt hashes normally begin with:
   *
   * $2a$
   * $2b$
   * $2y$
   */

  if (typeof user.password !== "string" || !user.password.startsWith("$2")) {
    throw new AppError(
      "Account password is not stored correctly. Please reset your password.",
      500,
    );
  }

  /*
   * Verify CURRENT password.
   *
   * Do NOT hash currentPassword manually before comparing.
   * bcrypt.compare() performs the correct comparison
   * against the existing bcrypt hash.
   */

  const passwordMatch = await bcrypt.compare(currentPassword, user.password);

  if (!passwordMatch) {
    throw new AppError("Current password is incorrect", 401);
  }

  /*
   * Prevent the user from using the same password again.
   */

  const samePassword = await bcrypt.compare(newPassword, user.password);

  if (samePassword) {
    throw new AppError(
      "New password must be different from current password",
      400,
    );
  }

  /*
   * Hash the NEW password.
   */

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  /*
   * Save the new password.
   */

  await dbConnection.query(
    `
      UPDATE users

      SET
        password = ?,
        updated_at = CURRENT_TIMESTAMP

      WHERE id = ?
    `,
    [hashedPassword, userId],
  );
};

/*
|--------------------------------------------------------------------------
| DELETE USER
|--------------------------------------------------------------------------
*/

const deleteUser = async (userId) => {
  const [result] = await dbConnection.query(
    `
      DELETE FROM users

      WHERE id = ?
    `,
    [userId],
  );

  if (result.affectedRows === 0) {
    throw new AppError("User not found", 404);
  }
};

/*
|--------------------------------------------------------------------------
| FIND ALL USERS
|--------------------------------------------------------------------------
*/

const findAll = async () => {
  const [users] = await dbConnection.query(
    `
      SELECT
        id,
        name,
        email,
        role,
        created_at,
        updated_at

      FROM users
    `,
  );

  return users;
};

module.exports = {
  findOne,
  updateProfile,
  changePassword,
  deleteUser,
  findAll,
};
