import mongoose from "mongoose";

const spinHistorySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  rewardId: { type: mongoose.Schema.Types.ObjectId, ref: "Reward" },
  rewardName: String,

  status: {
    type: String,
    enum: ["PENDING", "APPROVED", "USED", "INVALID"],
    default: "PENDING"
  },

  date: { type: Date, default: Date.now }
});

export default mongoose.model("SpinHistory", spinHistorySchema);

