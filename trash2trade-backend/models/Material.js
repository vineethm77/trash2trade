import mongoose from "mongoose";

const materialSchema = new mongoose.Schema(
  {
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: { type: String, required: true },
    type: { type: String, required: true },
    description: String,
    quantity: { type: Number, required: true },
    unit: { type: String, required: true },
    basePrice: { type: Number, required: true },
    location: { type: String, required: true },
    estimatedCo2Savings: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ["active", "sold", "removed"],
      default: "active",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Material", materialSchema);
