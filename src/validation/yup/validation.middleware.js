const RequestValidationError = require('../../errors/request-validation');
const logger = require('../../loggers/logger');

const validationRequest = schema => async (req, res, next) => {
  try {
    await schema.validate({
      body: req.body,
      query: req.query,
      params: req.params,
    });

    return next();
  } catch (e) {
    logger.error('YUP VALIDATION MIDDLEWARE', e.message, e);
    return next(new RequestValidationError(e.errors));
  }
};

module.exports = validationRequest;
