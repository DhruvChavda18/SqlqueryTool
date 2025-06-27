import React, { useEffect, useState } from "react";
import axios from "axios";

const modalBackdropStyle = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100vw",
  height: "100vh",
  background: "rgba(60, 60, 100, 0.18)",
  zIndex: 1000,
  display: "flex",
  alignItems: "center",
  justifyContent: "center"
};

const modalStyle = {
  background: "#fff",
  borderRadius: 12,
  boxShadow: "0 4px 32px rgba(99,102,241,0.18)",
  padding: "32px 28px 24px 28px",
  minWidth: 320,
  maxWidth: 400,
  width: "90vw",
  maxHeight: "80vh",
  overflowY: "auto"
};

const SavedPages = ({ onOpenQuery }) => {
  const [pages, setPages] = useState([]);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (showModal && pages.length === 0) {
      const fetchPages = async () => {
        try {
          const response = await axios.get("http://localhost:8082/api/pages");
          setPages(response.data);
        } catch (err) {
          setError("Failed to load saved pages.");
        }
      };
      fetchPages();
    }
  }, [showModal, pages.length]);

  const handleOpen = (pageId) => {
    onOpenQuery(pageId);
    setShowModal(false);
  };

  return (
    <div style={{ textAlign: "center" }}>
      <button style={{ minWidth: 160, fontSize: "1.1rem" }} onClick={() => setShowModal(true)}>
        Saved Pages
      </button>
      {showModal && (
        <div style={modalBackdropStyle} onClick={() => setShowModal(false)}>
          <div style={modalStyle} onClick={e => e.stopPropagation()}>
            <h3 style={{ color: "#3730a3", marginBottom: 18 }}>Saved Pages</h3>
            {error && <p style={{ color: "#ef4444" }}>{error}</p>}
            {pages.length === 0 && !error && <p>Loading...</p>}
            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
              {pages.map((page) => (
                <li key={page.id} style={{ marginBottom: 12 }}>
                  <button
                    style={{
                      width: "100%",
                      textAlign: "left",
                      padding: "10px 16px",
                      borderRadius: 8,
                      background: "linear-gradient(90deg, #6366f1 0%, #60a5fa 100%)",
                      color: "#fff",
                      fontWeight: 600,
                      fontSize: "1rem",
                      border: "none",
                      marginBottom: 4,
                      boxShadow: "0 1px 4px rgba(99,102,241,0.08)",
                      cursor: "pointer"
                    }}
                    onClick={() => handleOpen(page.id)}
                  >
                    {page.pageName}
                  </button>
                </li>
              ))}
            </ul>
            <button
              style={{
                marginTop: 18,
                background: "#f3f4f6",
                color: "#3730a3",
                border: "1.5px solid #c7d2fe",
                borderRadius: 8,
                fontWeight: 600,
                fontSize: "1rem",
                padding: "8px 18px"
              }}
              onClick={() => setShowModal(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SavedPages;
