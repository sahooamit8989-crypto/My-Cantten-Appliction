import express from "express";
import Reward from "../models/Reward.js";

const router = express.Router();

// Get all rewards
router.get("/rewards", async (req, res) => {
  try {
    const rewards = await Reward.find();
    res.json({ rewards });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch rewards" });
  }
});

// Create new reward
router.post("/rewards", async (req, res) => {
  try {
    const reward = new Reward(req.body);
    await reward.save();
    res.json({ success: true, reward });
  } catch (err) {
    res.status(500).json({ message: "Failed to create reward" });
  }
});

// Update reward
router.put("/rewards/:id", async (req, res) => {
  try {
    const reward = await Reward.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, reward });
  } catch (err) {
    res.status(500).json({ message: "Failed to update reward" });
  }
});

// Delete reward
router.delete("/rewards/:id", async (req, res) => {
  try {
    await Reward.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete reward" });
  }
});

export default router;
