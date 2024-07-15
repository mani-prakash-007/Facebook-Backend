//Importing User Schema and Bcrypt
const User = require("../models/userSchema");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

//Controllers
//Register User - Controller
const registerUser = async (req, res) => {
  try {
    const { fname, lname, email, password } = req.body;
    if (!fname) {
      return res.status(400).json({
        Error: "Enter First Name...!!",
      });
    }
    if (!lname) {
      return res.status(400).json({
        Error: "Enter Last Name...!!",
      });
    }
    if (!email) {
      return res.status(400).json({
        Error: "Enter your Email...!!",
      });
    }
    if (!password) {
      return res.status(400).json({
        Error: "Enter your password...!!",
      });
    }
    //Validating Email
    if (!ValidateEmail(email)) {
      return res.status(400).json({
        Error: "Enter a Valid Email Adderss ( example@domain.com)",
      });
    }
    //Checking the Email is Existing
    const ExistUser = await User.findOne({ email });
    if (ExistUser) {
      return res
        .status(409)
        .json({ Error: "Email already Exist. Please Login..." });
    }
    //Validating Password
    if (!ValidatePassword(password)) {
      return res.status(400).json({
        Error:
          "Enter a Valid password. Password must be at least 8 characters long and include at least one uppercase letter(A-Z), one lowercase letter(a-z), one digit(0-9), and one special character (./,@#%).",
      });
    }
    //Hashing the Password
    const salt = await bcrypt.genSalt(10);
    const HashedPassword = await bcrypt.hash(password, salt);

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
    const { email, password } = req.body;
    //Checking Fields..
    if (!email) {
      return res.status(400).json({ Error: "Enter username...!!" });
    }
    if (!password) {
      return res.status(400).json({ Error: "Enter password...!!" });
    }
    //Getting user details from db
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ Error: "Email not Found.." });
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
      res.status(401).json({ Error: "Login Failed" });
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
//Email Validation Function.
const ValidateEmail = (email) => {
  const pattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return pattern.test(email);
};
//Password Validation Function.
const ValidatePassword = (password) => {
  const pattern =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  return pattern.test(password);
};

//Generate JWT token for authorization
const GenerateToken = (id) => {
  return jwt.sign({ id }, process.env.SECRET_KEY, { expiresIn: "10d" });
};

module.exports = { registerUser, loginUser, getCurrUser };
