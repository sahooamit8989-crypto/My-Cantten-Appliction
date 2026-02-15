



import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    items: {
      type: Array,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    originalAmount: {
      type: Number,
    },
    discountAmount: {
      type: Number,
      default: 0,
    },
    couponCode: {
      type: String,
      default: null,
    },
    status: {
      type: String,
      enum: ["Placed", "Accepted", "Cooking", "Ready", "Delivered", "Cancelled"],
      default: "Placed",   // ✅ corrected default
    },
    payment: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const orderModel = mongoose.models.order || mongoose.model("order", orderSchema);

export default orderModel;
