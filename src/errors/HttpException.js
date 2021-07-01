import CustomError from './custom-error';

class HttpException extends CustomError {
  constructor(statusCode, message, error) {
    super(message);
    this.statusCode = statusCode;
    this.message = message;
    this.error = error || null;
  }
}

module.exports = HttpException;
