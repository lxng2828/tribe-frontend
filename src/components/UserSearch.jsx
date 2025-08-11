import React, { useState } from "react";
import axios from "axios";

const UserSearch = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleChange = async (e) => {
    const value = e.target.value;
    setQuery(value);
    if (value.trim() === "") {
      setResults([]);
      return;
    }
    setLoading(true);
    try {
      const res = await axios.get(`/api/users/search-by-name?name=${encodeURIComponent(value)}`);
      setResults(res.data);
    } catch (err) {
      setResults([]);
    }
    setLoading(false);
  };

  return (
    <div style={{ position: "relative", width: 350 }}>
      <input
        type="text"
        placeholder="Tìm kiếm người dùng..."
        value={query}
        onChange={handleChange}
        style={{ width: "100%", padding: 8, borderRadius: 4, border: "1px solid #ccc" }}
      />
      {loading && <div style={{ color: '#888', marginTop: 4 }}>Đang tìm...</div>}
      {results.length > 0 && (
        <div
          style={{
            position: "absolute",
            top: 40,
            left: 0,
            width: "100%",
            background: "#222",
            color: "#fff",
            borderRadius: 8,
            boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
            zIndex: 10,
            maxHeight: 400,
            overflowY: "auto",
          }}
        >
          {results.map((user) => (
            <div
              key={user.id}
              style={{
                display: "flex",
                alignItems: "center",
                padding: 10,
                borderBottom: "1px solid #333",
                cursor: "pointer",
              }}
            >
              <img
                src={user.avatarUrl || "/default-avatar.png"}
                alt={user.displayName}
                style={{ width: 40, height: 40, borderRadius: "50%", marginRight: 12 }}
              />
              <div>
                <div style={{ fontWeight: 500 }}>{user.displayName}</div>
                <div style={{ fontSize: 12, color: "#aaa" }}>{user.email}</div>
                <div style={{ fontSize: 12, color: user.status === 'active' ? '#4ade80' : '#f87171' }}>{user.status}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserSearch; 