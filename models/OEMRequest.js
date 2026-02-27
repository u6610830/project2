import mongoose from "mongoose";

const OEMRequestSchema = new mongoose.Schema(
  {
    title: String,
    specifications: String,
    quantity: Number,
    quotation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Quotation",
    },
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    status: {
      type: String,
      enum: ["Pending", "Quoted", "Confirmed", "Cancelled"],
      default: "Pending",
    },
  },
  { timestamps: true }
);

export default mongoose.models.OEMRequest ||
  mongoose.model("OEMRequest", OEMRequestSchema);