import dbConnect from "../../../lib/dbConnect";
import Message from "../../../models/Message";
import jwt from "jsonwebtoken";

export default async function handler(req, res) {
  await dbConnect();

  res.setHeader("Cache-Control", "no-store");

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

  const userId = decoded.id;

  // ===== GET =====
  if (req.method === "GET") {
    const { oemRequestId } = req.query;

    if (!oemRequestId) {
      return res.status(400).json({ message: "Missing oemRequestId" });
    }

    const messages = await Message.find({ oemRequestId })
       .populate("senderId", "role email") // 🔥 THIS LINE
       .sort({ createdAt: 1 });

    return res.status(200).json(messages);
   }
  // ===== POST =====
  if (req.method === "POST") {
    const { oemRequestId, content } = req.body;

    if (!oemRequestId || !content) {
      return res.status(400).json({ message: "Missing fields" });
    }

    const message = await Message.create({
      oemRequestId,
      senderId: userId,
      content,
    });

    return res.status(201).json(message);
  }

  return res.status(405).json({ message: "Method not allowed" });
}