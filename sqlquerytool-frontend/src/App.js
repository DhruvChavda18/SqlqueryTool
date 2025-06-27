import React, { useState } from "react";
import "./App.css";
import QueryInput from "./components/QueryInput";
import SavePage from "./components/SavePage";
import SavedPages from "./components/SavedPages";
import axios from "axios"; // add this line
import ResultTable from "./components/ResultTable";

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
    <>
      <div className="header-bar">SQL Query Tool</div>
      <div className="App">
        <div className="section-card">
          <QueryInput setQuery={setQuery} onResult={setResult} />
        </div>
        <div className="section-card">
          <SavePage query={query} />
        </div>
        <div className="section-card">
          <SavedPages onOpenQuery={handleOpenQuery} />
        </div>
        <hr />
        <div className="section-card">
          <h3>Query Result:</h3>
          <ResultTable result={result} />
        </div>
      </div>
    </>
  );
}

export default App;
