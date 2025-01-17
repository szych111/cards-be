class NotFoundError {
  constructor(message) {
    this.message = message;
    this.status = 404;
  }
}

class NotAuthError {
  constructor(message) {
    this.message = message;
    this.status = 401;
  }
}

class HttpError extends Error {
  constructor(message, errorCode) {
    super(message);
    this.code = errorCode;
  }
}

exports.NotFoundError = NotFoundError;
exports.NotAuthError = NotAuthError;
exports.HttpError = HttpError;
