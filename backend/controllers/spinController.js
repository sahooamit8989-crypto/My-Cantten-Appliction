import Reward from "../models/Reward.js";
import SpinHistory from "../models/SpinHistory.js";
import UserSpin from "../models/UserSpin.js";







export const spinWheel = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "Authentication required" });
    }

    const userId = req.user.id;

    const userSpin = await UserSpin.findOne({ userId });

    if (userSpin) {
      const lastSpin = new Date(userSpin.lastSpinDate);
      const now = new Date();

      if (lastSpin.toDateString() === now.toDateString()) {
        return res.status(400).json({ message: "Daily spin already used" });
      }
    }

    const rewards = await Reward.find({ active: true });

    let totalProbability = rewards.reduce((s, r) => s + r.probability, 0);
    let random = Math.random() * totalProbability;

    let selectedReward = null;

    for (let r of rewards) {
      if (random < r.probability) {
        selectedReward = r;
        break;
      }
      random -= r.probability;
    }

    // ⭐ SAVE USER REWARD ENTRY
    await SpinHistory.create({
      userId,
      rewardId: selectedReward._id,
      rewardName: selectedReward.name,
      status: "PENDING"
    });

    await UserSpin.findOneAndUpdate(
      { userId },
      { lastSpinDate: new Date() },
      { upsert: true }
    );

    res.json({
      success: true,
      reward: { name: selectedReward.name }
    });

  } catch (err) {
    res.status(500).json({ message: "Spin failed" });
  }
};
