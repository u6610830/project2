import { useState } from "react";
import { useRouter } from "next/router";
import Navbar from "../components/Navbar";

export default function CreateOEM() {
  const router = useRouter();
  const [productName, setProductName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [specifications, setSpecifications] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    await fetch("/api/oem", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ productName, quantity, specifications }),
    });

    router.push("/oem");
  };

  return (
    <>
      <Navbar />
      <div className="page-container">
        <div className="card">
          <h1 className="title">Create OEM Request</h1>
          <form onSubmit={submit}>
            <input
              placeholder="Product Name"
              required
              onChange={(e) => setProductName(e.target.value)}
            />
            <input
              type="number"
              placeholder="Quantity"
              required
              onChange={(e) => setQuantity(e.target.value)}
            />
            <input
              placeholder="Specifications"
              onChange={(e) => setSpecifications(e.target.value)}
            />
            <button type="submit">Submit Request</button>
          </form>
        </div>
      </div>
    </>
  );
}