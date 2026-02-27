import dbConnect from "../../../lib/dbConnect";
import Product from "../../../models/Products";
import jwt from "jsonwebtoken";

export default async function handler(req, res) {
  await dbConnect();

  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Unauthorized" });

  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const userId = decoded.id;
  const role = decoded.role;

  // CREATE PRODUCT (seller only)
  if (req.method === "POST") {
    if (role !== "seller") {
      return res.status(403).json({ message: "Only sellers can create products" });
    }

    try {
      const product = await Product.create({
        ...req.body,
        createdBy: userId,
      });

      return res.status(201).json(product);
    } catch (err) {
      return res.status(500).json({ message: "Product creation failed" });
    }
  }

  // GET ALL PRODUCTS
  if (req.method === "GET") {
    const products = await Product.find();
    return res.status(200).json(products);
  }

  return res.status(405).json({ message: "Method not allowed" });
}