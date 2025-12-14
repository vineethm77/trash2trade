import express from "express";
import Order from "../models/Order.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

/* -------------------------------
   SELLER STATS
-------------------------------- */
router.get("/seller", protect, async (req, res) => {
  const seller = req.user._id;

  const orders = await Order.find({ seller });

  const stats = {
    total: orders.length,
    approved: orders.filter(o => o.status === "Approved").length,
    rejected: orders.filter(o => o.status === "Rejected").length,
    completed: orders.filter(o => o.status === "Completed").length,
    inProgress: orders.filter(o =>
      ["Placed", "Approved", "Shipped"].includes(o.status)
    ).length,
  };

  res.json(stats);
});

/* -------------------------------
   BUYER STATS
-------------------------------- */
router.get("/buyer", protect, async (req, res) => {
  const buyer = req.user._id;

  const orders = await Order.find({ buyer });

  const stats = {
    total: orders.length,
    completed: orders.filter(o => o.status === "Completed").length,
    rejected: orders.filter(o => o.status === "Rejected").length,
    inProgress: orders.filter(o =>
      ["Placed", "Approved", "Shipped"].includes(o.status)
    ).length,
  };

  res.json(stats);
});

export default router;
