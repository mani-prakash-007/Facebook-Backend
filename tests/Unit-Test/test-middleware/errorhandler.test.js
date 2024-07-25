const { globalErrorHandler } = require("../../../middleware/errorHandler");

describe("Global Error handler ", () => {
  let error, req, res, next;

  //Should catch the error and return the error.
  beforeEach(() => {
    error = {};
    req = {};
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
  });
  it("Should return error on catching specific error", () => {
    //Mocking error
    error = {
      statusCode: 409,
      name: "EmailAlreadyExistsError",
      message: "Email already exists. Please Login",
    };
    //Calling the function
    globalErrorHandler(error, req, res, next);

    //Assertions
    expect(res.status).toHaveBeenCalledWith(error.statusCode);
    expect(res.json).toHaveBeenCalledWith({
      StatusCode: error.statusCode,
      ErrorName: error.name,
      ErrorMessage: error.message,
    });
    expect(next).not.toHaveBeenCalled();
  });

  //Should call next() if no error caught
  it("Should return 500 for unknown errors", () => {
    //MocKing Error Object
    error = {
      message: "Something went wrong",
    };
    //Calling the function
    globalErrorHandler(error, req, res, next);

    //Assertion
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      StatusCode: 500,
      ErrorName: undefined,
      ErrorMessage: error.message,
    });
    expect(next).not.toHaveBeenCalledWith();
  });
});
