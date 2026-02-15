import express from "express";
import SpinHistory from "../models/SpinHistory.js";

const router = express.Router();

/**
 * GET all reward claims
 * Endpoint: GET /api/adminreward/reward-claims
 */
router.get("/reward-claims", async (req, res) => {
  try {
    const list = await SpinHistory.find().sort({ date: -1 });
    res.json({ list });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch reward claims" });
  }
});

/**
 * Approve a reward claim
 * Endpoint: PUT /api/adminreward/reward-approve/:id
 */
router.put("/reward-approve/:id", async (req, res) => {
  try {
    await SpinHistory.findByIdAndUpdate(req.params.id, { status: "APPROVED" });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: "Failed to approve reward claim" });
  }
});

/**
 * Mark a reward claim as used
 * Endpoint: PUT /api/adminreward/reward-used/:id
 */
router.put("/reward-used/:id", async (req, res) => {
  try {
    await SpinHistory.findByIdAndUpdate(req.params.id, { status: "USED" });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: "Failed to mark reward as used" });
  }
});

/**
 * Invalidate a reward claim
 * Endpoint: PUT /api/adminreward/reward-invalid/:id
 */
router.put("/reward-invalid/:id", async (req, res) => {
  try {
    await SpinHistory.findByIdAndUpdate(req.params.id, { status: "INVALID" });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: "Failed to invalidate reward claim" });
  }
});

export default router;

