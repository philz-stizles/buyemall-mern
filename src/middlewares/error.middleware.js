const CustomError = require('../errors/custom-error');

exports.NotFoundHandler = (_req, res) => {
  const message = 'Resource not found';

  return res.status(404).send(message);
};

// eslint-disable-next-line no-unused-vars
exports.errorHandler = (err, req, res, next) => {
  console.log(err.message);
  if (err instanceof CustomError) {
    return res
      .status(err.statusCode)
      .json({ status: false, errors: err.serializeErrors() });
  }

  return res.status(500).json({
    status: false,
    errors: [{ message: 'Please try again later' }],
  });
};
