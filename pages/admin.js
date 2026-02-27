import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";

export default function Admin() {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");

    fetch("/api/oem", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setRequests(data));
  }, []);

  const total = requests.length;
  const approved = requests.filter(r => r.status === "approved").length;
  const rejected = requests.filter(r => r.status === "rejected").length;
  const pending = requests.filter(r => r.status === "pending").length;

  return (
    <>
      <Navbar />
      <div className="page-container">
        <div className="card">
          <h1 className="title">Admin Overview</h1>
          <p>Total Requests: {total}</p>
          <p>Approved: {approved}</p>
          <p>Rejected: {rejected}</p>
          <p>Pending: {pending}</p>
        </div>
      </div>
    </>
  );
}