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
  jwt.verify(token, process.env.SECRET_KEY, async (error, decoded) => {
    if (error) {
      return next(
        new UnauthorizedError("JsonWebTokenError: invalid signature")
      );
    }
    userDetails = await User.findById(decoded.id);
    if (!userDetails) {
      return next(
        new UnauthorizedError("JsonWebTokenError: invalid signature")
      );
    }
    req.user = {
      id: userDetails.id,
      first_name: userDetails.first_name,
      last_name: userDetails.last_name,
      email: userDetails.email,
    };
    next();
  });
});

module.exports = { Authorization };
