import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema(
  {
    oemRequestId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "OEMRequest",
      required: true,
    },
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Message ||
  mongoose.model("Message", MessageSchema);