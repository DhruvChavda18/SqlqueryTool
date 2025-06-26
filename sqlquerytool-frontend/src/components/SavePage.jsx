import React, { useState } from "react";
import axios from "axios";

const SavePage = ({ query }) => {
  const [pageName, setPageName] = useState("");
  const [status, setStatus] = useState("");

  const handleSaveQuery = async () => {
    setStatus("");

    if (!/^select\s/i.test(query.trim())) {
      setStatus("Only SELECT queries can be saved.");
      return;
    }

    if (!pageName.trim()) {
      setStatus("Page name is required.");
      return;
    }

    try {
      await axios.post("http://localhost:8082/api/saveQuery", {
        pageName,
        query,
      });
      setStatus("Query saved successfully!");
    } catch (err) {
      setStatus("Failed to save query.");
    }
  };

  return (
    <div>
      <label>
        <strong>Page Name:</strong>
      </label>
      <input
        type="text"
        value={pageName}
        onChange={(e) => setPageName(e.target.value)}
        placeholder="e.g., All Employees"
        style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
      />
      <button onClick={handleSaveQuery}>Save Page</button>
      {status && (
        <p style={{ color: status.includes("success") ? "green" : "red" }}>
          {status}
        </p>
      )}
    </div>
  );
};

export default SavePage;
