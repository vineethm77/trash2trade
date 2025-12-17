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

/* ===============================
   CREATE ORDER (BUYER → PLACED)
================================ */
router.post("/", protect, async (req, res) => {
  try {
    const { materialId, quantity, logisticsMode } = req.body;

    if (!materialId || !quantity) {
      return res.status(400).json({ message: "Missing fields" });
    }

    const material = await Material.findById(materialId).populate("seller");
    if (!material || material.status !== "active") {
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
      logisticsMode: logisticsMode || "direct",
      orderStatus: "PLACED",
      paymentStatus: "PENDING",
    });

    material.quantity -= quantity;
    if (material.quantity === 0) material.status = "inactive";
    await material.save();

    await sendEmail(
      material.seller.email,
      "New Order Received",
      orderPlacedEmail(material.seller.name, material.name)
    );

    res.status(201).json(order);
  } catch (err) {
    console.error("CREATE ORDER ERROR:", err);
    res.status(500).json({ message: "Order failed" });
  }
});

/* ===============================
   BUYER → GET MY ORDERS ✅
================================ */
router.get("/my-buys", protect, async (req, res) => {
  const orders = await Order.find({ buyer: req.user._id })
    .populate("material")
    .populate("seller", "companyName email");

  res.json(orders);
});

/* ===============================
   SELLER → GET MY SALES ✅
================================ */
router.get("/my-sells", protect, async (req, res) => {
  const orders = await Order.find({ seller: req.user._id })
    .populate("material")
    .populate("buyer", "companyName email");

  res.json(orders);
});

/* ===============================
   SELLER APPROVE / REJECT
================================ */
router.put("/:id/approve", protect, async (req, res) => {
  try {
    const { action } = req.body;

    const order = await Order.findById(req.params.id)
      .populate("buyer")
      .populate("material");

    if (!order) return res.status(404).json({ message: "Order not found" });
    if (order.seller.toString() !== req.user._id.toString())
      return res.status(403).json({ message: "Not authorized" });

    if (order.orderStatus !== "PLACED") {
      return res.status(400).json({ message: "Order not in PLACED state" });
    }

    if (action === "APPROVE") {
      order.orderStatus = "APPROVED";
      order.approvedAt = new Date();

      await sendEmail(
        order.buyer.email,
        "Order Approved",
        orderApprovedEmail(order.material.name)
      );
    }

    if (action === "REJECT") {
      order.orderStatus = "CANCELLED";
      order.cancelledBy = "SELLER";
      order.cancelledAt = new Date();

      await sendEmail(
        order.buyer.email,
        "Order Rejected by Seller",
        orderRejectedEmail(order.material.name)
      );
    }

    await order.save();
    res.json(order);
  } catch (err) {
    console.error("APPROVAL ERROR:", err);
    res.status(500).json({ message: "Approval failed" });
  }
});

/* ===============================
   SELLER SHIP (AFTER PAYMENT)
================================ */
router.put("/:id/pickup", protect, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("buyer")
      .populate("material");

    if (!order) return res.status(404).json({ message: "Order not found" });
    if (order.seller.toString() !== req.user._id.toString())
      return res.status(403).json({ message: "Not authorized" });

    if (order.paymentStatus !== "PAID") {
      return res.status(400).json({ message: "Payment not completed yet" });
    }

    order.orderStatus = "PICKED_UP";
    await order.save();

    await sendEmail(
      order.buyer.email,
      "Order Shipped",
      orderShippedEmail(order.material.name)
    );

    res.json(order);
  } catch (err) {
    console.error("PICKUP ERROR:", err);
    res.status(500).json({ message: "Pickup update failed" });
  }
});

/* ===============================
   BUYER CONFIRM DELIVERY
================================ */
router.put("/:id/complete", protect, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("seller")
      .populate("material");

    if (!order) return res.status(404).json({ message: "Order not found" });
    if (order.buyer.toString() !== req.user._id.toString())
      return res.status(403).json({ message: "Not authorized" });

    if (order.orderStatus !== "PICKED_UP") {
      return res.status(400).json({ message: "Order not shipped yet" });
    }

    order.orderStatus = "COMPLETED";
    order.completedAt = new Date();
    await order.save();

    await sendEmail(
      order.seller.email,
      "Order Completed",
      orderCompletedEmail(order.material.name)
    );

    res.json(order);
  } catch (err) {
    console.error("COMPLETE ERROR:", err);
    res.status(500).json({ message: "Completion failed" });
  }
});

/* ===============================
   ADMIN → GET ALL ORDERS
================================ */
router.get("/admin/all", protect, async (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Admin access only" });
  }

  const orders = await Order.find()
    .populate("buyer", "companyName email")
    .populate("seller", "companyName email")
    .populate("material");

  res.json(orders);
});

/* ===============================
   ADMIN → CANCEL ANY ORDER
================================ */
router.put("/admin/:id/cancel", protect, async (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Admin access only" });
  }

  const order = await Order.findById(req.params.id)
    .populate("buyer")
    .populate("seller")
    .populate("material");

  if (!order) return res.status(404).json({ message: "Order not found" });

  if (["COMPLETED", "CANCELLED"].includes(order.orderStatus)) {
    return res.status(400).json({ message: "Order already closed" });
  }

  order.orderStatus = "CANCELLED";
  order.cancelledBy = "ADMIN";
  order.cancelledAt = new Date();
  await order.save();

  await sendEmail(
    order.buyer.email,
    "Order Cancelled by Admin",
    `<p>Your order for <b>${order.material.name}</b> was cancelled by Admin.</p>`
  );

  await sendEmail(
    order.seller.email,
    "Order Cancelled by Admin",
    `<p>An order for <b>${order.material.name}</b> was cancelled by Admin.</p>`
  );

  res.json(order);
});

export default router;
