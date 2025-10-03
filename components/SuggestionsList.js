import React, { useEffect, useState } from "react";
import API from "../services/api";
import { getToken } from "../utils/auth";

export default function SuggestionsList({ user }) {
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchSuggestions = async () => {
    setLoading(true);
    setError(null);
    try {
      const endpoint = user.role === "official" ? "/suggestions" : "/suggestions/mine";
      const res = await API.get(endpoint, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      setSuggestions(res.data);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (user) fetchSuggestions();
  }, [user]);

  const updateStatus = async (id, newStatus) => {
    try {
      await API.patch(
        `/suggestions/${id}/status`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${getToken()}` } }
      );
      setSuggestions((prev) =>
        prev.map((s) => (s.id === id ? { ...s, status: newStatus } : s))
      );
    } catch (err) {
      alert(err.response?.data?.message || err.message);
    }
  };

  if (loading) return <p>Loading suggestions...</p>;
  if (error) return <p style={{ color: "red" }}>Error: {error}</p>;

  if (!suggestions.length) return <p>No suggestions found.</p>;

  return (
    <div>
      <h3>Suggestions</h3>
      <ul>
        {suggestions.map((s) => (
          <li key={s.id} style={{ marginBottom: "10px" }}>
            <strong>{s.title}</strong><br />
            <p>{s.description}</p>
            <div>
              Status:{" "}
              {user.role === "official" ? (
                <select
                  value={s.status}
                  onChange={(e) => updateStatus(s.id, e.target.value)}
                >
                  <option value="open">Open</option>
                  <option value="in_review">In Review</option>
                  <option value="resolved">Resolved</option>
                </select>
              ) : (
                <span>[{s.status}]</span>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
