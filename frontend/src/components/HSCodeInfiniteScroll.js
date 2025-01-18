import React, { useEffect, useState, useRef, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { HSCodeList } from "../actions/hscodeActions";
import "./HSCodeInfiniteScroll.css";

const HSCodeInfiniteScroll = () => {
  const dispatch = useDispatch();
  const { loading, hscodeList, next, error } = useSelector(
    (state) => state.hscodeList
  );

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 50;

  // Filter and search states
  const [profit, setProfit] = useState("");
  const [priority, setPriority] = useState("");
  const [customsDutyRate, setCustomsDutyRate] = useState("");
  const [suq, setSuq] = useState("");

  const [searchText, setSearchText] = useState("");
  const [search, setSearch] = useState("");

  // Options for filters (example)
  const profitOptions = ["", "0", "1", "4", "6", "9", "11", "16", "18", "28", "51"];
  const priorityOptions = ["", "2", "4", "21", "22", "23", "24", "25", "26", "27"];
  const cdrOptions = ["", "4", "1"];
  const suqOptions = ["", "Kg", "L", "U", "m", "m2"];

  // Store loaded HSCode records
  const [loadedHSCodes, setLoadedHSCodes] = useState([]);

  // Effect to reset loaded data when filters or search changes.
  useEffect(() => {
    setCurrentPage(1);
    setLoadedHSCodes([]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profit, priority, customsDutyRate, suq, search]);

  // Fetch data when currentPage or filters/search change.
  useEffect(() => {
    const filters = { profit, priority, customsDutyRate, suq, search };
    dispatch(HSCodeList(currentPage, pageSize, filters));
  }, [dispatch, currentPage, pageSize, profit, priority, customsDutyRate, suq, search]);

  // Append or set loaded data based on page.
  useEffect(() => {
    if (currentPage === 1) {
      setLoadedHSCodes(hscodeList);
    } else {
      setLoadedHSCodes((prev) => [...prev, ...hscodeList]);
    }
  }, [hscodeList, currentPage]);

  const handleFilterChange = (e, setter) => {
    setter(e.target.value);
  };

  const handleSearchButtonClick = () => {
    setSearch(searchText);
  };

  // Setup Intersection Observer for infinite scrolling.
  const observer = useRef();
  const loaderRef = useCallback(
    (node) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && next) {
          setCurrentPage((prevPage) => prevPage + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading, next]
  );

  return (
    <div className="hscode-infinite">
      <h2 className="title">HSCode List</h2>

      {/* SEARCH BAR */}
      <label htmlFor="searchInput">Search (کد / نام فارسی / نام انگلیسی):</label>
      <div className="search-bar">

        <input
          id="searchInput"
          type="text"
          placeholder="Type your search..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
        <button onClick={handleSearchButtonClick}>Search</button>
      </div>

      {/* FILTERS */}
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

      {/* ERROR MESSAGE */}
      {error && <p className="error">Error: {error}</p>}

      {/* HSCode Cards */}
      <div className="hscards-container">
        {loadedHSCodes && loadedHSCodes.length > 0 ? (
          loadedHSCodes.map((hscode) => (
            <div className="hscode-card" key={hscode.id}>
              
              <div className="card-header">

              <h3>
                  <strong></strong> {hscode.goods_name_en}
                </h3>

                
              </div>
              <div className="card-body">
              <p><strong>{hscode.code}</strong></p>
                <p>
                <p>
    <strong>حقوق ورودی:</strong>{" "}
    {Number(hscode.profit) + Number(hscode.customs_duty_rate)}
  </p>                </p>


              </div>
            </div>
          ))
        ) : (
          !loading && <p className="no-data">No HSCode data available.</p>
        )}
      </div>

      {/* Loader */}
      {loading && <p className="loading">Loading more data...</p>}
      <div ref={loaderRef} className="observer-element" />
    </div>
  );
};

export default HSCodeInfiniteScroll;
