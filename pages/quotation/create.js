import { useRouter } from "next/router";
import { useState } from "react";

export default function CreateQuotation() {
  const router = useRouter();
  const { oemRequestId } = router.query;

  const [pricePerUnit, setPricePerUnit] = useState("");
  const [totalPrice, setTotalPrice] = useState("");
  const [leadTimeDays, setLeadTimeDays] = useState("");
  const [message, setMessage] = useState("");

  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("token")
      : null;

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch("/api/quotation", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        oemRequestId,
        pricePerUnit,
        totalPrice,
        leadTimeDays,
        message,
      }),
    });

    const data = await res.json();

    if (res.ok) {
      alert("Quotation submitted!");
      router.push(`/request/${oemRequestId}`);
    } else {
      alert(data.message || "Failed to submit quotation");
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        padding: "40px 20px",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "500px",
          background: "white",
          padding: "30px",
          borderRadius: "8px",
          boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
        }}
      >
        <h2 style={{ marginBottom: "25px", textAlign: "center" }}>
          Submit Quotation
        </h2>

        <form onSubmit={handleSubmit}>
          {/* Price Per Unit */}
          <div style={{ marginBottom: "20px" }}>
            <label style={{ fontWeight: "bold" }}>
              Price Per Unit
            </label>
            <input
              type="number"
              value={pricePerUnit}
              onChange={(e) =>
                setPricePerUnit(e.target.value)
              }
              required
              style={inputStyle}
            />
          </div>

          {/* Total Price */}
          <div style={{ marginBottom: "20px" }}>
            <label style={{ fontWeight: "bold" }}>
              Total Price
            </label>
            <input
              type="number"
              value={totalPrice}
              onChange={(e) =>
                setTotalPrice(e.target.value)
              }
              required
              style={inputStyle}
            />
          </div>

          {/* Lead Time */}
          <div style={{ marginBottom: "20px" }}>
            <label style={{ fontWeight: "bold" }}>
              Lead Time (Days)
            </label>
            <input
              type="number"
              value={leadTimeDays}
              onChange={(e) =>
                setLeadTimeDays(e.target.value)
              }
              required
              style={inputStyle}
            />
          </div>

          {/* Message */}
          <div style={{ marginBottom: "25px" }}>
            <label style={{ fontWeight: "bold" }}>
              Message
            </label>
            <textarea
              value={message}
              onChange={(e) =>
                setMessage(e.target.value)
              }
              style={{
                ...inputStyle,
                minHeight: "100px",
              }}
            />
          </div>

          <button type="submit" style={buttonStyle}>
            Submit Quotation
          </button>
        </form>
      </div>
    </div>
  );
}

const inputStyle = {
  width: "100%",
  padding: "10px",
  marginTop: "8px",
  borderRadius: "4px",
  border: "1px solid #ccc",
};

const buttonStyle = {
  width: "100%",
  padding: "12px",
  background: "#0070f3",
  color: "white",
  border: "none",
  borderRadius: "4px",
  cursor: "pointer",
  fontWeight: "bold",
};