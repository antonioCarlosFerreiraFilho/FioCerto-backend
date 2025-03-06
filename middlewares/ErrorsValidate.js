const { validationResult } = require("express-validator");

const ErrorsValidate = async (req, res, next) => {
  const errors = validationResult(req);

  if (errors.isEmpty()) {
    return next();
  }

  const extractErrors = [];

  errors.array().map((err) => extractErrors.push(err.msg));

  return res.status(422).json({
    errors: extractErrors,
  });
};

module.exports = ErrorsValidate;
