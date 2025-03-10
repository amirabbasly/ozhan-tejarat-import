import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchCottages,
  updateCottageCurrencyPrice,
  deleteCottages,
} from "../actions/cottageActions";
import { fetchOrders } from "../actions/performaActions";
import { Link, useNavigate } from "react-router-dom";

import "./CottageList.css";
import PaginationControls from "./PaginationControls"; // <-- Import your component
import Select from "react-select";
import DatePicker from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import moment from "moment-jalaali";

const CottageList = () => {
  const navigate = useNavigate();
  const auth = useSelector((state) => state.auth);
  const orders = useSelector((state) => state.order.orders);
  const orderOptions = orders.map((order) => ({
    value: order.prf_order_no,
    label: order.prf_order_no,
  }));

  useEffect(() => {
    if (auth.isAuthenticated === false) {
      navigate("/");
    }
  }, [auth.isAuthenticated, navigate]);

  const dispatch = useDispatch();
  const [searchText, setSearchText] = useState("");
  const [query, setQuery] = useState("");

  const handleSearchButtonClick = () => {
    setQuery(searchText);
    setCurrentPage(1); // optional: reset to page 1 when searching
  };

  // Access cottages state from Redux store
  const {
    cottages,
    loading,
    error,
    next,
    previous,
    count,
    updatingCurrencyPrice,
    updateCurrencyPriceError,
  } = useSelector((state) => state.cottages);

  // -------------------- PAGINATION STATE --------------------
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(50); // or 50, or your default
  const totalPages = Math.ceil(count / pageSize); // For the dropdown in PaginationControls
  const [cottageDate, setCottageDate] = useState("");
  const [cottageDateBefore, setCottageDateBefore] = useState("");
  const [prfOrderNo, setPrfOrderNo] = useState("");

  // Optionally, keep the helper function or remove it
  const convertToWesternDigits = (str) => {
    if (typeof str !== "string") return str; // Safeguard
    const easternDigits = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];
    const westernDigits = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
    return str.replace(
      /[۰-۹]/g,
      (d) => westernDigits[easternDigits.indexOf(d)]
    );
  };

  // Date change handler to ensure cottageDate is a string with English numerals
  // Handler for 'cottageDate'
  const handleCottageDateChange = (date) => {
    if (date && date.format) {
      setCottageDate(date.format("YYYY-MM-DD"));
    } else {
      setCottageDate("");
    }
  };

  // Handler for 'cottageDateBefore'
  const handleCottageDateBeforeChange = (date) => {
    if (date && date.format) {
      setCottageDateBefore(date.format("YYYY-MM-DD"));
    } else {
      setCottageDateBefore("");
    }
  };

  // On mount or on `currentPage` change, fetch that page
  useEffect(() => {
    dispatch(fetchOrders());
    const filters = {
      search: query, // using the renamed variable
      cottageDate: convertToWesternDigits(cottageDate), // Use helper if necessary
      cottageDateBefore: convertToWesternDigits(cottageDateBefore),
      prfOrderNo,
    };
    console.log("Dispatching filters:", filters);
    console.log("Cottage Date before sending:", filters.cottageDate);

    dispatch(fetchCottages(currentPage, pageSize, filters));
  }, [
    dispatch,
    currentPage,
    pageSize,
    query,
    cottageDate,
    prfOrderNo,
    cottageDateBefore,
  ]);

  // If currency updates are done, refetch
  useEffect(() => {
    if (Object.keys(updatingCurrencyPrice || {}).length === 0) {
      dispatch(fetchCottages(currentPage));
    }
  }, [updatingCurrencyPrice, dispatch, currentPage]);

  // We define booleans for enabling next/prev based on the presence of `next`/`previous`
  const hasNext = !!next;
  const hasPrevious = !!previous;

  // If you want the user to pick a page from a dropdown:
  const handlePageChange = (e) => {
    setCurrentPage(Number(e.target.value));
  };

  const handleNextPage = () => {
    if (hasNext) setCurrentPage((prev) => prev + 1);
  };

  const handlePreviousPage = () => {
    if (hasPrevious) setCurrentPage((prev) => prev - 1);
  };

  // If user changes page size => setPageSize, reset to page 1
  const handlePageSizeChange = (e) => {
    setPageSize(Number(e.target.value));
    setCurrentPage(1);
  };

  // -------------------- SELECTED COTTAGES LOGIC --------------------
  const [selectedCottages, setSelectedCottages] = useState([]);
  const [areAllSelected, setAreAllSelected] = useState(false);
  const [currencyPrice, setCurrencyPrice] = useState("");

  const handleSelectCottage = (event, cottage) => {
    const { checked } = event.target;
    let updatedSelections;
    if (checked) {
      updatedSelections = [...selectedCottages, cottage];
    } else {
      updatedSelections = selectedCottages.filter((c) => c.id !== cottage.id);
    }
    setSelectedCottages(updatedSelections);
    setAreAllSelected(updatedSelections.length === cottages.length);
  };

  const handleSelectAll = (event) => {
    const { checked } = event.target;
    setAreAllSelected(checked);
    if (checked) {
      setSelectedCottages(cottages);
    } else {
      setSelectedCottages([]);
    }
  };

  // -------------------- UPDATE & DELETE ACTIONS --------------------
  const handleApplyCurrencyPrice = () => {
    if (!selectedCottages.length || !currencyPrice) {
      alert("لطفاً حداقل یک کوتاژ را انتخاب کرده و نرخ ارز را وارد کنید.");
      return;
    }
    const updatePromises = selectedCottages.map((cottage) =>
      dispatch(updateCottageCurrencyPrice(cottage.id, currencyPrice))
    );
    Promise.all(updatePromises)
      .then(() => {
        alert("نرخ ارز برای اظهارنامه های انتخاب شده به‌روزرسانی شد.");
        dispatch(fetchCottages(currentPage));
      })
      .catch((error) => {
        console.error("Error updating currency price:", error);
        alert("خطا در به‌روزرسانی نرخ ارز برای برخی از کوتاژها.");
      });
  };

  const handleDeleteSelectedCottages = () => {
    if (!selectedCottages.length) {
      alert("لطفاً حداقل یک کوتاژ را انتخاب کنید.");
      return;
    }
    if (!window.confirm("آیا از حذف کوتاژهای انتخاب شده اطمینان دارید؟")) {
      return;
    }
    const idsToDelete = selectedCottages.map((cottage) => cottage.id);
    dispatch(deleteCottages(idsToDelete))
      .then(() => {
        alert("کوتاژهای انتخاب شده با موفقیت حذف شدند.");
        setSelectedCottages([]);
        dispatch(fetchCottages(currentPage));
      })
      .catch((error) => {
        console.error("Error deleting cottages:", error);
        alert("خطا در حذف کوتاژها.");
      });
  };

  return (
    <div className="cottage-cont">
      <div className="cottage-list-container">
        <h2>لیست اظهارنامه ها</h2>

        {/* SIMPLE SEARCH BAR (NO FILTERING) */}
        <label>جستجو (کد/نام فارسی/نام انگلیسی):</label>
        <div className="search-bar">
          <input
            type="text"
            placeholder="Type your search..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
          <button className="btn-grad" onClick={handleSearchButtonClick}>
            Search
          </button>
        </div>

        {/* NO PROFORMA / DATE FILTERS ANYMORE */}

        <div className="filter-container">
          <Select
            name="proforma"
            className="filter-react-select"
            value={
              orderOptions.find((option) => option.value === prfOrderNo) || null
            } // Match the object
            onChange={(selectedOption) =>
              setPrfOrderNo(selectedOption ? selectedOption.value : "")
            } // Update state correctly
            options={orderOptions}
            isLoading={loading}
            isClearable
            placeholder={
              loading
                ? "در حال بارگذاری..."
                : error
                ? "خطا در بارگذاری"
                : "انتخاب سفارش"
            }
            noOptionsMessage={() =>
              !loading && !error ? "سفارشی موجود نیست" : "در حال بارگذاری..."
            }
          />
          <DatePicker
            value={cottageDate}
            onChange={handleCottageDateChange}
            calendar={persian}
            locale={persian_fa}
            format="YYYY-MM-DD"
            numerals="en"
            placeholder="تاریخ شروع"
            className="date-picker"
            clearable
          />
          <DatePicker
            value={cottageDateBefore}
            onChange={handleCottageDateBeforeChange}
            calendar={persian}
            locale={persian_fa}
            format="YYYY-MM-DD"
            numerals="en"
            placeholder="تاریخ پایان"
            className="date-picker"
            clearable
          />
        </div>

        {/* CURRENCY PRICE */}
        {/* 
        <div className="currency-price-section">
          <input
            className="c-price-input"
            type="number"
            id="currencyPrice"
            value={currencyPrice}
            onChange={(e) => setCurrencyPrice(e.target.value)}
            placeholder="نرخ ارز را وارد کنید"
          />
        </div>
     
        <div className="filter-row">
          <label>سود بازگانی:</label>
          <select value={cottageStatus} onChange={  (e) => handleFilterChange(e, setCottageStatus)}>
            {["", "0", "1", "4", "6", "9", "11", "16", "18", "28", "51"].map((val) => (
              <option key={val} value={val}>
                {val === "" ? "همه" : val}
              </option>
            ))}
          </select>
        </div> 

        <button
          className="primary-button"
          onClick={handleApplyCurrencyPrice}
          disabled={!selectedCottages.length || !currencyPrice}
        >
          ثبت نرخ ارز برای کوتاژهای انتخاب شده
        </button>*/}
        <button
          onClick={handleDeleteSelectedCottages}
          disabled={!selectedCottages.length}
          className="delete-button"
        >
          حذف کوتاژهای انتخاب شده
        </button>

        {/* LOADING/ERROR */}
        {loading && <p className="loading">در حال بارگذاری...</p>}
        {error && <p className="error">{error}</p>}

        {/* DISPLAY TABLE & PAGINATION */}
        {!loading &&
          !error &&
          (cottages.length === 0 ? (
            <p className="no-data">هیچ اظهارنامه ای یافت نشد.</p>
          ) : (
            <>
              {/* -- TOP PAGINATION -- */}
              <PaginationControls
                currentPage={currentPage}
                totalPages={totalPages}
                pageSize={pageSize}
                pageSizeOptions={[10, 20, 50, 100, 200]}
                hasNext={hasNext}
                hasPrevious={hasPrevious}
                onPageChange={handlePageChange}
                onNextPage={handleNextPage}
                onPreviousPage={handlePreviousPage}
                onPageSizeChange={handlePageSizeChange}
              />

              <table className="cottage-table">
                <thead>
                  <tr>
                    <th>
                      <input
                        type="checkbox"
                        onChange={handleSelectAll}
                        checked={areAllSelected}
                      />
                    </th>
                    <th>ردیف</th>
                    <th>شماره کوتاژ</th>
                    <th>تاریخ</th>
                    <th>شماره پرفورم</th>
                    <th>شماره ثبت سفارش</th>

                    <th>ارزش کل</th>
                    <th>نرخ ارز</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {cottages.map((cottage, index) => {
                    const isChecked = selectedCottages.some(
                      (selectedCottage) => selectedCottage.id === cottage.id
                    );
                    const isUpdating =
                      updatingCurrencyPrice &&
                      updatingCurrencyPrice[cottage.id];
                    const updateError =
                      updateCurrencyPriceError &&
                      updateCurrencyPriceError[cottage.id];

                    return (
                      <tr key={cottage.id}>
                        <td>
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={(e) => handleSelectCottage(e, cottage)}
                          />
                        </td>
                        <td>{index + 1}</td>
                        <td>{cottage.cottage_number}</td>
                        <td>{cottage.cottage_date}</td>
                        <td>{cottage.proforma.prf_number}</td>
                        <td>{cottage.proforma.prf_order_no}</td>
                        <td>{cottage.total_value}</td>
                        <td>
                          {isUpdating ? (
                            <span className="loading">
                              در حال به‌روزرسانی...
                            </span>
                          ) : updateError ? (
                            <span className="error">
                              {typeof updateError === "string"
                                ? updateError
                                : JSON.stringify(updateError)}
                            </span>
                          ) : cottage.currency_price ? (
                            `${cottage.currency_price} ریال`
                          ) : (
                            "—"
                          )}
                        </td>
                        <td>
                          <Link to={`/cottages/${cottage.cottage_number}`}>
                            جزئیات
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              {/* -- BOTTOM PAGINATION -- */}
              <PaginationControls
                currentPage={currentPage}
                totalPages={totalPages}
                pageSize={pageSize}
                pageSizeOptions={[10, 20, 50, 100, 200]}
                hasNext={hasNext}
                hasPrevious={hasPrevious}
                onPageChange={handlePageChange}
                onNextPage={handleNextPage}
                onPreviousPage={handlePreviousPage}
                onPageSizeChange={handlePageSizeChange}
              />
            </>
          ))}
      </div>
    </div>
  );
};

export default CottageList;
