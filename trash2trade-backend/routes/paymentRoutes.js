import express from "express";
import Razorpay from "razorpay";
import crypto from "crypto";
import Order from "../models/Order.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

/* =====================================================
   CREATE RAZORPAY ORDER
   POST /api/payments/create
===================================================== */
router.post("/create", protect, async (req, res) => {
  try {
    const { orderId } = req.body;

    if (!orderId) {
      return res.status(400).json({ message: "OrderId required" });
    }

    // Fetch order + material
    const order = await Order.findById(orderId).populate("material");
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Prevent double payment
    if (order.paymentStatus === "PAID") {
      return res.status(400).json({ message: "Order already paid" });
    }

    // Calculate amount securely from DB
    const amount = order.material.basePrice * order.quantity;

    // Razorpay instance
    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    const options = {
      amount: amount * 100, // INR → paise
      currency: "INR",
      receipt: `order_${orderId}`,
    };

    const razorpayOrder = await razorpay.orders.create(options);

    res.status(201).json({
      razorpayOrderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      key: process.env.RAZORPAY_KEY_ID,
    });
  } catch (error) {
    console.error("RAZORPAY CREATE ERROR:", error);
    res.status(500).json({
      message: "Payment order failed",
    });
  }
});

/* =====================================================
   VERIFY PAYMENT
   POST /api/payments/verify
===================================================== */
router.post("/verify", protect, async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      orderId,
    } = req.body;

    if (
      !razorpay_order_id ||
      !razorpay_payment_id ||
      !razorpay_signature ||
      !orderId
    ) {
      return res.status(400).json({ message: "Missing payment details" });
    }

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Prevent re-verification
    if (order.paymentStatus === "PAID") {
      return res.status(400).json({ message: "Payment already verified" });
    }

    // Verify signature
    const sign = `${razorpay_order_id}|${razorpay_payment_id}`;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(sign)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ message: "Invalid payment signature" });
    }

    // Update payment details ONLY
    order.paymentStatus = "PAID";
    order.paymentInfo = {
      razorpayOrderId: razorpay_order_id,
      razorpayPaymentId: razorpay_payment_id,
      razorpaySignature: razorpay_signature,
    };

    await order.save();

    res.json({
      message: "Payment verified successfully",
      order,
    });
  } catch (error) {
    console.error("PAYMENT VERIFY ERROR:", error);
    res.status(500).json({
      message: "Payment verification failed",
    });
  }
});

export default router;
