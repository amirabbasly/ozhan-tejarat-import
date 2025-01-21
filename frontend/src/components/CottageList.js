import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchCottages,
  updateCottageCurrencyPrice,
  deleteCottages,
} from "../actions/cottageActions";
import { Link, useNavigate } from "react-router-dom";

import "./CottageList.css";
import PaginationControls from "./PaginationControls"; // <-- Import your component

const CottageList = () => {
  const navigate = useNavigate();
  const auth = useSelector((state) => state.auth);

  useEffect(() => {
    if (auth.isAuthenticated === false) {
      navigate("/");
    }
  }, [auth.isAuthenticated, navigate]);

  const dispatch = useDispatch();
  const [searchText, setSearchText] = useState("");
  const [search, setSearch] = useState("");

  const handleSearchButtonClick = () => {
    setSearch(searchText);
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

  // On mount or on `currentPage` change, fetch that page
  useEffect(() => {
    dispatch(fetchCottages(currentPage, pageSize, search));
  }, [dispatch, currentPage, pageSize, search]);

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
          <button className="btn-grad" onClick={handleSearchButtonClick}>Search</button>
        </div>

        {/* NO PROFORMA / DATE FILTERS ANYMORE */}

        {/* CURRENCY PRICE */}
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
        <button
          className="primary-button"
          onClick={handleApplyCurrencyPrice}
          disabled={!selectedCottages.length || !currencyPrice}
        >
          ثبت نرخ ارز برای کوتاژهای انتخاب شده
        </button>
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
        {!loading && !error && (
          cottages.length === 0 ? (
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
                    <th>شماره پروفرم</th>
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
                      updatingCurrencyPrice && updatingCurrencyPrice[cottage.id];
                    const updateError =
                      updateCurrencyPriceError && updateCurrencyPriceError[cottage.id];

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
                        <td>{cottage.proforma}</td>
                        <td>{cottage.total_value}</td>
                        <td>
                          {isUpdating ? (
                            <span className="loading">در حال به‌روزرسانی...</span>
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
          )
        )}
      </div>
    </div>
  );
};

export default CottageList;
