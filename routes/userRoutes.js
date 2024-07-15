// Register , Login , getCurrentUser
const express = require("express");
const userRouter = express.Router();
const { Authorization } = require("../middleware/AuthMidWare");

const {
  registerUser,
  loginUser,
  getCurrUser,
} = require("../controllers/userController");

userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);
userRouter.get("/me", Authorization, getCurrUser);

module.exports = userRouter;
