const jwt = require("jsonwebtoken");
const User = require("../../../models/userSchema");

const {
  NotFoundError,
  UnauthorizedError,
} = require("../../../customErrors/customErrorClass");
const { catchError } = require("../../../utils/catchAsync");
const { Authorization } = require("../../../middleware/AuthMidWare");

jest.mock("jsonwebtoken");
jest.mock("../../../models/userSchema");

describe("Authorization Middleware", () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      headers: {
        authorization: "Bearer validtoken",
      },
    };
    res = {};
    next = jest.fn();
  });

  it("should throw NotFoundError if token is not found in req.header", async () => {
    req.headers.authorization = "";

    // Call the function
    await Authorization(req, res, next);

    // Assertions
    expect(next).toHaveBeenCalledWith(
      new NotFoundError("Token not Found in Header")
    );
  });

  it("should throw UnauthorizedError if token is invalid", async () => {
    // Mocking jwt.verify
    jwt.verify.mockImplementation((token, secret, callback) => {
      callback(new Error("JsonWebTokenError: invalid signature"), null);
    });

    // Call the function
    await Authorization(req, res, next);

    // Assertions
    expect(next).toHaveBeenCalledWith(
      new UnauthorizedError("JsonWebTokenError: invalid signature")
    );
  });

  it("should return req.user if token is valid", async () => {
    const decoded = { id: "userId1" };
    const mockUser = {
      id: "userId1",
      first_name: "Mani",
      last_name: "Prakash",
      email: "mani.prakash@example.com",
    };

    // Mocking jwt.verify
    jwt.verify.mockImplementation((token, secret, callback) => {
      callback(null, decoded);
    });

    // Mocking User.findById to return a user
    User.findById.mockResolvedValue(mockUser);

    // Call the function
    await Authorization(req, res, next);

    // Assertions
    expect(User.findById).toHaveBeenCalledWith(decoded.id);
    expect(req.user).toEqual({
      id: mockUser.id,
      first_name: mockUser.first_name,
      last_name: mockUser.last_name,
      email: mockUser.email,
    });
    expect(next).toHaveBeenCalled();
  });

  it("should throw UnauthorizedError if User is not found", async () => {
    const decoded = { id: "userId1" };

    // Mocking jwt.verify
    jwt.verify.mockImplementation((token, secret, callback) => {
      callback(null, decoded);
    });

    // Mocking User.findById to return null
    User.findById.mockResolvedValue(null);

    // Call the function
    await Authorization(req, res, next);

    // Assertions
    expect(User.findById).toHaveBeenCalledWith(decoded.id);
    expect(next).toHaveBeenCalledWith(
      new UnauthorizedError("JsonWebTokenError: invalid signature")
    );
  });
});
