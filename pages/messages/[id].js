import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function MessagesPage() {
  const router = useRouter();
  const { id } = router.query;

  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
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

  // Fetch messages
  const fetchMessages = async () => {
    if (!id || !token) return;

    try {
      const res = await fetch(
        `/api/messages?oemRequestId=${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          cache: "no-store",
        }
      );

      const data = await res.json();
      if (res.ok) {
        setMessages(data);
      }
    } catch (err) {
      console.error("Fetch failed");
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchMessages();
  }, [id]);

  // 🔥 Auto refresh every 2 seconds
  useEffect(() => {
    if (!id) return;

    const interval = setInterval(() => {
      fetchMessages();
    }, 2000);

    return () => clearInterval(interval);
  }, [id]);

  // Send message
  const handleSend = async () => {
    if (!newMessage.trim()) return;

    const res = await fetch("/api/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        oemRequestId: id,
        content: newMessage,
      }),
    });

    if (res.ok) {
      setNewMessage("");
      fetchMessages(); // instant update
    }
  };

  return (
    <div style={{ padding: "30px" }}>
      <h2>Messages</h2>

      <div
        style={{
          border: "1px solid #ccc",
          borderRadius: "6px",
          padding: "15px",
          height: "400px",
          overflowY: "auto",
          marginBottom: "15px",
          backgroundColor: "#fff",
        }}
      >
        {messages.length === 0 && <p>No messages yet</p>}

        {messages.map((msg) => (
          <div key={msg._id} style={{ marginBottom: "10px" }}>
            <strong>
              {msg.senderId?.role === "supplier"
                ? "Supplier"
                : "Customer"}
              :
            </strong>{" "}
            {msg.content}
          </div>
        ))}
      </div>

      <div style={{ display: "flex", gap: "10px" }}>
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type your message..."
          style={{
            flex: 1,
            padding: "8px",
            border: "1px solid #ccc",
            borderRadius: "4px",
          }}
        />

        <button
          onClick={handleSend}
          style={{
            padding: "8px 16px",
            backgroundColor: "#1f3c88",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Send
        </button>
      </div>
    </div>
  );
}