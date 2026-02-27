import dbConnect from "../../../lib/dbConnect";
import Quotation from "../../../models/Quotation";
import OEMRequest from "../../../models/OEMRequest";
import jwt from "jsonwebtoken";

export default async function handler(req, res) {
  await dbConnect();

  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Unauthorized - No token" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;
    const role = decoded.role;

    const { id } = req.query; // quotationId

    // ========================
    // ACCEPT QUOTATION
    // ========================
    if (req.method === "PUT") {

      if (role !== "customer") {
        return res.status(403).json({
          message: "Only customers can accept quotations",
        });
      }

      const quotation = await Quotation.findById(id);
      if (!quotation) {
        return res.status(404).json({ message: "Quotation not found" });
      }

      const request = await OEMRequest.findById(quotation.oemRequestId);
      if (!request) {
        return res.status(404).json({ message: "OEM Request not found" });
      }

      // Make sure customer owns this request
      if (request.createdBy.toString() !== userId) {
        return res.status(403).json({
          message: "You are not owner of this request",
        });
      }

      // Update quotation status
      quotation.status = "Accepted";
      await quotation.save();

      // Reject other quotations
      await Quotation.updateMany(
        {
          oemRequestId: quotation.oemRequestId,
          _id: { $ne: quotation._id },
        },
        { status: "Rejected" }
      );

      // Update request status
      request.status = "Confirmed";
      request.assignedSupplier = quotation.supplierId;
      await request.save();

      return res.status(200).json({
        message: "Quotation accepted successfully",
      });
    }

    return res.status(405).json({ message: "Method not allowed" });

  } catch (err) {
    console.error("ACCEPT ERROR:", err);
    return res.status(500).json({
      message: "Accept quotation failed",
      error: err.message,
    });
  }
}