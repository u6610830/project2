import mongoose from "mongoose";

const SupplierProfileSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true,
  },
  categories: {
    type: [String],
    required: true,
  },
  minimumOrderQuantity: {
    type: Number,
    required: true,
  },
  capacityPerMonth: {
    type: Number,
    required: true,
  },
  leadTimeDays: {
    type: Number,
    required: true,
  },
  portfolio: {
    type: [String], 
    default: [],
  },
  ratingAverage: {
    type: Number,
    default: 0,
  },
  verified: {
    type: Boolean,
    default: false,
  },
});

export default mongoose.models.SupplierProfile ||
  mongoose.model("SupplierProfile", SupplierProfileSchema);