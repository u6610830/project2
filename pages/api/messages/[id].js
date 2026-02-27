import dbConnect from "../../../lib/dbConnect";
import Message from "../../../models/Message";
import jwt from "jsonwebtoken";

export default async function handler(req, res) {
  await dbConnect();

  const { id } = req.query;

  const token = req.headers.authorization?.split(" ")[1];
  if (!token)
    return res.status(401).json({ message: "Unauthorized" });

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch {
    return res.status(401).json({ message: "Invalid token" });
  }

  const userId = decoded.id;

  const message = await Message.findById(id);

  if (!message) {
    return res.status(404).json({ message: "Message not found" });
  }

  if (message.senderId.toString() !== userId) {
    return res.status(403).json({ message: "Not authorized" });
  }

  if (req.method === "DELETE") {
    await message.deleteOne();
    return res.status(200).json({ message: "Message deleted" });
  }

  return res.status(405).json({ message: "Method not allowed" });
}