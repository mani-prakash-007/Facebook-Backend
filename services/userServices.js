//Imports
const User = require("../models/userSchema");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const {
  NotFoundError,
  IncorrectPasswordError,
  EmailAlreadyExistsError,
} = require("../customErrors/customErrorClass");

//Services
//Checking User already exist in Database
const checkUserExist = async (email) => {
  const exist = await User.findOne({ email });
  if (exist) {
    return exist;
  }
};

//Creating New user
const createNewUser = async (fname, lname, email, password) => {
  const existUser = await checkUserExist(email);
  if (existUser) {
    throw new EmailAlreadyExistsError("Email already Exist. Please Login");
  }
  // Adding Salt to password and Hashing the password
  const salt = await bcrypt.genSalt(10);
  const HashedPassword = await bcrypt.hash(password, salt);
  //Creating  new user
  const registeredUserData = await User.create({
    first_name: fname,
    last_name: lname,
    email: email,
    password: HashedPassword,
  });
  return registeredUserData;
};

//Find User by email
const checkCredentials = async (email, password) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new NotFoundError("Email not found");
  }
  if (user.email === email && (await bcrypt.compare(password, user.password))) {
    return {
      statusCode: 200,
      status: "Login Success",
      token: `${jwt.sign({ id: user._id }, process.env.SECRET_KEY, {
        expiresIn: "5h",
      })}`,
    };
  } else {
    throw new IncorrectPasswordError("Incorrect password . Check password");
  }
};

module.exports = { checkUserExist, createNewUser, checkCredentials };
