import React, { useState } from "react";
import "./App.css";
import QueryInput from "./components/QueryInput";
import SavePage from "./components/SavePage";

function App() {
  const [query, setQuery] = useState("");
  const [result, setResult] = useState([]);

  return (
    <div className="App">
      <h2>SQL Query Tool</h2>
      <QueryInput setQuery={setQuery} onResult={setResult} />

      <SavePage query={query} />
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
