// const catchAsync = require("../utils/catchAsync");
// const {
//   findOne,
//   updateProfile,
//   changePassword,
//   deleteUser,
//   findAll,
// } = require("../services/user/user.service");

// // GET PROFILE
// const getMyProfile = catchAsync(async (req, res) => {
//   const user = await findOne({
//     id: req.user.id,
//   });

//   res.status(200).json({
//     status: "success",
//     data: user,
//   });
// });

// // UPDATE PROFILE
// const updateMyProfile = catchAsync(async (req, res) => {
//   const user = await updateProfile(req.user.id, req.body);

//   res.status(200).json({
//     status: "success",
//     message: "Profile updated successfully",
//     data: user,
//   });
// });

// // CHANGE PASSWORD
// const updatePassword = catchAsync(async (req, res) => {
//   await changePassword(req.user.id, req.body);

//   res.status(200).json({
//     status: "success",
//     message: "Password changed successfully",
//   });
// });

// // DELETE ACCOUNT
// const deleteMyAccount = catchAsync(async (req, res) => {
//   await deleteUser(req.user.id);

//   res.status(204).send();
// });

// // FIND ALL USERS
// const getAllUsers = catchAsync(async (req, res) => {
//   const users = await findAll();

//   res.status(200).json({
//     status: "success",
//     count: users.length,
//     data: users,
//   });
// });

// module.exports = {
//   getMyProfile,
//   updateMyProfile,
//   updatePassword,
//   deleteMyAccount,
//   getAllUsers,
// };
const catchAsync = require("../utils/catchAsync");

const {
  findOne,
  updateProfile,
  changePassword,
  deleteUser,
  findAll,
} = require("../services/user/user.service");

// GET PROFILE
const getMyProfile = catchAsync(async (req, res) => {
  const user = await findOne({
    id: req.user.id,
  });

  res.status(200).json({
    status: "success",
    data: user,
  });
});

// UPDATE PROFILE
const updateMyProfile = catchAsync(async (req, res) => {
  const user = await updateProfile(req.user.id, req.body);

  res.status(200).json({
    status: "success",
    message: "Profile updated successfully",
    data: user,
  });
});

// CHANGE PASSWORD
const updatePassword = catchAsync(async (req, res) => {
  await changePassword(req.user.id, req.body);

  res.status(200).json({
    status: "success",
    message: "Password changed successfully",
  });
});

// DELETE ACCOUNT
const deleteMyAccount = catchAsync(async (req, res) => {
  await deleteUser(req.user.id);

  res.status(204).send();
});

// FIND ALL USERS
const getAllUsers = catchAsync(async (req, res) => {
  const users = await findAll();

  res.status(200).json({
    status: "success",
    count: users.length,
    data: users,
  });
});

module.exports = {
  getMyProfile,
  updateMyProfile,
  updatePassword,
  deleteMyAccount,
  getAllUsers,
};