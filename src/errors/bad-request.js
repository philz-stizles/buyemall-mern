const CustomError = require('./custom-error');

class BadRequestError extends CustomError {
  constructor(message, error) {
    super(message);

    this.statusCode = 400;
    this.error = error;

    // Because we are extending a built-in class
    Object.setPrototypeOf(this, BadRequestError.prototype);
  }
}

module.exports = BadRequestError;
