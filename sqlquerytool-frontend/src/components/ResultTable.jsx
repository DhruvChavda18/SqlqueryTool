import React, { useState, useMemo } from "react";
import "../App.css";

const PAGE_SIZE = 10;

const headerCellStyle = {
  maxWidth: 150,
  minWidth: 80,
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
  position: "sticky",
  top: 0,
  background: "#e0e7ff",
  zIndex: 2,
  padding: "7px 12px 7px 12px",
  fontSize: "0.98rem",
  borderBottom: "2px solid #c7d2fe",
  userSelect: "none",
  height: 40,
  verticalAlign: "middle"
};

const filterInputStyle = {
  width: "100%",
  maxWidth: 120,
  minWidth: 60,
  fontSize: "0.93rem",
  borderRadius: 5,
  border: "1px solid #c7d2fe",
  padding: "4px 7px 4px 28px",
  background: "#f9fafb",
  backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'16\' height=\'16\' fill=\'gray\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M11.742 10.344a6.471 6.471 0 001.408-4.034C13.15 3.01 10.14 0 6.575 0 3.01 0 0 3.01 0 6.575c0 3.565 3.01 6.575 6.575 6.575a6.471 6.471 0 004.034-1.408l3.85 3.85a1 1 0 001.415-1.415l-3.85-3.85zM6.575 11.15A4.575 4.575 0 112.001 6.575a4.575 4.575 0 014.574 4.575z\'/%3E%3C/svg%3E")',
  backgroundRepeat: 'no-repeat',
  backgroundPosition: '8px center',
  backgroundSize: '14px 14px',
  boxSizing: 'border-box',
  outline: 'none',
  transition: 'border 0.2s',
};

const cellStyle = {
  maxWidth: 160,
  padding: "7px 10px",
  fontSize: "0.97rem",
  border: "1px solid #e0e7ff",
  background: "#fff"
};

const rowStyle = {
  transition: "background 0.15s"
};

const rowHoverStyle = {
  background: "#f3f4f6"
};

const paginationButtonStyle = {
  padding: "5px 13px",
  margin: "0 2px",
  borderRadius: 5,
  border: "1px solid #c7d2fe",
  background: "#e0e7ff",
  color: "#3730a3",
  fontWeight: 600,
  fontSize: "0.97rem",
  boxShadow: "0 1px 4px rgba(99,102,241,0.04)",
  cursor: "pointer",
  transition: "background 0.15s, color 0.15s"
};

const paginationButtonDisabledStyle = {
  ...paginationButtonStyle,
  background: "#f3f4f6",
  color: "#a5b4fc",
  cursor: "not-allowed"
};

const sortIconContainerStyle = {
  display: "inline-flex",
  alignItems: "center",
  marginLeft: 6,
  minWidth: 18,
  height: 18,
  verticalAlign: "middle"
};

const sortIconStyle = {
  fontSize: "1.08em",
  opacity: 0.7,
  cursor: "pointer",
  marginLeft: 0,
  marginRight: 0,
  verticalAlign: "middle",
  userSelect: "none"
};

const fadedSortIconStyle = {
  ...sortIconStyle,
  opacity: 0.22
};

const ResultTable = ({ result }) => {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [globalFilter, setGlobalFilter] = useState("");
  const [columnFilters, setColumnFilters] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [hoveredRow, setHoveredRow] = useState(null);

  // Get columns from result
  const columns = useMemo(() => (result.length > 0 ? Object.keys(result[0]) : []), [result]);

  // Handle sorting
  const sortedData = useMemo(() => {
    let sortableData = [...result];
    if (sortConfig.key) {
      sortableData.sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];
        if (aValue === null || aValue === undefined) return 1;
        if (bValue === null || bValue === undefined) return -1;
        if (aValue === bValue) return 0;
        return (aValue > bValue ? 1 : -1) * (sortConfig.direction === "asc" ? 1 : -1);
      });
    }
    return sortableData;
  }, [result, sortConfig]);

  // Handle filtering
  const filteredData = useMemo(() => {
    return sortedData.filter((row) => {
      // Global filter
      if (globalFilter) {
        const globalMatch = columns.some((col) =>
          String(row[col] ?? "").toLowerCase().includes(globalFilter.toLowerCase())
        );
        if (!globalMatch) return false;
      }
      // Column filters
      for (const col of columns) {
        if (columnFilters[col] && !String(row[col] ?? "").toLowerCase().includes(columnFilters[col].toLowerCase())) {
          return false;
        }
      }
      return true;
    });
  }, [sortedData, globalFilter, columnFilters, columns]);

  // Pagination
  const pageCount = Math.ceil(filteredData.length / PAGE_SIZE) || 1;
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filteredData.slice(start, start + PAGE_SIZE);
  }, [filteredData, currentPage]);

  // Handlers
  const handleSort = (col) => {
    setSortConfig((prev) => {
      if (prev.key === col) {
        return { key: col, direction: prev.direction === "asc" ? "desc" : "asc" };
      }
      return { key: col, direction: "asc" };
    });
  };

  const handleColumnFilterChange = (col, value) => {
    setColumnFilters((prev) => ({ ...prev, [col]: value }));
    setCurrentPage(1);
  };

  const handleGlobalFilterChange = (e) => {
    setGlobalFilter(e.target.value);
    setCurrentPage(1);
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  // Sorting icon logic
  const getSortIcon = (col) => {
    if (sortConfig.key === col) {
      return sortConfig.direction === "asc" ? (
        <span style={sortIconStyle} title="Sorted ascending">▲</span>
      ) : (
        <span style={sortIconStyle} title="Sorted descending">▼</span>
      );
    } else {
      return <span style={fadedSortIconStyle} title="Click to sort">⇅</span>;
    }
  };

  return (
    <div style={{ overflowX: "auto", paddingBottom: 8 }}>
      <div style={{ marginBottom: 12, textAlign: "left" }}>
        <input
          type="text"
          placeholder="Global search..."
          value={globalFilter}
          onChange={handleGlobalFilterChange}
          style={{ width: 220, marginRight: 10, border: "2px solid #6366f1", borderRadius: 7, padding: "7px 10px", fontSize: "1.01rem" }}
        />
      </div>
      <div style={{ width: "100%", minWidth: 700 }}>
        <table className="responsive-table" style={{ minWidth: 700, borderCollapse: "separate", borderSpacing: 0, fontSize: "0.97rem" }}>
          <thead>
            <tr>
              {columns.map((col) => (
                <th
                  key={col}
                  style={headerCellStyle}
                  title={col}
                  onClick={() => handleSort(col)}
                >
                  <span style={{ cursor: "pointer", display: "inline-flex", alignItems: "center", width: "100%" }}>
                    <span style={{ flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }} title={col}>{col}</span>
                    <span style={sortIconContainerStyle}>{getSortIcon(col)}</span>
                  </span>
                </th>
              ))}
            </tr>
            <tr>
              {columns.map((col) => (
                <th key={col} style={headerCellStyle}>
                  <input
                    type="text"
                    placeholder={""}
                    value={columnFilters[col] || ""}
                    onChange={(e) => handleColumnFilterChange(col, e.target.value)}
                    style={filterInputStyle}
                    title={`Filter by ${col}`}
                  />
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginatedData.length === 0 ? (
              <tr>
                <td colSpan={columns.length} style={{ textAlign: "center" }}>
                  No data found.
                </td>
              </tr>
            ) : (
              paginatedData.map((row, idx) => (
                <tr
                  key={idx}
                  style={hoveredRow === idx ? { ...rowStyle, ...rowHoverStyle } : rowStyle}
                  onMouseEnter={() => setHoveredRow(idx)}
                  onMouseLeave={() => setHoveredRow(null)}
                >
                  {columns.map((col) => (
                    <td key={col} style={cellStyle}>
                      {row[col]}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {/* Pagination Controls */}
      <div style={{ marginTop: 8, display: "flex", justifyContent: "center", alignItems: "center", gap: 2 }}>
        <button
          style={currentPage === 1 ? paginationButtonDisabledStyle : paginationButtonStyle}
          onClick={() => handlePageChange(1)}
          disabled={currentPage === 1}
        >
          ⏮ First
        </button>
        <button
          style={currentPage === 1 ? paginationButtonDisabledStyle : paginationButtonStyle}
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          ◀ Prev
        </button>
        <span style={{ margin: "0 8px", fontWeight: 600, color: "#3730a3" }}>
          Page {currentPage} of {pageCount}
        </span>
        <button
          style={currentPage === pageCount ? paginationButtonDisabledStyle : paginationButtonStyle}
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === pageCount}
        >
          Next ▶
        </button>
        <button
          style={currentPage === pageCount ? paginationButtonDisabledStyle : paginationButtonStyle}
          onClick={() => handlePageChange(pageCount)}
          disabled={currentPage === pageCount}
        >
          Last ⏭
        </button>
      </div>
    </div>
  );
};

export default ResultTable; 