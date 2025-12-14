import express from "express";
import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import sendEmail from "../utils/sendEmail.js";
import { welcomeEmail } from "../utils/emailTemplates.js";

const router = express.Router();

// JWT token generator
const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

// --------------------
// REGISTER
// --------------------
router.post("/register", async (req, res) => {
  try {
    const { name, companyName, email, password, role } = req.body;

    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const hashed = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      companyName,
      email,
      password: hashed,
      role: role || "buyer",
    });

    console.log("Sending welcome email to:", user.email);

    // ✅ SEND WELCOME EMAIL
    await sendEmail(
      user.email,
      "Welcome to Trash2Trade",
      welcomeEmail(user.name)
    );

    const token = generateToken(user._id, user.role);

    res.json({
      message: "Registration successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        companyName: user.companyName,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

// --------------------
// LOGIN
// --------------------
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ message: "Invalid email or password" });

    const match = await bcrypt.compare(password, user.password);
    if (!match)
      return res.status(400).json({ message: "Invalid email or password" });

    const token = generateToken(user._id, user.role);

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        companyName: user.companyName,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// --------------------
// GET LOGGED-IN USER
// --------------------
router.get("/me", async (req, res) => {
  try {
    const header = req.headers.authorization || "";
    const token = header.split(" ")[1];

    if (!token) return res.status(401).json({ message: "No token provided" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user);
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
});

export default router;
