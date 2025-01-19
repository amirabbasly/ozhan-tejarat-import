import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { HSCodeList } from "../actions/hscodeActions";
import "./HSCodeList.css";
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

  // ----------------------------------------
  // Search: We store two states:
  // 1) searchText: user typing in the input
  // 2) search: the actual search param we send to backend
  // ----------------------------------------
  const [searchText, setSearchText] = useState("");
  const [search, setSearch] = useState("");

  // Options for filters (example)
  const profitOptions = ["", "0", "1", "4", "6", "9", "11", "16", "18", "28", "51"];
  const priorityOptions = ["", "2", "4", "21", "22", "23", "24", "25", "26", "27"];
  const cdrOptions = ["", "4", "1"];
  const suqOptions = ["", "Kg", "L", "U", "m", "m2"];

  // ----------------------------------------
  // Only re-fetch data when page/size or filters or "search" changes 
  // (NOT on every keystroke).
  // ----------------------------------------
  useEffect(() => {
    const filters = {
      profit,
      priority,
      customsDutyRate,
      suq,
      search, // we only update "search" when user clicks the search button
    };
    dispatch(HSCodeList(currentPage, pageSize, filters));
  }, [
    dispatch,
    currentPage,
    pageSize,
    profit,
    priority,
    customsDutyRate,
    suq,
    search, // If the user hits the Search button, "search" changes => fetch
  ]);

  // Pagination
  const handlePageChange = (e) => setCurrentPage(Number(e.target.value));
  const handleNextPage = () => { if (next) setCurrentPage((prev) => prev + 1); };
  const handlePreviousPage = () => { if (previous) setCurrentPage((prev) => prev - 1); };
  const handlePageSizeChange = (e) => {
    setPageSize(Number(e.target.value));
    setCurrentPage(1);
  };

  // Filter helper
  const handleFilterChange = (e, setter) => {
    setter(e.target.value);
    setCurrentPage(1);
  };

  // ----------------------------------------
  // When user clicks "Search", update `search` from `searchText`
  // This triggers the useEffect => re-fetch with new search param
  // ----------------------------------------
  const handleSearchButtonClick = () => {
    setSearch(searchText);
    setCurrentPage(1); // If desired, reset to first page
  };

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
          onChange={(e) => setSearchText(e.target.value)} // just local
        />
        <button onClick={handleSearchButtonClick}>Search</button>
      </div>

      {/* FILTER SECTION */}
      <div className="filter-form">
        <div className="filter-row">
          <label>سود بازگانی:</label>
          <select value={profit} onChange={(e) => handleFilterChange(e, setProfit)}>
            {profitOptions.map((val) => (
              <option key={val} value={val}>
                {val === "" ? "همه" : val}
              </option>
            ))}
          </select>
        </div>
        <div className="filter-row">
          <label>الویت:</label>
          <select value={priority} onChange={(e) => handleFilterChange(e, setPriority)}>
            {priorityOptions.map((val) => (
              <option key={val} value={val}>
                {val === "" ? "همه" : val}
              </option>
            ))}
          </select>
        </div>
        <div className="filter-row">
          <label>حقوق گمرکی:</label>
          <select value={customsDutyRate} onChange={(e) => handleFilterChange(e, setCustomsDutyRate)}>
            {cdrOptions.map((val) => (
              <option key={val} value={val}>
                {val === "" ? "همه" : val}
              </option>
            ))}
          </select>
        </div>
        <div className="filter-row">
          <label>واحد:</label>
          <select value={suq} onChange={(e) => handleFilterChange(e, setSuq)}>
            {suqOptions.map((val) => (
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
          {/* TOP PAGINATION */}
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
                <th>Code</th>
                <th>Goods Name (FA)</th>
                <th>Goods Name (EN)</th>
                <th>سود بازرگانی</th>
                <th>حقوق گمرکی</th>
                <th>الویت</th>
                <th>واحد</th>
              </tr>
            </thead>
            <tbody>
              {hscodeList.map((hscode) => (
                <tr key={hscode.id}>
                  <td>{hscode.code}</td>
                  <td>{hscode.goods_name_fa}</td>
                  <td>{hscode.goods_name_en}</td>

                  <td>{hscode.profit}</td>
                  <td>{hscode.customs_duty_rate}</td>
                  <td>{hscode.priority}</td>
                  <td>{hscode.SUQ}</td>
   
                </tr>
              ))}
            </tbody>
          </table>

          {/* BOTTOM PAGINATION */}
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
        </>
      ) : (
        !loading && <p className="no-data">No HSCode data available.</p>
      )}
    </div>
  );
};

export default HSCodeListComponent;
