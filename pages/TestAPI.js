import React, { useState } from "react";
import axios from "axios";

export default function TestAPI() {
  const [result, setResult] = useState("");

  const callBackend = async () => {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/events`
      );
      setResult(JSON.stringify(res.data, null, 2));
    } catch (err) {
      setResult(`❌ Error: ${err.response?.data?.message || err.message}`);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Frontend → Backend Test</h2>
      <button onClick={callBackend}>Call /events</button>
      <pre>{result}</pre>
    </div>
  );
}
