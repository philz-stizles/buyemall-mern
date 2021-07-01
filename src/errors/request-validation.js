const CustomError = require('./custom-error');

class RequestValidationError extends CustomError {
  constructor(errors) {
    super('Invalid request parameters');

    this.statusCode = 400;
    this.errors = errors;

    // Because we are extending a built-in class
    Object.setPrototypeOf(this, RequestValidationError.prototype);
  }

  serializeErrors() {
    return this.errors.map(err => {
      return { message: err };
    });
  }
}

module.exports = RequestValidationError;
