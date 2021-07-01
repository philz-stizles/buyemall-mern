exports.errorName = {
  NOTFOUND: 'NOTFOUND',
};

const errorTypes = {
  NOTFOUND: { message: 'Requested record not found', statusCode: 404 },
};

exports.getErrorCode = name => {
  const errorType = errorTypes[name];
  return errorType;
};

const formatError = err => {
  return err;
};

module.exports = formatError;
