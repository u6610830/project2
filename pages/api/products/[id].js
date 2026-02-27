import dbConnect from "../../../lib/dbConnect";
import Product from "../../../models/Products";
import jwt from "jsonwebtoken";

export default async function handler(req, res) {
  await dbConnect();

  const { id } = req.query;

  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Unauthorized" });

  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const role = decoded.role;

  // GET SINGLE PRODUCT
  if (req.method === "GET") {
    const product = await Product.findById(id);
    return res.status(200).json(product);
  }

  // UPDATE PRODUCT (seller only)
  if (req.method === "PUT") {
    if (role !== "seller") {
      return res.status(403).json({ message: "Only sellers can update products" });
    }

    const updated = await Product.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    return res.status(200).json(updated);
  }

  // DELETE PRODUCT (seller only)
  if (req.method === "DELETE") {
    if (role !== "seller") {
      return res.status(403).json({ message: "Only sellers can delete products" });
    }

    await Product.findByIdAndDelete(id);
    return res.status(200).json({ message: "Product deleted" });
  }

  return res.status(405).json({ message: "Method not allowed" });
}