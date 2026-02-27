import dbConnect from "../../lib/dbConnect";
import OEMRequest from "../../models/OEMRequest";
import Quotation from "../../models/Quotation";
import jwt from "jsonwebtoken";

export default async function handler(req, res) {
  await dbConnect();

  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;
    const role = decoded.role;

    if (role === "customer") {
      const total = await OEMRequest.countDocuments({
        createdBy: userId,
      });

      const pending = await OEMRequest.countDocuments({
        createdBy: userId,
        status: "Pending",
      });

      const quoted = await OEMRequest.countDocuments({
        createdBy: userId,
        status: "Quoted",
      });

      const confirmed = await OEMRequest.countDocuments({
        createdBy: userId,
        status: "Confirmed",
      });

      return res.status(200).json({
        role: "Customer",
        totalRequests: total,
        pendingRequests: pending,
        quotedRequests: quoted,
        confirmedOrders: confirmed,
      });
    }

    if (role === "supplier") {
      const total = await Quotation.countDocuments({
        supplierId: userId,
      });

      const accepted = await Quotation.countDocuments({
        supplierId: userId,
        status: "Accepted",
      });

      const rejected = await Quotation.countDocuments({
        supplierId: userId,
        status: "Rejected",
      });

      return res.status(200).json({
        role: "Supplier",
        totalQuotations: total,
        acceptedQuotations: accepted,
        rejectedQuotations: rejected,
        activeDeals: accepted,
      });
    }

    return res.status(400).json({ message: "Invalid role" });

  } catch (err) {
    console.error("DASHBOARD ERROR:", err);
    return res.status(500).json({
      message: "Dashboard failed",
      error: err.message,
    });
  }
}