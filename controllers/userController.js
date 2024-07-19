//Importing Services and Validations
const {
  checkUserExist,
  createNewUser,
  checkCredentials,
} = require("../services/userServices");
const { catchError } = require("../utils/catchAsync");
const { EmailAlreadyExistsError } = require("../customErrors/customErrorClass");

//Controllers
//Register User - Controller
const registerUser = catchError(async (req, res) => {
  //Variable
  const { fname, lname, email, password } = req.body;

  //Services
  //Service - 1
  const ExistUser = await checkUserExist(email);
  if (ExistUser) {
    throw new EmailAlreadyExistsError("Email already Exist. Please Login");
  }
  //Service - 2
  const user = await createNewUser(fname, lname, email, password);
  res.status(200).json({ Status: "Register Successful", UserData: user });
});

//Login user - Controller
const loginUser = catchError(async (req, res) => {
  //Variables
  const { email, password } = req.body;

  //Services
  const user = await checkCredentials(email, password);
  res.status(user.statusCode).json({ Details: user });
});

//Getting Current User  - Controller
const getCurrUser = catchError((req, res) => {
  return res.status(200).json({ Current_User: req.user });
});

module.exports = { registerUser, loginUser, getCurrUser };
