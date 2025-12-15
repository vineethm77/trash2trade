import express from "express";
import Order from "../models/Order.js";
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

    approved: orders.filter(
      (o) => o.orderStatus === "APPROVED"
    ).length,

    rejected: orders.filter(
      (o) => o.orderStatus === "CANCELLED"
    ).length,

    completed: orders.filter(
      (o) => o.orderStatus === "COMPLETED"
    ).length,

    inProgress: orders.filter((o) =>
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

    completed: orders.filter(
      (o) => o.orderStatus === "COMPLETED"
    ).length,

    rejected: orders.filter(
      (o) => o.orderStatus === "CANCELLED"
    ).length,

    inProgress: orders.filter((o) =>
      ["PLACED", "APPROVED", "PICKED_UP"].includes(o.orderStatus)
    ).length,
  };

  res.json(stats);
});

export default router;
