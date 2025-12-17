import express from "express";
import Order from "../models/Order.js";
import User from "../models/User.js";
import Material from "../models/Material.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

/* ===============================
   SELLER STATS
   GET /api/stats/seller
================================ */
router.get("/seller", protect, async (req, res) => {
  const seller = req.user._id;

  const orders = await Order.find({ seller });

  const stats = {
    total: orders.length,
    approved: orders.filter(o => o.orderStatus === "APPROVED").length,
    rejected: orders.filter(o => o.orderStatus === "CANCELLED").length,
    completed: orders.filter(o => o.orderStatus === "COMPLETED").length,
    inProgress: orders.filter(o =>
      ["PLACED", "APPROVED", "PICKED_UP"].includes(o.orderStatus)
    ).length,
  };

  res.json(stats);
});

/* ===============================
   BUYER STATS
   GET /api/stats/buyer
================================ */
router.get("/buyer", protect, async (req, res) => {
  const buyer = req.user._id;

  const orders = await Order.find({ buyer });

  const stats = {
    total: orders.length,
    completed: orders.filter(o => o.orderStatus === "COMPLETED").length,
    rejected: orders.filter(o => o.orderStatus === "CANCELLED").length,
    inProgress: orders.filter(o =>
      ["PLACED", "APPROVED", "PICKED_UP"].includes(o.orderStatus)
    ).length,
  };

  res.json(stats);
});

/* ===============================
   ADMIN STATS
   GET /api/stats/admin
================================ */
router.get("/admin", protect, async (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Admin access only" });
  }

  const [users, orders, materials] = await Promise.all([
    User.find(),
    Order.find(),
    Material.find(),
  ]);

  const revenue = orders
    .filter(o => o.paymentStatus === "PAID")
    .reduce((sum, o) => sum + (o.amount || 0), 0);

  res.json({
    users: {
      total: users.length,
      buyers: users.filter(u => u.role === "buyer").length,
      sellers: users.filter(u => u.role === "seller").length,
      admins: users.filter(u => u.role === "admin").length,
    },
    orders: {
      total: orders.length,
      placed: orders.filter(o => o.orderStatus === "PLACED").length,
      approved: orders.filter(o => o.orderStatus === "APPROVED").length,
      pickedUp: orders.filter(o => o.orderStatus === "PICKED_UP").length,
      completed: orders.filter(o => o.orderStatus === "COMPLETED").length,
      cancelled: orders.filter(o => o.orderStatus === "CANCELLED").length,
    },
    materials: {
      total: materials.length,
    },
    revenue,
  });
});

export default router;
