import dbConnect from "../../../lib/dbConnect";
import OEMRequest from "../../../models/OEMRequest";
import SupplierProfile from "../../../models/SupplierProfile";
import jwt from "jsonwebtoken";

export default async function handler(req, res) {
  await dbConnect();

  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Unauthorized" });

  try {
    jwt.verify(token, process.env.JWT_SECRET);
  } catch {
    return res.status(401).json({ message: "Invalid token" });
  }

  const { requestId } = req.query;

  try {
    const request = await OEMRequest.findById(requestId);
    if (!request)
      return res.status(404).json({ message: "Request not found" });

    const matchedSuppliers = await SupplierProfile.find({
      categories: request.category,
      minimumOrderQuantity: { $lte: request.quantity },
      capacityPerMonth: { $gte: request.quantity },
      verified: true,
    }).populate("userId", "email role");

    return res.status(200).json(matchedSuppliers);
  } catch (err) {
    return res.status(500).json({ message: "Matching failed" });
  }
}