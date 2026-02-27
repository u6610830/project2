/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState } from "react";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [stockQuantity, setStockQuantity] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");

  const token = typeof window !== "undefined" && localStorage.getItem("token");

  const fetchProducts = async () => {
    const res = await fetch("/api/products", {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setProducts(data);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const createProduct = async () => {
    await fetch("/api/products", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        name,
        price,
        stockQuantity,
        category,
        description,
      }),
    });

    fetchProducts();
  };

  return (
    <div>
      <h1>Products</h1>

      <h3>Create Product</h3>
      <input placeholder="Name" onChange={(e) => setName(e.target.value)} />
      <input placeholder="Price" onChange={(e) => setPrice(e.target.value)} />
      <input placeholder="Stock" onChange={(e) => setStockQuantity(e.target.value)} />
      <input placeholder="Category" onChange={(e) => setCategory(e.target.value)} />
      <input placeholder="Description" onChange={(e) => setDescription(e.target.value)} />
      <button onClick={createProduct}>Create</button>

      <h3>All Products</h3>
      {products.map((p) => (
        <div key={p._id}>
          {p.name} - ${p.price}
        </div>
      ))}
    </div>
  );
}