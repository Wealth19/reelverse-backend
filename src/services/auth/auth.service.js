// const db = require("../../configuration/db");
// const bcrypt = require("bcryptjs");
// const AppError = require("../../utils/AppError");

// const { createWallet } = require("../wallet/wallet.service");

// const virtualAccountService = require("../virtual-account/virtual-account.service");

// // REGISTER USER

// const registerUser = async (payload) => {
//   const { name, email, password } = payload;

//   const [[existingUser]] = await db.query(
//     `
//       SELECT id
//       FROM users
//       WHERE email = ?
//     `,
//     [email],
//   );

//   if (existingUser) {
//     throw new AppError("Email already exists", 409);
//   }

//   const hashedPassword = await bcrypt.hash(password, 10);

//   const connection = await db.getConnection();

//   try {
//     await connection.beginTransaction();

//     // CREATE USER

//     const [result] = await connection.query(
//       `
//         INSERT INTO users
//         (
//           name,
//           email,
//           password,
//           role
//         )

//         VALUES (?, ?, ?, ?)
//       `,
//       [name, email, hashedPassword, "customer"],
//     );

//     const userId = result.insertId;

//     // CREATE WALLET

//     await createWallet(
//       {
//         userId,
//         balance: 0,
//       },
//       connection,
//     );

//     // FETCH USER

//     const [[user]] = await connection.query(
//       `
//         SELECT
//           id,
//           name,
//           email,
//           role

//         FROM users

//         WHERE id = ?
//       `,
//       [userId],
//     );

//     // CREATE MONNIFY VIRTUAL ACCOUNT

//     await virtualAccountService.createUserVirtualAccount(user, connection);

//     await connection.commit();

//     return user;
//   } catch (error) {
//     await connection.rollback();

//     throw error;
//   } finally {
//     connection.release();
//   }
// };

// // LOGIN USER

// const loginUser = async (email, password) => {
//   const [[user]] = await db.query(
//     `
//       SELECT *
//       FROM users
//       WHERE email = ?
//     `,
//     [email],
//   );

//   if (!user) {
//     throw new AppError("Invalid email or password", 401);
//   }

//   const match = await bcrypt.compare(password, user.password);

//   if (!match) {
//     throw new AppError("Invalid email or password", 401);
//   }

//   return user;
// };

// module.exports = {
//   registerUser,
//   loginUser,
// };
const db = require("../../configuration/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const AppError = require("../../utils/AppError");

const { createWallet } = require("../wallet/wallet.service");

const virtualAccountService = require("../virtual-account/virtual-account.service");

// ============================================================
// REGISTER USER
// ============================================================

const registerUser = async (payload) => {
  const { name, email, password } = payload;

  const [[existingUser]] = await db.query(
    `
      SELECT id
      FROM users
      WHERE email = ?
    `,
    [email],
  );

  if (existingUser) {
    throw new AppError("Email already exists", 409);
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();

    // CREATE USER

    const [result] = await connection.query(
      `
        INSERT INTO users
        (
          name,
          email,
          password,
          role
        )
        VALUES (?, ?, ?, ?)
      `,
      [name, email, hashedPassword, "customer"],
    );

    const userId = result.insertId;

    // CREATE WALLET

    await createWallet(
      {
        userId,
        balance: 0,
      },
      connection,
    );

    // FETCH USER

    const [[user]] = await connection.query(
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

    // CREATE MONNIFY VIRTUAL ACCOUNT

    await virtualAccountService.createUserVirtualAccount(user, connection);

    await connection.commit();

    return user;
  } catch (error) {
    await connection.rollback();

    throw error;
  } finally {
    connection.release();
  }
};

// ============================================================
// LOGIN USER
// ============================================================

const loginUser = async (email, password) => {
  const [[user]] = await db.query(
    `
      SELECT
        id,
        name,
        email,
        password,
        role
      FROM users
      WHERE email = ?
    `,
    [email],
  );

  if (!user) {
    throw new AppError("Invalid email or password", 401);
  }

  const passwordMatches = await bcrypt.compare(password, user.password);

  if (!passwordMatches) {
    throw new AppError("Invalid email or password", 401);
  }

  return user;
};

// ============================================================
// REFRESH AUTHENTICATION TOKEN
// ============================================================

const refreshAuthToken = async (refreshToken) => {
  if (!refreshToken) {
    throw new AppError("Refresh token is required. Please login again.", 401);
  }

  let decoded;

  try {
    decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      throw new AppError("Refresh token expired. Please login again.", 401);
    }

    if (error.name === "JsonWebTokenError") {
      throw new AppError("Invalid refresh token. Please login again.", 401);
    }

    throw error;
  }

  const [[user]] = await db.query(
    `
      SELECT
        id,
        name,
        email,
        role
      FROM users
      WHERE id = ?
    `,
    [decoded.id],
  );

  if (!user) {
    throw new AppError("User no longer exists. Please login again.", 401);
  }

  return user;
};

module.exports = {
  registerUser,
  loginUser,
  refreshAuthToken,
};
