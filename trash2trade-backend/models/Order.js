import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    buyer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    material: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Material",
      required: true,
    },

    // Order details
    quantity: {
      type: Number,
      required: true,
    },

    logisticsMode: {
      type: String,
      enum: ["direct", "3pl", "hub"],
      default: "direct",
    },

    // 🔥 ORDER LIFECYCLE
    orderStatus: {
      type: String,
      enum: [
        "PLACED",
        "PAID",
        "APPROVED",
        "PICKED_UP",
        "COMPLETED",
        "CANCELLED",
      ],
      default: "PLACED",
    },

    // 🔥 PAYMENT STATUS
    paymentStatus: {
      type: String,
      enum: ["PENDING", "PAID", "FAILED"],
      default: "PENDING",
    },

    // 🔥 WHO CANCELLED (NEW)
    cancelledBy: {
      type: String,
      enum: ["ADMIN", "SELLER", "BUYER"],
    },

    // 🔥 RAZORPAY DETAILS
    paymentInfo: {
      razorpayOrderId: String,
      razorpayPaymentId: String,
      razorpaySignature: String,
    },

    // Timestamps for workflow
    approvedAt: Date,
    completedAt: Date,
    cancelledAt: Date, // 🔥 NEW
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);
