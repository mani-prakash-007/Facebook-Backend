//Imports
const express = require("express");
const userRouter = express.Router();
const { Authorization } = require("../middleware/AuthMidWare");
const {
  registerUser,
  loginUser,
  getCurrUser,
} = require("../controllers/userController");
const { validateFields } = require("../middleware/validateFields");
const {
  registerSchema,
  loginSchema,
} = require("../validations/userValidations");

//Routes
//Registering User
userRouter.post("/register", validateFields(registerSchema), registerUser);

//Logging in - user
userRouter.post("/login", validateFields(loginSchema), loginUser);

//Getting Current user Details
userRouter.get("/me", Authorization, getCurrUser);

module.exports = userRouter;
