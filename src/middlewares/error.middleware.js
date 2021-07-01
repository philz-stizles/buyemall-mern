exports.NotFoundHandler = (_req, res) => {
  const message = 'Resource not found';

  return res.status(404).send(message);
};

// eslint-disable-next-line no-unused-vars
exports.errorHandler = (err, req, res, next) => {
  console.error(err.statusCode);
  const transformedError = err;
  transformedError.statusCode = err.statusCode || 500;
  transformedError.message = err.message || 'Please try again later';
  res
    .status(transformedError.statusCode)
    .json({ status: false, message: transformedError.message });
};
