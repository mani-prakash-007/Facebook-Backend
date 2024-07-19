class ApplicationError extends Error {
  constructor(message, status) {
    super();
    Error.captureStackTrace(this, this.constructor);
    this.statusCode = status || 500;
    this.name = this.constructor.name;
    this.message = message || "Something went Wrong";
  }
}

class NotFoundError extends ApplicationError {
  constructor(message) {
    super(message || "Resource not found", 404);
  }
}

class OwnerShipError extends ApplicationError {
  constructor(message) {
    super(message || "Ownership not belongs to currentUser", 403);
  }
}

class IncorrectPasswordError extends ApplicationError {
  constructor(message) {
    super(message || "Incorrect Password", 401);
  }
}

class EmailAlreadyExistsError extends ApplicationError {
  constructor(message) {
    super(message || "Email Already Exist", 409);
  }
}

class UnauthorizedError extends ApplicationError {
  constructor(message) {
    super(message || "Unauthorized access", 401);
  }
}

module.exports = {
  ApplicationError,
  NotFoundError,
  OwnerShipError,
  IncorrectPasswordError,
  EmailAlreadyExistsError,
  UnauthorizedError,
};
