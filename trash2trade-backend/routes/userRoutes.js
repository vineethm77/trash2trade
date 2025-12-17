import express from "express";
import User from "../models/User.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

/* ===============================
   ADMIN → GET ALL USERS
   GET /api/users/admin/all
================================ */
router.get("/admin/all", protect, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Admin access only" });
    }

    const users = await User.find().select("-password");
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

/* ===============================
   ADMIN → BLOCK / UNBLOCK USER
   PUT /api/users/admin/:id/toggle
================================ */
router.put("/admin/:id/toggle", protect, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Admin access only" });
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // ❌ Prevent blocking admin
    if (user.role === "admin") {
      return res.status(400).json({ message: "Cannot block admin user" });
    }

    // 🔒 TOGGLE BLOCK STATUS
    user.isBlocked = !user.isBlocked;
    await user.save();

    res.json({
      message: user.isBlocked
        ? "User blocked successfully"
        : "User unblocked successfully",
      user,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
