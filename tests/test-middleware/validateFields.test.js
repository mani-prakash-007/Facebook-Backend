const {
  validateFields,
  validateParams,
} = require("../../middleware/validateFields"); // adjust the path
const Joi = require("joi");

//Test - Validatefields
describe("validateFields middleware", () => {
  let req, res, next;

  //Before passing req, res,next
  beforeEach(() => {
    req = {
      body: {},
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
  });

  //should call next() if validation passes
  it("should call next() if validation passes", () => {
    const schema = Joi.object({
      name: Joi.string().required(),
    });

    req.body = { name: "John Doe" };

    const middleware = validateFields(schema);
    middleware(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
  });

  //should return 400 if validation fails
  it("should return 400 if validation fails", () => {
    const schema = Joi.object({
      name: Joi.string().required(),
    });

    req.body = { name: "" };

    const middleware = validateFields(schema);
    middleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: expect.any(String) });
    expect(next).not.toHaveBeenCalled();
  });
});

//Test  - ValidateParams
describe("ValidateParams middleware", () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      params: {},
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
  });
  it("Should call next() if validation passes", () => {
    const schema = Joi.object({
      id: Joi.string().required(),
    });

    req.params = { id: "1234" };

    const middleware = validateParams(schema);
    middleware(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalledWith();
    expect(res.json).not.toHaveBeenCalledWith();
  });

  it("Should return 400 if validation failed", () => {
    const schema = Joi.object({
      id: Joi.string().required(),
    });

    req.params = { id: "" };

    const middleware = validateParams(schema);
    middleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: expect.any(String) });
    expect(next).not.toHaveBeenCalled();
  });
});
