import React, { useState } from "react";
import API from "../services/api";
import { getToken } from "../utils/auth";

export default function SuggestionForm({ onSuccess }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    if (!title.trim()) {
      setError("Title is required");
      return;
    }
    setSubmitting(true);
    try {
      await API.post(
        "/suggestions",
        { title, description },
        { headers: { Authorization: `Bearer ${getToken()}` } }
      );
      setTitle("");
      setDescription("");
      if (onSuccess) onSuccess();
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    }
    setSubmitting(false);
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: "400px", margin: "auto" }}>
      <h3>Create Suggestion</h3>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <div>
        <label>
          Title*:<br />
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            disabled={submitting}
            style={{ width: "100%" }}
          />
        </label>
      </div>
      <div>
        <label>
          Description:<br />
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            disabled={submitting}
            style={{ width: "100%", minHeight: "80px" }}
          />
        </label>
      </div>
      <button type="submit" disabled={submitting} style={{ marginTop: "10px" }}>
        {submitting ? "Submitting..." : "Submit Suggestion"}
      </button>
    </form>
  );
}
