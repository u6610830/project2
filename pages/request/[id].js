import { useEffect, useState } from "react";
import { useRouter } from "next/router";

export default function RequestDetail() {
  const router = useRouter();
  const { id } = router.query;

  const [request, setRequest] = useState(null);
  const [user, setUser] = useState(null);

  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("token")
      : null;

  // Decode user
  useEffect(() => {
    if (!token) return;
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      setUser(payload);
    } catch (err) {
      console.error("Invalid token");
    }
  }, [token]);

  // Fetch request
  useEffect(() => {
    if (!id || !token) return;

    const fetchRequest = async () => {
      const res = await fetch(`/api/request/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      if (res.ok) setRequest(data);
    };

    fetchRequest();
  }, [id, token]);

  const handleConfirm = async () => {
    const res = await fetch(`/api/request/${id}`, {
      method: "PUT",
      headers: { Authorization: `Bearer ${token}` },
    });

    if (res.ok) router.reload();
  };

  const handleCancel = async () => {
    const res = await fetch(`/api/request/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    if (res.ok) router.push("/dashboard");
  };

  if (!request) return <div style={{ padding: 30 }}>Loading...</div>;

  return (
    <div style={{ padding: "40px", display: "flex", justifyContent: "center" }}>
      <div
        style={{
          width: "600px",
          backgroundColor: "#fff",
          padding: "30px",
          borderRadius: "10px",
          boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
        }}
      >
        <h2 style={{ marginBottom: "20px" }}>Request Detail</h2>

        <div style={{ marginBottom: "15px" }}>
          <strong>Product:</strong>
          <div>{request.title}</div>
        </div>

        <div style={{ marginBottom: "15px" }}>
          <strong>Specifications:</strong>
          <div>{request.specifications}</div>
        </div>

        <div style={{ marginBottom: "20px" }}>
          <strong>Status:</strong>
          <div
            style={{
              marginTop: "5px",
              padding: "6px 12px",
              display: "inline-block",
              borderRadius: "20px",
              backgroundColor:
                request.status === "Confirmed"
                  ? "#d4edda"
                  : request.status === "Cancelled"
                  ? "#f8d7da"
                  : "#fff3cd",
              color:
                request.status === "Confirmed"
                  ? "#155724"
                  : request.status === "Cancelled"
                  ? "#721c24"
                  : "#856404",
            }}
          >
            {request.status}
          </div>
        </div>

        {/* Open Chat Button */}
        {(user?.role === "customer" || user?.role === "supplier") && (
          <button
            onClick={() => router.push(`/messages/${request._id}`)}
            style={{
              padding: "10px 18px",
              backgroundColor: "#1f3c88",
              color: "white",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
              marginBottom: "20px",
            }}
          >
            Open Chat
          </button>
        )}

        {/* Quotation Section */}
        {request.quotation && (
          <div
            style={{
              marginTop: "20px",
              padding: "20px",
              border: "1px solid #ddd",
              borderRadius: "8px",
              backgroundColor: "#f9f9f9",
            }}
          >
            <h3 style={{ marginBottom: "15px" }}>Quotation Details</h3>

            <p>
              <strong>Price Per Unit:</strong>{" "}
              {request.quotation.pricePerUnit}
            </p>
            <p>
              <strong>Total Price:</strong>{" "}
              {request.quotation.totalPrice}
            </p>
            <p>
              <strong>Lead Time (Days):</strong>{" "}
              {request.quotation.leadTimeDays}
            </p>
            <p>
              <strong>Message:</strong>{" "}
              {request.quotation.message}
            </p>
          </div>
        )}

        {/* Customer Actions */}
        {user?.role === "customer" &&
          request.status === "Quoted" && (
            <div style={{ marginTop: "20px" }}>
              <button
                onClick={handleConfirm}
                style={{
                  padding: "8px 16px",
                  marginRight: "10px",
                }}
              >
                Confirm Order
              </button>

              <button
                onClick={handleCancel}
                style={{
                  padding: "8px 16px",
                }}
              >
                Cancel
              </button>
            </div>
        )}

        {/* Supplier Action */}
        {user?.role === "supplier" &&
          request.status === "Pending" && (
            <div style={{ marginTop: "20px" }}>
              <button
                onClick={() =>
                  router.push(
                    `/quotation/create?oemRequestId=${request._id}`
                  )
                }
              >
                Submit Quotation
              </button>
            </div>
        )}
      </div>
    </div>
  );
}