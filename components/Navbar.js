import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function Navbar() {
  const router = useRouter();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      try {
        const decoded = JSON.parse(atob(token.split(".")[1]));
        setUser(decoded);
      } catch {
        setUser(null);
      }
    } else {
      setUser(null);
    }
  }, [router.pathname]); 

  const logout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  if (!user) return null;

  return (
    <div className="navbar">
      <div className="navbar-inner">
        <div className="nav-left">
          <button onClick={() => router.push("/request")}>
            Requests
          </button>
          <button onClick={() => router.push("/dashboard")}>
            Dashboard
          </button>
          <button onClick={() => router.push("/messages")}>
            Messages
          </button>
        </div>

        <div className="nav-right">
          <span className="nav-role">
            {user.role.charAt(0).toUpperCase() +
              user.role.slice(1)}
          </span>
          <button onClick={logout}>Logout</button>
        </div>
      </div>
    </div>
  );
}