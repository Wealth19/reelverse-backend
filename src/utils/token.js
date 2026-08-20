// const jwt = require("jsonwebtoken");

// // GENERATE ACCESS TOKEN

// const generateToken = (id, email, role) => {
//   return jwt.sign(
//     {
//       id,
//       email,
//       role,
//     },
//     process.env.JWT_SECRET,
//     {
//       expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRES_IN,
//     },
//   );
// };

// // GENERATE REFRESH TOKEN

// const generateRefreshToken = (id, email, role) => {
//   return jwt.sign(
//     {
//       id,
//       email,
//       role,
//     },
//     process.env.JWT_REFRESH_SECRET,
//     {
//       expiresIn: process.env.JWT_REFRESH_TOKEN_EXPIRES_IN,
//     },
//   );
// };

// module.exports = {
//   generateToken,
//   generateRefreshToken,
// };

const jwt = require("jsonwebtoken");

// GENERATE ACCESS TOKEN

const generateToken = (id, email, role) => {
  return jwt.sign(
    {
      id,
      email,
      role,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRES_IN,
    },
  );
};

// GENERATE REFRESH TOKEN

const generateRefreshToken = (id, email, role) => {
  return jwt.sign(
    {
      id,
      email,
      role,
    },
    process.env.JWT_REFRESH_SECRET,
    {
      expiresIn: process.env.JWT_REFRESH_TOKEN_EXPIRES_IN,
    },
  );
};

module.exports = {
  generateToken,
  generateRefreshToken,
};
