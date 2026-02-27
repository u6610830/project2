import dbConnect from "../../../lib/dbConnect";
import OEMRequest from "../../../models/OEMRequest";
import jwt from "jsonwebtoken";

export default async function handler(req, res) {
  await dbConnect();

  if (req.method !== "PUT") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    jwt.verify(token, process.env.JWT_SECRET);

    const { requestId } = req.body;

    const request = await OEMRequest.findById(requestId);
    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    if (request.status !== "Pending" && request.status !== "Quoted") {
      return res.status(400).json({
        message: "Only pending or quoted requests can be confirmed",
      });
    }

    // ✅ IMPORTANT FIX — no .save()
    await OEMRequest.findByIdAndUpdate(requestId, {
      status: "Confirmed",
    });

    return res.status(200).json({
      message: "Request confirmed successfully",
    });

  } catch (err) {
    console.error("CONFIRM ERROR:", err);
    return res.status(500).json({
      message: "Confirm API error",
      error: err.message,
    });
  }
}