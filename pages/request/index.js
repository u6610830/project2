import { useEffect, useState } from "react";
import { useRouter } from "next/router";

export default function RequestList() {
  const [requests, setRequests] = useState([]);
  const router = useRouter();

  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("token")
      : null;

  const user =
    typeof window !== "undefined" && token
      ? JSON.parse(atob(token.split(".")[1]))
      : null;

  const fetchRequests = async () => {
    const res = await fetch("/api/request", {
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = await res.json();
    if (Array.isArray(data)) setRequests(data);
  };

  useEffect(() => {
    if (token) {
      fetchRequests();
    }
  }, [token]);

  if (!user) return null;

  return (
    <div className="page-container">
      <div className="card">
        <h2 className="title">OEM Requests</h2>

        {user?.role === "customer" && (
          <div style={{ marginBottom: "20px" }}>
            <button onClick={() => router.push("/request/create")}>
              + Create Request
            </button>
          </div>
        )}

        {requests.length === 0 && <p>No requests found</p>}

        <table>
          <thead>
            <tr>
              <th>Title</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {requests.map((r) => (
              <tr key={r._id}>
                <td>{r.title}</td>

                <td>
                  <span
                    className={`badge ${
                      r.status === "Confirmed"
                        ? "badge-approved"
                        : r.status === "Cancelled"
                        ? "badge-rejected"
                        : "badge-pending"
                    }`}
                  >
                    {r.status}
                  </span>
                </td>

                <td>
                  <button
                    onClick={() => router.push(`/request/${r._id}`)}
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}