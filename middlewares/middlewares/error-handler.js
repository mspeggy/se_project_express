module.exports = (err, req, res, next) => {
  console.error(err);

  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
};

const errorHandler = require('./middlewares/error-handler');

// ... all other app.use() statements and routes

app.use(errorHandler);