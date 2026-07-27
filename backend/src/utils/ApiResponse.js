class ApiResponse {
  static success(
    res,
    data = null,
    message = "Success",
    statusCode = 200,
    meta = null
  ) {
    return res.status(statusCode).json({
      success: true,
      message,
      data,
      meta,
      timestamp: new Date().toISOString(),
    });
  }

  static error(
    res,
    message = "Something went wrong.",
    statusCode = 500,
    errors = null
  ) {
    return res.status(statusCode).json({
      success: false,
      message,
      errors,
      timestamp: new Date().toISOString(),
    });
  }
}

module.exports = ApiResponse;