import dbConnect from "../../../lib/dbConnect";
import Quotation from "../../../models/Quotation";
import jwt from "jsonwebtoken";

export default async function handler(req, res) {
  await dbConnect();

  if (req.method !== "PUT")
    return res.status(405).json({ message: "Method not allowed" });

  const token = req.headers.authorization?.split(" ")[1];
  if (!token)
    return res.status(401).json({ message: "Unauthorized" });

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch {
    return res.status(401).json({ message: "Invalid token" });
  }

  const { quotationId } = req.body;

  const quotation = await Quotation.findById(quotationId);

  if (!quotation)
    return res.status(404).json({ message: "Not found" });

  quotation.status = "Accepted";
  await quotation.save();

  res.status(200).json({ message: "Accepted" });
}