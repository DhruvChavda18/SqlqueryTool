import React, { useState } from "react";
import "./App.css";
import QueryInput from "./components/QueryInput";
import SavePage from "./components/SavePage";
import SavedPages from "./components/SavedPages";
import axios from "axios"; // add this line

function App() {
  const [query, setQuery] = useState("");
  const [result, setResult] = useState([]);

  // ADD this function to handle opening saved queries
  const handleOpenQuery = async (pageId) => {
    try {
      const response = await axios.get(
        `http://localhost:8082/api/pages/${pageId}`
      );
      const { query, result } = response.data;
      setQuery(query);
      setResult(result);
    } catch (err) {
      alert("Failed to execute saved query");
    }
  };

  return (
    <div className="App">
      <h2>SQL Query Tool</h2>
      <QueryInput setQuery={setQuery} onResult={setResult} />
      <SavePage query={query} />
      <SavedPages onOpenQuery={handleOpenQuery} /> {/* add this line */}
      <hr />
      <h3>Query Result:</h3>
      <table border="1" style={{ width: "100%", marginTop: "10px" }}>
        <thead>
          {result.length > 0 && (
            <tr>
              {Object.keys(result[0]).map((key) => (
                <th key={key}>{key}</th>
              ))}
            </tr>
          )}
        </thead>
        <tbody>
          {result.map((row, idx) => (
            <tr key={idx}>
              {Object.values(row).map((val, i) => (
                <td key={i}>{val}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
