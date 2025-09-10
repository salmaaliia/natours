class AppError extends Error {
  constructor(message, statusCode) {
    super(message);

    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'eror';
    this.isOperational = true;

    // When creating the stack trace for this error (this), don’t start at the constructor function (this.constructor). Start at the place in my code where the error was actually created.
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;
