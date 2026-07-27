class ApiError extends Error {
  constructor(
    statusCode = 500,
    message = "Server Error",
    errors = null
  ) {
    super(message);

    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.success = false;
    this.errors = errors;

    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = ApiError;