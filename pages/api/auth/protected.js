import connectDB from "../../../lib/mongodb";
import jwt from "jsonwebtoken";

export default async function handler(req, res) {
  await connectDB();

  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: "No token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    return res.status(200).json({
      message: "Access granted",
      user: decoded,
    });
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
}