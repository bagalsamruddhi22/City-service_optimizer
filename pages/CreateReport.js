import React, { useState } from "react";
import API from "../services/api";

export default function CreateReport() {
  const [type, setType] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [locationLat, setLocationLat] = useState("");
  const [locationLng, setLocationLng] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    try {
      await API.post("/reports", {
        type,
        description,
        image_url: imageUrl,
        location_lat: parseFloat(locationLat),
        location_lng: parseFloat(locationLng),
      });
      setMessage("Report submitted successfully!");
      setType("");
      setDescription("");
      setImageUrl("");
      setLocationLat("");
      setLocationLng("");
      
      // Redirect to dashboard after 1.2 seconds
      setTimeout(() => {
        window.location.href = "/dashboard";
      }, 1200);
    } catch (error) {
      setMessage(`Submission failed: ${error.response?.data?.message || error.message}`);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Submit New Report</h2>
      <form onSubmit={handleSubmit}>
        <label>Type:</label><br />
        <input value={type} onChange={(e) => setType(e.target.value)} required /><br /><br />
        <label>Description:</label><br />
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} required /><br /><br />
        <label>Image URL (optional):</label><br />
        <input value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} /><br /><br />
        <label>Location Latitude:</label><br />
        <input type="number" value={locationLat} onChange={(e) => setLocationLat(e.target.value)} required /><br /><br />
        <label>Location Longitude:</label><br />
        <input type="number" value={locationLng} onChange={(e) => setLocationLng(e.target.value)} required /><br /><br />
        <button type="submit">Submit Report</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}
