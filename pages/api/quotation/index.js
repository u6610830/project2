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

    // ================= GET =================
    if (req.method === "GET") {
      const { oemRequestId } = req.query;

      if (!oemRequestId) {
        return res.status(400).json({
          message: "oemRequestId query parameter is required",
        });
      }

      const quotations = await Quotation.find({ oemRequestId })
        .populate("supplierId", "email");

      return res.status(200).json(quotations);
    }

    // ================= POST =================
    if (req.method === "POST") {
      if (role !== "supplier") {
        return res.status(403).json({
          message: "Only suppliers can submit quotations",
        });
      }

      const {
        oemRequestId,
        pricePerUnit,
        totalPrice,
        leadTimeDays,
        message,
      } = req.body;

      if (!oemRequestId || !pricePerUnit || !totalPrice || !leadTimeDays) {
        return res.status(400).json({
          message: "Missing required fields",
        });
      }

      const request = await OEMRequest.findById(oemRequestId);
      if (!request) {
        return res.status(404).json({
          message: "OEM Request not found",
        });
      }

      const existingQuotation = await Quotation.findOne({
        oemRequestId,
        supplierId: userId,
      });

      if (existingQuotation) {
        return res.status(400).json({
          message: "You already submitted a quotation for this request",
        });
      }

      // 🔥 CREATE QUOTATION
      const quotation = await Quotation.create({
        oemRequestId,
        supplierId: userId,
        pricePerUnit,
        totalPrice,
        leadTimeDays,
        message,
        status: "Submitted",
      });

      // 🔥 IMPORTANT: LINK QUOTATION TO REQUEST
      await OEMRequest.findByIdAndUpdate(oemRequestId, {
        quotation: quotation._id,
        status: "Quoted",
      });

      return res.status(201).json(quotation);
    }

    return res.status(405).json({ message: "Method not allowed" });

  } catch (err) {
    console.error("QUOTATION ERROR:", err);
    return res.status(500).json({
      message: "Quotation API error",
      error: err.message,
    });
  }
}