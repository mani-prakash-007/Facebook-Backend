//Middleware for Validating the req.body and req.params

//Validating Req.Body
const validateFields = (schema) => (req, res, next) => {
  console.log(req.body);
  const { error, value } = schema.validate(req.body);
  console.log("\nValidateFields- executing");

  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  if (value) {
    next();
  }
};

//Validating Req.Params.Id
const validateParams = (schema) => (req, res, next) => {
  const paramsId = { id: req.params.id };
  const { error, value } = schema.validate(paramsId);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  if (value) {
    next();
  }
};

module.exports = { validateFields, validateParams };
