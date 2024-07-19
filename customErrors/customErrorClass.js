class ApplicationError extends Error {
  constructor(message, status) {
    super();
    Error.captureStackTrace(this, this.constructor);
    this.statusCode = status || 500;
    this.name = this.constructor.name;
    this.message = message || "Something went Wrong";
  }
}

class notFoundError extends ApplicationError {
  constructor(message) {
    super(message || "Resource not found", 404);
  }
}

class ownerShipError extends ApplicationError {
  constructor(message) {
    super(message || "Ownership not belongs to currentUser", 403);
  }
}

class incorrectPasswordError extends ApplicationError {
  constructor(message) {
    super(message || "Incorrect Password", 401);
  }
}

module.exports = {
  ApplicationError,
  notFoundError,
  ownerShipError,
  incorrectPasswordError,
};
