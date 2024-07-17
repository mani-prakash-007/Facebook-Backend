//Importing User Schema and Bcrypt
const User = require("../models/userSchema");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const {
  checkUserExist,
  createNewUser,
  checkCredentials,
} = require("../services/userServices");
const {
  validateRegisterFields,
  validateLoginFields,
} = require("../validations/userValidations");

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
    const ExistUser = await checkUserExist(email);
    if (ExistUser) {
      return res
        .status(409)
        .json({ Error: "Email already Exist. Please Login..." });
    }
    //Creating user
    const user = await createNewUser(fname, lname, email, password);
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
    const validation = await validateLoginFields({ email, password });
    if (validation) {
      return res.status(400).json({ Error: validation.details[0].message });
    }
    //Checking the Login Credentials..
    const user = await checkCredentials(email, password);
    res.status(user.code).json({ Status: user });
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

module.exports = { registerUser, loginUser, getCurrUser };
