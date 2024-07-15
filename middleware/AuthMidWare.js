const jwt = require("jsonwebtoken");
const User = require("../models/userSchema");

const Authorization = async (req, res, next) => {
  try {
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }
    if (!token) {
      return res.status(400).json({ Error: "Token not found in req.headers" });
    }
    const decode = jwt.verify(token, process.env.SECRET_KEY);
    req.user = await User.findById(decode.id).select("-password");
    next();
  } catch (err) {
    return res.status(400).json({ Error: `Token not Authorized . ${err}` });
  }
};

module.exports = { Authorization };
