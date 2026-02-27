import { useState } from "react";
import { useRouter } from "next/router";

export default function CreateRequest() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [specifications, setSpecifications] = useState("");

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const submitRequest = async () => {
    if (!title || !specifications)
      return alert("All fields required");

    const res = await fetch("/api/request", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        title,
        specifications,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.message);
      return;
    }

    router.push("/request");
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Create OEM Request</h1>

      <input
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <br /><br />

      <textarea
        placeholder="Specifications"
        value={specifications}
        onChange={(e) => setSpecifications(e.target.value)}
      />

      <br /><br />

      <button onClick={submitRequest}>Submit</button>
    </div>
  );
}