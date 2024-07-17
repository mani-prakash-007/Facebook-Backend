//Importing User Schema and Bcrypt
const User = require("../models/userSchema");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Joi = require("joi");

//Controllers
//Register User - Controller
const registerUser = async (req, res) => {
  try {
    //Checking req.body
    const { fname, lname, email, password } = req.body;
    const schema = Joi.object({
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
          new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[./,@#%])$")
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
    const { error, value } = schema.validate({
      fname: fname,
      lname: lname,
      email: email,
      password: password,
    });
    if (error) {
      return res.status(400).json({ Error: error.details[0].message });
    }
    //Checking the Email is Existing
    const ExistUser = await User.findOne({ email });
    if (ExistUser) {
      return res
        .status(409)
        .json({ Error: "Email already Exist. Please Login..." });
    }
    //Hashing the Password
    const salt = await bcrypt.genSalt(10);
    const HashedPassword = await bcrypt.hash(password, salt);
    //Creating user
    const user = await User.create({
      first_name: fname,
      last_name: lname,
      email: email,
      password: HashedPassword,
    });
    res
      .status(200)
      .json({ Status: "Register Successful...!!", UserData: user });
  } catch (error) {
    console.error("Error on Registering user \n", error);
    return res.status(500).json({ Error: "Server Error" });
  }
};

//Login user - Controller
const loginUser = async (req, res) => {
  try {
    //Checking req.body
    const { email, password } = req.body;
    const schema = Joi.object({
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
    const { error, value } = schema.validate({
      email: email,
      password: password,
    });
    if (error) {
      return res.status(400).json({ Error: error.details[0].message });
    }
    //Getting user details from db
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .json({ Error: "Login Failed . Check Username / Password" });
    }
    //Comparing User and Password then generating Auth token(jwt)
    if (
      user.email === email &&
      (await bcrypt.compare(password, user.password))
    ) {
      return res.status(200).json({
        Status: "Login Success",
        user_Data: { ...user._doc, password: undefined },
        token: GenerateToken(user._id),
      });
    } else {
      res
        .status(401)
        .json({ Error: "Login Failed . Check Username / Password" });
    }
  } catch (error) {
    console.error("Error on logging in \n", error);
    return res.status(500).json({ Error: "Server Error" });
  }
};

//Getting Current User  - Controller
const getCurrUser = (req, res) => {
  try {
    return res.status(200).json({ Current_User: req.user });
  } catch (error) {
    console.error("Error on fetching current user \n", error);
    return res.status(500).json({ Error: "Server Error." });
  }
};
//Functions for Validation...
//Generate JWT token for authorization
const GenerateToken = (id) => {
  return jwt.sign({ id }, process.env.SECRET_KEY, { expiresIn: "10d" });
};

module.exports = { registerUser, loginUser, getCurrUser };
