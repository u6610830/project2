import dbConnect from "../../../lib/dbConnect";
import SupplierProfile from "../../../models/SupplierProfile";
import jwt from "jsonwebtoken";

export default async function handler(req, res) {
  await dbConnect();

  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Unauthorized" });

  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const role = decoded.role;

  if (role !== "admin") {
    return res.status(403).json({ message: "Only admin can verify suppliers" });
  }

  const { id } = req.query;

  if (req.method === "PUT") {
    const updated = await SupplierProfile.findByIdAndUpdate(
      id,
      { verified: true },
      { new: true }
    );

    return res.status(200).json(updated);
  }

  return res.status(405).json({ message: "Method not allowed" });
}