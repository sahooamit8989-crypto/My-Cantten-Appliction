import express from "express";
import SpinHistory from "../models/SpinHistory.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

// USER REWARD LIST
router.get("/my-rewards", authMiddleware, async (req, res) => {
  try {
    const rewards = await SpinHistory.find({
      userId: req.user.id
    }).sort({ date: -1 });

    res.json({ success: true, rewards });

  } catch {
    res.status(500).json({ message: "Failed to fetch rewards" });
  }
});

export default router;
