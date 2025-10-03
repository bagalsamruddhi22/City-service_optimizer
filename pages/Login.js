// src/pages/Login.js
import React, { useState } from "react";
import API from "../services/api";
import { setToken } from "../utils/auth";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      // Because your backend index.js mounts: app.use("/api", authRoutes);
      // and auth.js has router.post("/login"...),
      // the full URL is /api/login
      const res = await API.post("/login", { email, password });

      // Save JWT token
      setToken(res.data.token);

      // Save user info for Dashboard display
      if (res.data.user) {
        localStorage.setItem("user", JSON.stringify(res.data.user));
      }

      // Redirect to dashboard
      window.location.href = "/dashboard";
    } catch (err) {
      console.error("Login error:", err);
      setError(err.response?.data?.message || "Login failed. Please try again.");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          autoComplete="username"
          onChange={(e) => setEmail(e.target.value.trim())}
          required
        /><br/><br/>
        <input
          type="password"
          placeholder="Password"
          value={password}
          autoComplete="current-password"
          onChange={(e) => setPassword(e.target.value)}
          required
        /><br/><br/>
        <button type="submit">Login</button>
      </form>

      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}
