const globalErrorHandler = (error, req, res, next) => {
  const statusCode = error.statusCode || 500;
  const name = error.name;
  const message = error.message || "Something went wrong";

  res
    .status(statusCode)
    .json({ StatusCode: statusCode, ErrorName: name, ErrorMessage: message });
};

module.exports = { globalErrorHandler };
