import express from "express";
import Material from "../models/Material.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

/* -------------------------------
   CREATE MATERIAL (SELLER)
-------------------------------- */
router.post("/", protect, async (req, res) => {
  try {
    const material = await Material.create({
      seller: req.user._id,
      name: req.body.name,
      type: req.body.type,
      description: req.body.description,
      quantity: req.body.quantity,
      unit: req.body.unit,
      basePrice: req.body.basePrice,
      location: req.body.location,
      estimatedCo2Savings: req.body.estimatedCo2Savings || 0,
      isActive: true,
    });

    res.json(material);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* -------------------------------
   UPDATE MATERIAL (EDIT)
-------------------------------- */
router.put("/:id", protect, async (req, res) => {
  try {
    const material = await Material.findById(req.params.id);
    if (!material) {
      return res.status(404).json({ message: "Material not found" });
    }

    // ❌ only owner can edit
    if (material.seller.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    Object.assign(material, {
      name: req.body.name,
      type: req.body.type,
      description: req.body.description,
      quantity: req.body.quantity,
      unit: req.body.unit,
      basePrice: req.body.basePrice,
      location: req.body.location,
      estimatedCo2Savings: req.body.estimatedCo2Savings || 0,
    });

    // Reactivate if quantity restored
    material.isActive = material.quantity > 0;

    await material.save();
    res.json(material);
  } catch (err) {
    res.status(500).json({ message: "Update failed" });
  }
});

/* -------------------------------
   DELETE MATERIAL (SELLER)
-------------------------------- */
router.delete("/:id", protect, async (req, res) => {
  try {
    const material = await Material.findById(req.params.id);
    if (!material) {
      return res.status(404).json({ message: "Material not found" });
    }

    // ❌ only owner can delete
    if (material.seller.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await material.deleteOne();

    res.json({ message: "Material deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Delete failed" });
  }
});

/* -------------------------------
   GET MARKETPLACE MATERIALS
-------------------------------- */
router.get("/", async (req, res) => {
  try {
    const materials = await Material.find({
      $or: [{ isActive: true }, { isActive: { $exists: false } }],
    }).populate("seller", "name email");

    res.json(materials);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* -------------------------------
   GET SELLER MATERIALS
-------------------------------- */
router.get("/my", protect, async (req, res) => {
  const materials = await Material.find({ seller: req.user._id });
  res.json(materials);
});

/* -------------------------------
   GET SINGLE MATERIAL
-------------------------------- */
router.get("/:id", async (req, res) => {
  const material = await Material.findById(req.params.id).populate(
    "seller",
    "name email"
  );
  res.json(material);
});

export default router;
