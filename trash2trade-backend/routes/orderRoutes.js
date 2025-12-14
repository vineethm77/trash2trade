import express from "express";
import Order from "../models/Order.js";
import Material from "../models/Material.js";
import { protect } from "../middleware/authMiddleware.js";
import sendEmail from "../utils/sendEmail.js";
import {
  orderPlacedEmail,
  orderApprovedEmail,
  orderRejectedEmail,
  orderShippedEmail,
  orderCompletedEmail,
} from "../utils/emailTemplates.js";

const router = express.Router();

/* -------------------------------
   CREATE ORDER
-------------------------------- */
router.post("/", protect, async (req, res) => {
  try {
    const { materialId, quantity, logisticsMode } = req.body;

    const material = await Material.findById(materialId)
      .populate("seller")
      .populate("seller");

    if (!material || material.isActive === false) {
      return res.status(404).json({ message: "Material not available" });
    }

    if (material.quantity < quantity) {
      return res.status(400).json({ message: "Insufficient quantity" });
    }

    const order = await Order.create({
      buyer: req.user._id,
      seller: material.seller._id,
      material: material._id,
      quantity,
      logisticsMode,
      status: "Placed",
    });

    material.quantity -= quantity;
    if (material.quantity === 0) material.isActive = false;
    await material.save();

    // 📧 EMAILS
    console.log("📨 Sending ORDER PLACED emails");
    await sendEmail(
      material.seller.email,
      "New Order Received",
      orderPlacedEmail("Seller", material.name)
    );

    res.status(201).json(order);
  } catch (err) {
    console.error("CREATE ORDER ERROR:", err);
    res.status(500).json({ message: "Order failed" });
  }
});

/* -------------------------------
   SELLER UPDATE STATUS
-------------------------------- */
router.put("/:id/status", protect, async (req, res) => {
  try {
    const { status } = req.body;

    const allowed = ["Approved", "Rejected", "Shipped"];
    if (!allowed.includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const order = await Order.findById(req.params.id)
      .populate("buyer")
      .populate("material");

    if (!order) return res.status(404).json({ message: "Order not found" });

    if (order.seller.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    order.status = status;
    await order.save();

    // 📧 EMAILS
    if (status === "Approved") {
      await sendEmail(
        order.buyer.email,
        "Order Approved",
        orderApprovedEmail(order.material.name)
      );
    }

    if (status === "Rejected") {
      await sendEmail(
        order.buyer.email,
        "Order Rejected",
        orderRejectedEmail(order.material.name)
      );
    }

    if (status === "Shipped") {
      await sendEmail(
        order.buyer.email,
        "Order Shipped",
        orderShippedEmail(order.material.name)
      );
    }

    res.json(order);
  } catch (err) {
    console.error("STATUS UPDATE ERROR:", err);
    res.status(500).json({ message: "Status update failed" });
  }
});

/* -------------------------------
   BUYER CONFIRM DELIVERY
-------------------------------- */
router.put("/:id/confirm", protect, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("seller")
      .populate("material");

    if (!order) return res.status(404).json({ message: "Order not found" });

    if (order.buyer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    order.status = "Completed";
    await order.save();

    // 📧 EMAIL
    await sendEmail(
      order.seller.email,
      "Order Completed",
      orderCompletedEmail(order.material.name)
    );

    res.json(order);
  } catch (err) {
    console.error("CONFIRM DELIVERY ERROR:", err);
    res.status(500).json({ message: "Confirmation failed" });
  }
});

/* -------------------------------
   GET SELLER ORDERS
-------------------------------- */
router.get("/my-sells", protect, async (req, res) => {
  const orders = await Order.find({ seller: req.user._id })
    .populate("material")
    .populate("buyer", "companyName email");
  res.json(orders);
});

/* -------------------------------
   GET BUYER ORDERS
-------------------------------- */
router.get("/my-buys", protect, async (req, res) => {
  const orders = await Order.find({ buyer: req.user._id })
    .populate("material")
    .populate("seller", "companyName email");
  res.json(orders);
});

export default router;
