import express from "express";
import foodModel from "../models/foodModel.js";

const router = express.Router();

/**
 * GET /api/food/search?q=piz
 */
router.get("/search", async (req, res) => {
  try {
    const { q } = req.query;

    if (!q) return res.json([]);

    const foods = await foodModel.find({
      name: { $regex: `^${q}`, $options: "i" }, // starts with
    })
    .limit(10)
    .select("name price image category");

    res.json(foods);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
