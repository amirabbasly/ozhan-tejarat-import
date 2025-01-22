import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { HSCodeList } from "../actions/hscodeActions";
import "./HSCodeList.css";

// Single update (actually bulk) component
import HSCodeUpdateBulk from "./HSCodeUpdateBulk";
import PaginationControls from "./PaginationControls";

const HSCodeListComponent = () => {
  const dispatch = useDispatch();
  const { loading, hscodeList, count, next, previous, error } = useSelector(
    (state) => state.hscodeList
  );

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(50);
  const totalPages = Math.ceil(count / pageSize);

  // Existing filters
  const [profit, setProfit] = useState("");
  const [priority, setPriority] = useState("");
  const [customsDutyRate, setCustomsDutyRate] = useState("");
  const [suq, setSuq] = useState("");

  // Search
  const [searchText, setSearchText] = useState("");
  const [query, setQuery] = useState("");

  // Array of selected HS code IDs
  const [selectedCodes, setSelectedCodes] = useState([]);

  useEffect(() => {
    const filters = {
      profit,
      priority,
      customsDutyRate,
      suq,
      search: query,  // using the renamed variable
    };
    console.log("Dispatching filters:", filters);

    dispatch(HSCodeList(currentPage, pageSize, filters));
  }, [dispatch, currentPage, pageSize, profit, priority, customsDutyRate, suq, query]);
  

  // Pagination
  const handlePageChange = (e) => setCurrentPage(Number(e.target.value));
  const handleNextPage = () => {
    if (next) setCurrentPage((prev) => prev + 1);
  };
  const handlePreviousPage = () => {
    if (previous) setCurrentPage((prev) => prev - 1);
  };
  const handlePageSizeChange = (e) => {
    setPageSize(Number(e.target.value));
    setCurrentPage(1);
  };

  // Filter
  const handleFilterChange = (e, setter) => {
    setter(e.target.value);
    setCurrentPage(1);
  };

  const handleSearchButtonClick = () => {
    setQuery(searchText);
    setCurrentPage(1);
  };

  // Toggle selection for a given HS code ID
  const handleCheckboxChange = (id) => {
    setSelectedCodes((prevSelected) => {
      if (prevSelected.includes(id)) {
        // remove from list
        return prevSelected.filter((codeId) => codeId !== id);
      } else {
        // add to list
        return [...prevSelected, id];
      }
    });
  };

  // Clear all selections if needed
  const clearSelections = () => setSelectedCodes([]);

  return (
    <div className="hscode-list">
      <h2 className="title">HSCode List</h2>

      {/* SEARCH ROW */}
      <div className="search-bar">
        <label htmlFor="searchInput">Search (کد / نام فارسی / نام انگلیسی):</label>
        <input
          id="searchInput"
          type="text"
          placeholder="Type your search..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
        <button className="btn-grad" onClick={handleSearchButtonClick}>
          Search
        </button>
      </div>

      {/* FILTER SECTION */}
      <div className="filter-form">
        <div className="filter-row">
          <label>سود بازگانی:</label>
          <select value={profit} onChange={(e) => handleFilterChange(e, setProfit)}>
            {["", "0", "1", "4", "6", "9", "11", "16", "18", "28", "51"].map((val) => (
              <option key={val} value={val}>
                {val === "" ? "همه" : val}
              </option>
            ))}
          </select>
        </div>
        <div className="filter-row">
          <label>الویت:</label>
          <select value={priority} onChange={(e) => handleFilterChange(e, setPriority)}>
            {["", "2", "4", "21", "22", "23", "24", "25", "26", "27"].map((val) => (
              <option key={val} value={val}>
                {val === "" ? "همه" : val}
              </option>
            ))}
          </select>
        </div>
        <div className="filter-row">
          <label>حقوق گمرکی:</label>
          <select
            value={customsDutyRate}
            onChange={(e) => handleFilterChange(e, setCustomsDutyRate)}
          >
            {["", "4", "1"].map((val) => (
              <option key={val} value={val}>
                {val === "" ? "همه" : val}
              </option>
            ))}
          </select>
        </div>
        <div className="filter-row">
          <label>واحد:</label>
          <select value={suq} onChange={(e) => handleFilterChange(e, setSuq)}>
            {["", "Kg", "L", "U", "m", "m2"].map((val) => (
              <option key={val} value={val}>
                {val === "" ? "همه" : val}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* LOADING / ERROR */}
      {loading && <p className="loading">Loading...</p>}
      {error && <p className="error">Error: {error}</p>}

      {/* TABLE + PAGINATION */}
      {!loading && !error && hscodeList && hscodeList.length > 0 ? (
        <>
          <PaginationControls
            currentPage={currentPage}
            totalPages={totalPages}
            pageSize={pageSize}
            pageSizeOptions={[50, 100, 200, 500]}
            hasNext={!!next}
            hasPrevious={!!previous}
            onPageChange={handlePageChange}
            onNextPage={handleNextPage}
            onPreviousPage={handlePreviousPage}
            onPageSizeChange={handlePageSizeChange}
          />

          <table className="hscode-table">
            <thead>
              <tr>
                <th>Select</th>
                <th>Code</th>
                <th>Goods Name (FA)</th>
                <th>Goods Name (EN)</th>
                <th>سود بازرگانی</th>
                <th>حقوق گمرکی</th>
                <th>الویت</th>
                <th>تاریخ آپدیت</th>
                <th>آپدیت شده</th>
                <th>واحد</th>
              </tr>
            </thead>
            <tbody>
              {hscodeList.map((hscode) => (
                <tr key={hscode.id}>
                  <td>
                    <input
                      type="checkbox"
                      checked={selectedCodes.includes(hscode.code)}
                      onChange={() => handleCheckboxChange(hscode.code)}
                    />
                  </td>
                  <td>{hscode.code}</td>
                  <td>{hscode.goods_name_fa}</td>
                  <td>{hscode.goods_name_en}</td>
                  <td>{hscode.profit}</td>
                  <td>{hscode.customs_duty_rate}</td>
                  <td>{hscode.priority}</td>
                  <td>{hscode.updated_date}</td>
                  <td>{hscode.updated_by}</td>
                  <td>{hscode.SUQ}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <PaginationControls
            currentPage={currentPage}
            totalPages={totalPages}
            pageSize={pageSize}
            pageSizeOptions={[50, 100, 200, 500]}
            hasNext={!!next}
            hasPrevious={!!previous}
            onPageChange={handlePageChange}
            onNextPage={handleNextPage}
            onPreviousPage={handlePreviousPage}
            onPageSizeChange={handlePageSizeChange}
          />

          {/* SINGLE Update Component for ALL selected rows */}
          <div style={{ marginTop: "2rem" }}>
          <HSCodeUpdateBulk codes={selectedCodes} />

            {/* Optional: Button to clear selections */}
            {selectedCodes.length > 0 && (
              <button onClick={clearSelections} style={{ marginTop: "1rem" }}>
                Clear Selections
              </button>
            )}
          </div>
        </>
      ) : (
        !loading && <p className="no-data">No HSCode data available.</p>
      )}
    </div>
  );
};

export default HSCodeListComponent;
