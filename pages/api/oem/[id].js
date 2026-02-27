import dbConnect from "../../../lib/dbConnect";
import OEMRequest from "../../../models/OEMRequest";
import jwt from "jsonwebtoken";

export default async function handler(req, res) {
  await dbConnect();

  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Unauthorized" });

  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const userId = decoded.id;
  const role = decoded.role;

  const { id } = req.query;

  // Customer can cancel their own request
  if (req.method === "PUT") {
    if (role !== "customer") {
      return res.status(403).json({ message: "Not allowed" });
    }

    const request = await OEMRequest.findById(id);

    if (!request || request.createdBy.toString() !== userId) {
      return res.status(403).json({ message: "Not your request" });
    }

    request.status = "cancelled";
    await request.save();

    return res.status(200).json(request);
  }

  // Admin delete if needed
  if (req.method === "DELETE") {
    if (role !== "admin") {
      return res.status(403).json({ message: "Only admin can delete" });
    }

    await OEMRequest.findByIdAndDelete(id);
    return res.status(200).json({ message: "Deleted" });
  }

  return res.status(405).json({ message: "Method not allowed" });
}