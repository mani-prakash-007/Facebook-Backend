const jwt = require("jsonwebtoken");
const User = require("../models/userSchema");

const { catchError } = require("../utils/catchAsync");
const {
  NotFoundError,
  UnauthorizedError,
} = require("../customErrors/customErrorClass");

//Verify Token.
//Jwt Token Authorization
const Authorization = catchError(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }
  if (!token) {
    throw new NotFoundError("Token not Found in Header");
  }
  console.log("Before token validation");
  jwt.verify(token, process.env.SECRET_KEY, async (error, decoded) => {
    if (error) {
      return next(
        new UnauthorizedError("JsonWebTokenError: invalid signature")
      );
    }
    req.user = await User.findById(decoded.id).select("-password");
    next();
  });
});

module.exports = { Authorization };
