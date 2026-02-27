/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState } from "react";

export default function SupplierProfile() {
  const [profile, setProfile] = useState(null);
  const token = typeof window !== "undefined" && localStorage.getItem("token");

  const fetchProfile = async () => {
    const res = await fetch("/api/supplier-profile", {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setProfile(data);
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  return (
    <div>
      <h1>Supplier Profile</h1>

      {profile && (
        <div>
          <p>Categories: {profile.categories?.join(", ")}</p>
          <p>MOQ: {profile.minimumOrderQuantity}</p>
          <p>Verified: {profile.verified ? "Yes" : "No"}</p>
        </div>
      )}
    </div>
  );
}