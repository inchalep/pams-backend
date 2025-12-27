module.exports = (schema) => async (req, res, next) => {
  try {
    req.body = await schema.validate(req.body, { abortEarly: false });
    next();
  } catch (err) {
    res.status(400).json({
      errors: err.errors,
    });
  }
};
