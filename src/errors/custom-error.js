class CustomError extends Error {
  constructor(message) {
    super(message);

    // Because we are extending a built-in class
    Object.setPrototypeOf(this, CustomError.prototype);
  }
}

module.exports = CustomError;
