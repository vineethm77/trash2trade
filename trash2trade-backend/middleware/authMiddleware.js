import jwt from "jsonwebtoken";
import User from "../models/User.js";

// This IS the protect middleware
export const protect = async (req, res, next) => {
  let token;

  // Read token from headers
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Attach user to req
      req.user = { _id: decoded.id };

      return next();

    } catch (error) {
      return res.status(401).json({ message: "Token invalid" });
    }
  }

  // No token found
  return res.status(401).json({ message: "No token provided" });
};
