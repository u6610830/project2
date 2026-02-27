import dbConnect from "../../../lib/dbConnect";
import OEMRequest from "../../../models/OEMRequest";
import jwt from "jsonwebtoken";

export default async function handler(req, res) {
  await dbConnect();

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

  // ================= GET =================
  if (req.method === "GET") {
    try {
      let requests;

      if (decoded.role === "customer") {
        requests = await OEMRequest.find({
          customerId: decoded.id, // ✅ fixed
        });
      } else {
        requests = await OEMRequest.find();
      }

      return res.status(200).json(requests);

    } catch (err) {
      console.error("FETCH ERROR:", err);
      return res.status(500).json({ message: "Fetch failed" });
    }
  }

  // ================= POST =================
  if (req.method === "POST") {
    try {
      const { title, specifications } = req.body;

      if (!title || !specifications) {
        return res.status(400).json({
          message: "All fields are required",
        });
      }

      const newRequest = await OEMRequest.create({
        title,
        specifications,
        customerId: decoded.id,
        status: "Pending",
      });

      return res.status(201).json(newRequest);

    } catch (error) {
      console.error("CREATE REQUEST ERROR:", error);
      return res.status(500).json({
        message: "Create failed",
        error: error.message,
      });
    }
  }

  return res.status(405).json({ message: "Method not allowed" });
}