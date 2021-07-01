const CustomError = require('./custom-error');

class UnAuthorizedError extends CustomError {
  constructor(message) {
    super(message);

    this.statusCode = 401;
    this.message = message;

    // Because we are extending a built-in class
    Object.setPrototypeOf(this, UnAuthorizedError.prototype);
  }

  serializeErrors() {
    return [{ message: this.message }];
  }
}

module.exports = UnAuthorizedError;
