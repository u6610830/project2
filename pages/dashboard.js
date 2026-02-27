import { useEffect, useState } from "react";

export default function Dashboard() {
  const [stats, setStats] = useState(null);

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  useEffect(() => {
    if (token) fetchDashboard();
  }, [token]);

  const fetchDashboard = async () => {
    const res = await fetch("/api/dashboard", {
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = await res.json();
    setStats(data);
  };

  if (!stats) return <p>Loading dashboard...</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h1>{stats.role} Dashboard</h1>
      <hr />

      {stats.role === "Customer" && (
        <>
          <p>Total Requests: {stats.totalRequests}</p>
          <p>Pending Requests: {stats.pendingRequests}</p>
          <p>Quoted Requests: {stats.quotedRequests}</p>
          <p>Confirmed Orders: {stats.confirmedOrders}</p>
        </>
      )}

      {stats.role === "Supplier" && (
        <>
          <p>Total Quotations: {stats.totalQuotations}</p>
          <p>Accepted Quotations: {stats.acceptedQuotations}</p>
          <p>Rejected Quotations: {stats.rejectedQuotations}</p>
          <p>Active Deals: {stats.activeDeals}</p>
        </>
      )}
    </div>
  );
}