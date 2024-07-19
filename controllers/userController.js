//Importing Services and Validations
const {
  checkUserExist,
  createNewUser,
  checkCredentials,
} = require("../services/userServices");

//Controllers
//Register User - Controller
const registerUser = async (req, res) => {
  try {
    //Variable
    const { fname, lname, email, password } = req.body;

    //Services
    //Service - 1
    const ExistUser = await checkUserExist(email);
    if (ExistUser) {
      return res
        .status(409)
        .json({ Error: "Email already Exist. Please Login..." });
    }
    //Service - 2
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
    //Variables
    const { email, password } = req.body;

    //Services
    const user = await checkCredentials(email, password);
    res.status(user.statusCode).json({ Details: user });
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
