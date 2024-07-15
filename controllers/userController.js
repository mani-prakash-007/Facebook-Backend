//Importing User Schema and Bcrypt
const User = require("../models/userSchema");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

//Controllers
//Register User - Controller
const registerUser = async (req, res) => {
  const { fname, lname, email, password } = req.body;
  if (!fname || !lname || !email || !password) {
    return res.status(400).json({
      Error:
        "Enter All Required Fileds (First Name , Last Name , email , password)",
    });
  }
  //Validating Email
  if (!ValidateEmail(email)) {
    return res.status(400).json({
      error: "Enter a Valid Email Adderss ( example@domain.com)",
    });
  }
  //Checking the Email is Existing
  const ExistUser = await User.findOne({ email });
  if (ExistUser) {
    return res
      .status(400)
      .json({ Error: " Email already Exist. Please Login..." });
  }
  //Validating Password
  if (!ValidatePassword(password)) {
    return res.status(400).json({
      error: "Enter a Valid password.",
      required:
        " Password must be at least 8 characters long and include at least one uppercase letter(A-Z), one lowercase letter(a-z), one digit(0-9), and one special character (./,@#%).",
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
  res.status(200).json({ Status: "Register Successful", UserData: user });
};

//Login user - Controller
const loginUser = async (req, res) => {
  const { email, password } = req.body;
  //Checking Fields..
  if (!email || !password) {
    return res.status(400).json({ Error: "Enter required fileds..." });
  }
  //Getting user details from db
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(400).json({ Error: "Email not Found.." });
  }
  //Comparing User and Password then generating Auth token(jwt)
  if (user.email === email && (await bcrypt.compare(password, user.password))) {
    return res.status(200).json({
      Status: "Login Success",
      user_Data: { ...user._doc, password: undefined },
      token: GenerateToken(user._id),
    });
  } else {
    res.status(400).json({ Error: " Login Failed" });
  }
};

//Getting Current User  - Controller
const getCurrUser = (req, res) => {
  return res.status(200).json({ Current_User: req.user });
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
