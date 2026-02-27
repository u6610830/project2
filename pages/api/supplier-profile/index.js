import dbConnect from "../../../lib/dbConnect";
import SupplierProfile from "../../../models/SupplierProfile";
import jwt from "jsonwebtoken";

export default async function handler(req, res) {
  await dbConnect();

  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Unauthorized" });

  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const userId = decoded.id;
  const role = decoded.role;

  if (req.method === "GET") {
    try {
      if (role === "supplier") {
        const profile = await SupplierProfile.findOne({ userId });
        return res.status(200).json(profile);
      }

      if (role === "admin") {
        const profiles = await SupplierProfile.find().populate("userId", "email");
        return res.status(200).json(profiles);
      }

      return res.status(403).json({ message: "Not allowed" });
    } catch (err) {
      return res.status(500).json({ message: "Server error" });
    }
  }

  if (req.method === "POST") {
    if (role !== "supplier") {
      return res.status(403).json({ message: "Only suppliers can create profile" });
    }

    try {
      const existing = await SupplierProfile.findOne({ userId });
      if (existing) {
        return res.status(400).json({ message: "Profile already exists" });
      }

      const profile = await SupplierProfile.create({
        ...req.body,
        userId,
      });

      return res.status(201).json(profile);
    } catch (err) {
      return res.status(500).json({ message: "Creation failed" });
    }
  }

  if (req.method === "PUT") {
    if (role !== "supplier") {
      return res.status(403).json({ message: "Only suppliers can update profile" });
    }

    try {
      const updated = await SupplierProfile.findOneAndUpdate(
        { userId },
        req.body,
        { new: true }
      );

      return res.status(200).json(updated);
    } catch (err) {
      return res.status(500).json({ message: "Update failed" });
    }
  }

  return res.status(405).json({ message: "Method not allowed" });
}