//Middleware for Validating the req.body and req.params


//Validating Req.Body 
const validateFields = (schema) => (req, res, next) => {
  console.log(req.body);
  const { error, value } = schema.validate(req.body);
  console.log("\nValidateFields- executing");

  if (error) {
    console.log(" Returning Error");
    console.log("Not entered into controller");
    return res.status(400).json({ error: error.details[0].message });
  }
  if (value) {
    console.log("Exitting validateFields");
    next();
  }
};

//Validating Req.Params.Id
const validateParams = (schema) => (req, res, next) => {
  console.log("\nValidateParams - executing");
  const paramsId = { id: req.params.id };
  const { error, value } = schema.validate(paramsId);
  if (error) {
    console.log("Returning Error");
    console.log("Exitting validateParams");
    return res.status(400).json({ error: error.details[0].message });
  }
  if (value) {
    console.log("Exitting validateParams");
    next();
  }
};

module.exports = { validateFields, validateParams };
