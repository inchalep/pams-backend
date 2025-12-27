const errorLogger = (err, req, res, next) => {
  console.error("🔥 ERROR LOG");
  console.error("Time:", new Date().toISOString());
  console.error("Method:", req.method);
  console.error("URL:", req.originalUrl);
  console.error("Message:", err.message);
  console.error("Stack:", err.stack);

  next(err);
};

module.exports = errorLogger;
