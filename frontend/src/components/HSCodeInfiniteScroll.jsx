import React, { useEffect, useState, useRef, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { HSCodeList, fetchHSCodeDetail } from "../actions/hscodeActions";
import HSCodeDetail from "./HSCodeDetail";
import "../style/HSCodeInfiniteScroll.css";

const HSCardSkeleton = () => {
  return (
    <div className="hscode-card bg-gray-200 rounded-lg overflow-hidden relative animate-pulse">
      <div className="background-image bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%] animate-[skeleton-loading_1.5s_infinite] h-24 w-full"></div>
      <div className="content-layer p-4">
        <div className="card-header">
          <h3 className="bg-gray-300 rounded h-6 w-3/4"></h3>
        </div>
        <div className="card-body mt-2">
          <p className="bg-gray-300 rounded h-5 w-1/2 mb-2"></p>
          <p className="bg-gray-300 rounded h-5 w-3/5"></p>
        </div>
      </div>
    </div>
  );
};

const HSCodeInfiniteScroll = () => {
  const dispatch = useDispatch();
  const { loading, hscodeList, next, error } = useSelector(
    (state) => state.hscodeList
  );

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 50;
  const [profit, setProfit] = useState("");
  const [priority, setPriority] = useState("");
  const [customsDutyRate, setCustomsDutyRate] = useState("");
  const [suq, setSuq] = useState("");
  const [searchText, setSearchText] = useState("");
  const [search, setSearch] = useState("");
  useEffect(() => {
    const handler = setTimeout(() => {
      setSearch(searchText);
      setCurrentPage(1);
    }, 300);
    return () => clearTimeout(handler);
  }, [searchText]);

  const profitOptions = [
    "",
    "0",
    "1",
    "4",
    "6",
    "9",
    "11",
    "16",
    "18",
    "28",
    "51",
  ];
  const priorityOptions = [
    "",
    "2",
    "4",
    "21",
    "22",
    "23",
    "24",
    "25",
    "26",
    "27",
  ];
  const cdrOptions = ["", "4", "1"];
  const suqOptions = ["", "Kg", "L", "U", "m", "m2"];
  const [loadedHSCodes, setLoadedHSCodes] = useState([]);
  const [showOverlay, setShowOverlay] = useState(false);

  useEffect(() => {
    setCurrentPage(1);
    setLoadedHSCodes([]);
  }, [profit, priority, customsDutyRate, suq, search]);

  useEffect(() => {
    const filters = { profit, priority, customsDutyRate, suq, search };
    dispatch(HSCodeList(currentPage, pageSize, filters));
  }, [
    dispatch,
    currentPage,
    pageSize,
    profit,
    priority,
    customsDutyRate,
    suq,
    search,
  ]);

  useEffect(() => {
    if (!hscodeList) return;
    setLoadedHSCodes((prev) => {
      const merged = currentPage === 1 ? hscodeList : [...prev, ...hscodeList];
      const seen = new Set();
      return merged.filter((item) => {
        if (seen.has(item.id)) return false;
        seen.add(item.id);
        return true;
      });
    });
  }, [hscodeList, currentPage]);

  const handleFilterChange = (e, setter) => {
    setter(e.target.value);
  };

  const handleSearchButtonClick = () => {
    setSearch(searchText);
    setCurrentPage(1);
  };

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

  const openOverlay = (code) => {
    dispatch(fetchHSCodeDetail(code));
    setShowOverlay(true);
  };

  const handleOverlayClosed = () => {
    setShowOverlay(false);
  };

  return (
    <div className="hscode-infinite">
      <h2 className="title">HSCode List</h2>

      <label htmlFor="searchInput">
        Search (کد / نام فارسی / نام انگلیسی):
      </label>
      <div className="search-bar">
        <input
          id="searchInput"
          type="text"
          placeholder="Type your search..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          className="border rounded p-2 w-full"
        />
      </div>

      <div className="filter-form flex flex-wrap gap-4">
        <div className="filter-row">
          <label>سود بازرگانی:</label>
          <select
            value={profit}
            onChange={(e) => handleFilterChange(e, setProfit)}
            className="border rounded p-2"
          >
            {profitOptions.map((val) => (
              <option key={val} value={val}>
                {val === "" ? "همه" : val}
              </option>
            ))}
          </select>
        </div>
        <div className="filter-row">
          <label>الویت:</label>
          <select
            value={priority}
            onChange={(e) => handleFilterChange(e, setPriority)}
            className="border rounded p-2"
          >
            {priorityOptions.map((val) => (
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
            className="border rounded p-2"
          >
            {cdrOptions.map((val) => (
              <option key={val} value={val}>
                {val === "" ? "همه" : val}
              </option>
            ))}
          </select>
        </div>
        <div className="filter-row">
          <label>واحد:</label>
          <select
            value={suq}
            onChange={(e) => handleFilterChange(e, setSuq)}
            className="border rounded p-2"
          >
            {suqOptions.map((val) => (
              <option key={val} value={val}>
                {val === "" ? "همه" : val}
              </option>
            ))}
         手法
          </select>
        </div>
      </div>

      {error && <p className="error text-red-500">Error: {error}</p>}

      <div className="hscards-container grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {loading ? (
          // نمایش اسکلتون‌ها در زمان لودینگ
          Array.from({ length: 6 }).map((_, index) => (
            <HSCardSkeleton key={`skeleton-${index}`} />
          ))
        ) : loadedHSCodes && loadedHSCodes.length > 0 ? (
          loadedHSCodes.map((hscode) => (
            <div
              className="hscode-card bg-white rounded-lg shadowonganize
              shadow-md overflow-hidden relative cursor-pointer hover:shadow-lg transition-shadow"
              key={hscode.id}
              onClick={() => openOverlay(hscode.code)}
            >
              <div
                className="background-image h-24 bg-cover bg-center"
                style={{
                  backgroundImage: `url(${hscode.season.icon})`,
                }}
              ></div>
              <div className="content-layer p-4">
                <div className="card-header">
                  <h3 className="text-lg font-semibold">
                    <strong></strong> {hscode.goods_name_fa}
                  </h3>
                </div>
                <div className="card-body mt-2">
                  <p className="text-sm">
                    <strong>{hscode.code}</strong>
                  </p>
                  <p className="text-sm">
                    <strong>حقوق ورودی:</strong>{" "}
                    {Number(hscode.profit) + Number(hscode.customs_duty_rate)}
                  </p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="no-data text-gray-500">No HSCode data available.</p>
        )}
      </div>

      {loading && <p className="loading text-gray-500">Loading more data...</p>}
      <div ref={loaderRef} className="observer-element h-4" />

      {showOverlay && <HSCodeDetail onClose={handleOverlayClosed} />}
    </div>
  );
};

export default HSCodeInfiniteScroll;