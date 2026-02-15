import mongoose from "mongoose";

const userSpinSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  lastSpinDate: Date
});

export default mongoose.model("UserSpin", userSpinSchema);
