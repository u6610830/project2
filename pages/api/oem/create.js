import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Navbar from "../../components/Navbar";

export default function CreateOEM() {
  const [productName, setProductName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [specifications, setSpecifications] = useState("");
  const [role, setRole] = useState(null);

  const router = useRouter();

  useEffect(() => {
    const storedRole = localStorage.getItem("role");
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/login");
      return;
    }

    if (storedRole !== "customer") {
      router.push("/oem");
      return;
    }

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setRole(storedRole);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");

    const res = await fetch("/api/oem", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        productName,
        quantity,
        specifications,
      }),
    });

    if (res.ok) {
      router.push("/oem");
    }
  };

  if (role === null) return null;

  return (
    <>
      <Navbar />

      <div className="page-container">
        <div className="card">
          <h1 className="title">Create OEM Request</h1>

          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Product Name"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              required
            />

            <input
              type="number"
              placeholder="Quantity"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              required
            />

            <input
              type="text"
              placeholder="Specifications"
              value={specifications}
              onChange={(e) => setSpecifications(e.target.value)}
              required
            />

            <button type="submit">
              Submit Request
            </button>
          </form>
        </div>
      </div>
    </>
  );
}