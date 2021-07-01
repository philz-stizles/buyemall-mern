const CustomError = require('./custom-error');

class NotFoundError extends CustomError {
  constructor(message) {
    super(message);

    this.statusCode = 404;
    this.message = message;

    // Because we are extending a built-in class
    Object.setPrototypeOf(this, NotFoundError.prototype);
  }

  serializeErrors() {
    return [{ message: this.message }];
  }
}

module.exports = NotFoundError;
