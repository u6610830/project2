import mongoose from "mongoose";

const QuotationSchema = new mongoose.Schema(
  {
    oemRequestId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "OEMRequest",
      required: true,
    },

    supplierId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    pricePerUnit: {
      type: Number,
      required: true,
    },

    totalPrice: {
      type: Number,
      required: true,
    },

    leadTimeDays: {
      type: Number,
      required: true,
    },

    message: {
      type: String,
    },

    status: {
      type: String,
      enum: ["Submitted", "Accepted", "Rejected"],
      default: "Submitted",
    },
  },
  { timestamps: true }
);

export default mongoose.models.Quotation ||
  mongoose.model("Quotation", QuotationSchema);