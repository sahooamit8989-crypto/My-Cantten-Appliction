import mongoose from "mongoose";

const rewardSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    type: {
      type: String,
      enum: ["discount", "free_item", "points"],
      default: "discount"
    },
    value: {
      type: String,
      required: true
    },
    probability: {
      type: Number,
      required: true,
      min: 0
    },
    active: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

const Reward = mongoose.model("Reward", rewardSchema);

export default Reward;

