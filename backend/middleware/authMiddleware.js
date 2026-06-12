import jwt from "jsonwebtoken";
import User from "../models/User.js";
import config from "../config/config.js";

const protect = async (req, res, next) => {
  let token;
  try {
    //1. Check header
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({ message: "not authorized" });
    }

    //2. Verify token
    const decoded = jwt.verify(token, config.ACCESS_TOKEN_SECRET);

    //3. Get user
    req.user = await User.findById(decoded.userId).select("-password");
    
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

export { protect };
