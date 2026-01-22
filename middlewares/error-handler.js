module.exports = (err, req, res, _next) => {
  console.error(err);

  const { statusCode = 500, message } = err;

  res.status(statusCode).json({
    success: false,
    message: statusCode === 500 ? "An error has occurred on the server" : message,
  });
};
