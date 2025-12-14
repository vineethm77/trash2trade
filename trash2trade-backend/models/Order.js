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
    quantity: {
      type: Number,
      required: true,
    },
    logisticsMode: {
      type: String,
      enum: ["direct", "3pl", "hub"],
      default: "direct",
    },
    status: {
      type: String,
      enum: [
        "Placed",
        "Approved",
        "Rejected",
        "Shipped",
        "Completed",
        "Cancelled",
      ],
      default: "Placed",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);
