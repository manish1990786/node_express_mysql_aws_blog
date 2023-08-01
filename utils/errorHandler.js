module.exports = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.message = err.message || "Error!!";
    res.status(err.statusCode).json({
      status: err.statusCode,
      message: err.message,
    });
};