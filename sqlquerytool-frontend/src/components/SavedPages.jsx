import React, { useEffect, useState } from "react";
import axios from "axios";

const SavedPages = ({ onOpenQuery }) => {
  const [pages, setPages] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPages = async () => {
      try {
        const response = await axios.get("http://localhost:8082/api/pages");
        setPages(response.data);
      } catch (err) {
        setError("Failed to load saved pages.");
      }
    };
    fetchPages();
  }, []);

  const handleOpen = (pageId) => {
    onOpenQuery(pageId); // pass ID instead of query
  };

  return (
    <div>
      <h3>Saved Pages</h3>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <ul>
        {pages.map((page) => (
          <li key={page.id}>
            <strong>{page.pageName}</strong>
            <button
              style={{ marginLeft: "10px" }}
              onClick={() => handleOpen(page.id)}
            >
              Open
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SavedPages;
