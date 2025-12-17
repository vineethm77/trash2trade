import jwt from "jsonwebtoken";
import User from "../models/User.js";

// ===============================
// 🔐 PROTECT ROUTES (JWT)
// ===============================
export const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // 🔥 Fetch full user (role + block status needed)
      const user = await User.findById(decoded.id).select("-password");

      if (!user) {
        return res.status(401).json({ message: "User not found" });
      }

      // 🚫 BLOCKED USER CHECK (IMPORTANT)
      if (user.isBlocked) {
        return res
          .status(403)
          .json({ message: "Your account has been blocked by admin" });
      }

      req.user = user;
      next();
    } catch (error) {
      return res.status(401).json({ message: "Token invalid" });
    }
  } else {
    return res.status(401).json({ message: "No token provided" });
  }
};

// ===============================
// 🔥 ROLE-BASED ACCESS
// ===============================
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Access denied" });
    }
    next();
  };
};
