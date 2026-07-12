const AppError = require("./AppError");

const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}.`;
  return new AppError(message, 400);
};

// const handleDuplicateFieldsDB = (err) => {
//   const value = err.message.match(/{(.*?)}/i)[0];

//   const msg = `${value.split(" ")[1]}`;
//   const response = msg.substring(0, msg.length - 1);

//   const message = `This ${response} has been taken.`;
//   return new AppError(message, 400);
// };

const handleDuplicateFieldsDB = (err) => {
  console.log("HANDLE DUPLICATE ERROR");
  console.log(err);
  // MySQL duplicate entry message format:
  // "Duplicate entry 'opeyemi@gmail.com' for key 'reg.email'"

  let field = "field";

  if (err.message) {
    const match = err.message.match(/for key '(.+)'/);
    if (match) {
      field = match[1];
    }
  }

  return new AppError(
    `This ${field} is already taken. Please use another value.`,
    400,
  );
};

// const handleDuplicateFieldsDB = (err) =>
//   new AppError("Duplicate value found. Please choose another.", 400);

const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);

  const message = `Invalid input data. ${errors.join(". ")}`;
  return new AppError(message, 400);
};

const handleJWTError = () =>
  new AppError("Unauthorised user, please log in", 401);

const handleJWTExpiredError = () =>
  new AppError("Session expired, please login again", 401);

const handleNetworkError = () => new AppError("Network error", 400);

const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

const sendErrorProd = (err, res) => {
  console.log(err.isOperational);

  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    console.error("Error: ", err);

    res.status(500).json({
      status: "error",
      message: "Something went wrong",
    });
  }
};

const globalErrorHandler = (err, req, res, next) => {
  console.log("GLOBAL ERROR HANDLER");
  console.log(err);

  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if (process.env.APP_ENV.toUpperCase() === "DEVELOPMENT") {
    sendErrorDev(err, res);
  } else if (process.env.APP_ENV.toUpperCase() === "PRODUCTION") {
    let error = { ...err };

    if (error.name === "CastError") error = handleCastErrorDB(err);
    if (error.code === "ER_DUP_ENTRY") error = handleDuplicateFieldsDB(err);
    if (error.name === "ValidationError") error = handleValidationErrorDB(err);
    if (error.name === "JsonWebTokenError") error = handleJWTError();
    if (error.name === "TokenExpiredError") error = handleJWTExpiredError();
    if (error.code === "ENOTFOUND") error = handleNetworkError();

    sendErrorProd(error, res);
  } else {
    return res.status(500).json({
      message: "Invalid request",
    });
  }
};

module.exports = { globalErrorHandler };
