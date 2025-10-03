import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../services/api";
import { removeToken, getToken } from "../utils/auth";

export default function Dashboard() {
  const [notifications, setNotifications] = useState([]);
  const [myReports, setMyReports] = useState([]);
  const [user, setUser] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);

  // Load user info from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  // Fetch notifications and reports when user changes
  useEffect(() => {
    if (getToken() && user) {
      fetchNotifications();
      if (user.role === "official") {
        // Officials see all reports
        API.get("/reports")
          .then((res) => setMyReports(res.data))
          .catch((err) => console.error("Reports fetch error:", err));
      } else {
        // Citizens see only their reports
        API.get("/reports/mine")
          .then((res) => setMyReports(res.data))
          .catch((err) => console.error("Reports fetch error:", err));
      }
    }
  }, [user]);

  // Periodically refresh notifications every 60 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      if (getToken() && user) {
        fetchNotifications();
      }
    }, 60000);
    return () => clearInterval(interval);
  }, [user]);

  // Fetch notifications helper
  const fetchNotifications = () => {
    API.get("/notifications")
      .then((res) => {
        setNotifications(res.data);
        const unread = res.data.filter((n) => !n.read).length;
        setUnreadCount(unread);
      })
      .catch((err) => console.error("Notifications fetch error:", err));
  };

  // Mark notification as read
  const markNotificationAsRead = async (notificationId) => {
    try {
      await API.patch(`/notifications/${notificationId}/read`);
      setNotifications((prev) =>
        prev.map((n) => (n.id === notificationId ? { ...n, read: true } : n))
      );
      setUnreadCount((prev) => (prev > 0 ? prev - 1 : 0));
    } catch (error) {
      console.error("Failed to mark notification as read", error);
    }
  };

  // Logout handler
  const handleLogout = () => {
    removeToken();
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  // Update report status (official only)
  const updateReportStatus = async (reportId, newStatus) => {
    try {
      await API.patch(`/reports/${reportId}/status`, { status: newStatus });
      setMyReports((prevReports) =>
        prevReports.map((report) =>
          report.id === reportId ? { ...report, status: newStatus } : report
        )
      );
    } catch (error) {
      alert(
        `Failed to update status: ${
          error.response?.data?.message || error.message
        }`
      );
    }
  };

  if (!user) return <p>Loading Dashboard...</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h2>Welcome to Dashboard 🚀</h2>
      <p>
        Logged in as: <strong>{user.name}</strong> ({user.email})<br />
        Role: <strong>{user.role}</strong>
      </p>

      {/* Logout and Create Report buttons */}
      <button onClick={handleLogout} style={{ marginRight: "10px" }}>
        Logout
      </button>
      <Link to="/create-report">
        <button style={{ marginRight: "10px" }}>Create New Report</button>
      </Link>

      {/* Suggestion buttons */}
      <Link to="/create-suggestion">
        <button style={{ marginRight: "10px" }}>Create Suggestion</button>
      </Link>
      <Link to="/suggestions">
        <button>View Suggestions</button>
      </Link>

      <h3>
        Your Notifications{" "}
        {unreadCount > 0 && (
          <span
            style={{
              backgroundColor: "red",
              color: "white",
              borderRadius: "50%",
              padding: "4px 8px",
              fontSize: "14px",
              marginLeft: "8px",
            }}
          >
            {unreadCount}
          </span>
        )}
      </h3>
      {notifications.length ? (
        <ul>
          {notifications.map((n) => (
            <li
              key={n.id}
              style={{ fontWeight: n.read ? "normal" : "bold", cursor: "pointer" }}
              onClick={() => markNotificationAsRead(n.id)}
            >
              {n.message}
            </li>
          ))}
        </ul>
      ) : (
        <p>No notifications found.</p>
      )}

      <h3>My Reports</h3>
      {myReports.length ? (
        <ul>
          {myReports.map((r) => (
            <li key={r.id} style={{ marginBottom: "10px" }}>
              <strong>{r.type}</strong> - {r.description} &nbsp;
              {user.role === "official" ? (
                <>
                  <label>
                    Status:{" "}
                    <select
                      value={r.status}
                      onChange={(e) => updateReportStatus(r.id, e.target.value)}
                    >
                      <option value="open">Open</option>
                      <option value="in_progress">In Progress</option>
                      <option value="resolved">Resolved</option>
                    </select>
                  </label>
                </>
              ) : (
                <>[{r.status}]</>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p>No reports found.</p>
      )}
    </div>
  );
}
