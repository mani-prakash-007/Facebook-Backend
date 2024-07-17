//Importing User Schema and Bcrypt
const User = require("../models/userSchema");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Joi = require("joi");
const { validateRegisterFields , validateLoginFiled } = require("../validations/userValidations");

//Controllers
//Register User - Controller
const registerUser = async (req, res) => {
  try {
    //Checking req.body
    const { fname, lname, email, password } = req.body;
    const validation = await validateRegisterFields({
      fname,
      lname,
      email,
      password,
    });
    if (validation) {
      return res.status(400).json({ Error: validation.details[0].message });
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
    const validation = await validateLoginFiled({ email , password })
    if (validation) {
      return res.status(400).json({ Error: validation.details[0].message });
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
