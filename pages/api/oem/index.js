import dbConnect from "../../../lib/dbConnect";
import OEMRequest from "../../../models/OEMRequest";
import jwt from "jsonwebtoken";

export default async function handler(req, res) {
  await dbConnect();

  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const userId = decoded.id;
  const role = decoded.role;

  if (req.method === "GET") {
    try {
      let requests;

      // 🔐 Role-based filtering
      if (role === "customer") {
        requests = await OEMRequest.find({ createdBy: userId });
      } else {
        // admin, seller, supplier can see all
        requests = await OEMRequest.find().populate("createdBy", "email role");
      }

      return res.status(200).json(requests);
    } catch (error) {
      return res.status(500).json({ message: "Server error" });
    }
  }

  if (req.method === "POST") {
    if (role !== "customer") {
      return res.status(403).json({ message: "Only customers can create requests" });
    }

    try {
      const newRequest = await OEMRequest.create({
        ...req.body,
        createdBy: userId,
      });

      return res.status(201).json(newRequest);
    } catch (error) {
      return res.status(500).json({ message: "Creation failed" });
    }
  }

  return res.status(405).json({ message: "Method not allowed" });
}