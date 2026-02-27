import dbConnect from "../../../lib/dbConnect";
import OEMRequest from "../../../models/OEMRequest";
import jwt from "jsonwebtoken";
import Quotation from "../../../models/Quotation";

export default async function handler(req, res) {
  await dbConnect();

  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch {
      return res.status(401).json({ message: "Invalid token" });
    }

    const { id } = req.query;

    // ================= GET ONE REQUEST =================
    if (req.method === "GET") {
      const request = await OEMRequest.findById(id)
        .populate("quotation"); // 🔥 THIS makes quotation appear

      if (!request) {
        return res.status(404).json({ message: "Request not found" });
      }

      return res.status(200).json(request);
    }

    // ================= PUT (Confirm Request) =================
    if (req.method === "PUT") {
      const request = await OEMRequest.findById(id);

      if (!request) {
        return res.status(404).json({ message: "Request not found" });
      }

      if (request.status !== "Quoted") {
        return res.status(400).json({
          message: "Only quoted requests can be confirmed",
        });
      }

      const updated = await OEMRequest.findByIdAndUpdate(
        id,
        { status: "Confirmed" },
        { new: true }
      );

      return res.status(200).json(updated);
    }

    // ================= DELETE (Cancel Request) =================
    if (req.method === "DELETE") {
      const request = await OEMRequest.findById(id);

      if (!request) {
        return res.status(404).json({ message: "Request not found" });
      }

      if (request.status === "Confirmed") {
        return res.status(400).json({
          message: "Cannot cancel confirmed request",
        });
      }

      const updated = await OEMRequest.findByIdAndUpdate(
        id,
        { status: "Cancelled" },
        { new: true }
      );

      return res.status(200).json(updated);
    }

    return res.status(405).json({ message: "Method not allowed" });

  } catch (err) {
    console.error("REQUEST DETAIL ERROR:", err);
    return res.status(500).json({
      message: "Request API error",
      error: err.message,
    });
  }
}