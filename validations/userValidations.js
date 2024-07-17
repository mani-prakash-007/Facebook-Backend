const Joi = require("joi");
//Validation on Register Field
const validateRegisterFields = async ({ fname, lname, email, password }) => {
  const registerSchema = Joi.object({
    fname: Joi.string().min(3).max(50).required().messages({
      "string.pattern.base":
        "First Name must contain minimum least 3 letters and maximum 50 letters.",
    }),
    lname: Joi.string().min(3).max(50).required().messages({
      "string.pattern.base":
        "Last Name must contain minimum least 3 letters and maximum 50 letters.",
    }),
    email: Joi.string()
      .email({ minDomainSegments: 2, tlds: { allow: ["com", "net", "org"] } })
      .required()
      .messages({
        "string.email":
          "Please enter a valid email address with a domain of .com, .net, or .org.",
        "any.required": "Email is required.",
      }),
    password: Joi.string()
      .min(8)
      .max(30)
      .pattern(
        new RegExp(
          "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[./,@#%])[A-Za-z0-9./,@#%]+$"
        )
      )
      .messages({
        "string.pattern.base":
          "Password must contain at least one uppercase letter( A-Z ), one lowercase letter( a-z ), one digit( 0-9 ), and one special character (./,@#%).",
        "string.min": "Password must be at least 8 characters long.",
        "string.max": "Password must be at most 30 characters long.",
        "any.required": "Password is required.",
      })
      .required(),
  }).with("fname", "lname");
  const { error, value } = registerSchema.validate({
    fname: fname,
    lname: lname,
    email: email,
    password: password,
  });
  if (error) {
    console.log("Error msg (validation)", error);
    return error;
  }
};

//Validation on Login Field
const validateLoginFiled = async ({ email, password }) => {
  const loginSchema = Joi.object({
    email: Joi.string()
      .email({ minDomainSegments: 2, tlds: { allow: ["com", "net", "org"] } })
      .messages({
        "string.email":
          "Please enter a valid email address with a domain of .com, .net, or .org.",
        "any.required": "Email is required.",
      })
      .required(),
    password: Joi.string().required(),
  });
  const { error, value } = loginSchema.validate({
    email: email,
    password: password,
  });
  if (error) {
    return error;
  }
};

module.exports = { validateRegisterFields, validateLoginFiled };
