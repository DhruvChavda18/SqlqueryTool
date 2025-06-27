import React, { useState } from "react";
import axios from "axios";

const QueryInput = ({ onResult, setQuery }) => {
  // add setQuery here
  const [query, setLocalQuery] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    setError("");

    if (!query.trim().toLowerCase().startsWith("select")) {
      setError("Only SELECT queries are allowed.");
      return;
    }

    try {
      const response = await axios.post("http://localhost:8082/api/execute", {
        sqlQuery: query,
      });
      onResult(response.data);
      setQuery(query); // this line ensures App gets the query
    } catch (err) {
      setError(err.response?.data?.message || "Query failed.");
    }
  };

  return (
    <div>
      <label htmlFor="queryInput">
        <strong>Enter SQL SELECT Query:</strong>
      </label>
      <textarea
        id="queryInput"
        rows={4}
        value={query}
        onChange={(e) => setLocalQuery(e.target.value)}
        placeholder="e.g., SELECT * FROM employees"
      />
      <br />
      <button onClick={handleSubmit}>Run Query</button>
      {error && <p className="error">{error}</p>}
    </div>
  );
};

export default QueryInput;
