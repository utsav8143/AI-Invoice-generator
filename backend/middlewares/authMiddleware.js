const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

const protect = async (req, res, next) => {
  let token;
  console.log("AUTH HEADER:", req.headers.authorization);

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // Get token from header
      token = req.headers.authorization.split(" ")[1];

      console.log("TOKEN:", token);

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get user
      req.user = await User.findById(decoded.id).select("-password");

      if(!user){
        return res.status(401).json({"User not found"}) }

      req.user=user;

      next();
    } catch (err) {
      console.log("JWT ERROR:", err.message);
      return res.status(401).json({ message: "Not authorized, Token failed" });
    }
  }

  if (!token) {
    return res.status(401).json({ message: "Not authorized, No token" });
  }
};

module.exports = { protect };
