const catchAsync = require("../utils/catchAsync");

const virtualAccountService = require("../services/virtual-account/virtual-account.service");

// GET USER VIRTUAL ACCOUNT

const getVirtualAccount = catchAsync(async (req, res) => {
  const account = await virtualAccountService.getUserVirtualAccount(
    req.user.id,
  );

  res.status(200).json({
    status: "success",

    data: {
      account,
    },
  });
});

module.exports = {
  getVirtualAccount,
};
