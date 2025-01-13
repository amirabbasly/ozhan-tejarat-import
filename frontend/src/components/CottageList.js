import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchCottages,
  updateCottageCurrencyPrice,
  deleteCottages,
} from "../actions/cottageActions";
import { Link, useNavigate } from "react-router-dom";

import "./CottageList.css";
import PaginationControls from "./PaginationControls";

const CottageList = () => {
  const navigate = useNavigate();
  const auth = useSelector((state) => state.auth);

  useEffect(() => {
    if (auth.isAuthenticated === false) {
      navigate("/");
    }
  }, [auth.isAuthenticated, navigate]);

  const dispatch = useDispatch();

  // Redux state
  const {
    cottages,   // the array of cottages from the server
    loading,
    error,
    next,
    previous,
    count,
    updatingCurrencyPrice,
    updateCurrencyPriceError,
  } = useSelector((state) => state.cottages);

  // (!!!) STATES FOR SEARCH:
  const [searchText, setSearchText] = useState("");
  const [search, setSearch] = useState("");

  const handleSearchButtonClick = () => {
    setSearch(searchText);
    setCurrentPage(1); // optional: reset to page 1 when searching
  };

  // (!!!) PAGINATION STATES
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const totalPages = Math.ceil(count / pageSize);

  // (!!!) On mount or when `currentPage`, `pageSize`, or `search` changes,
  // fetch from the BACKEND (no local filter).
  useEffect(() => {
    dispatch(fetchCottages(currentPage, pageSize, search));
  }, [dispatch, currentPage, pageSize, search]);

  // If currency updates finish, refetch the same page
  useEffect(() => {
    if (Object.keys(updatingCurrencyPrice || {}).length === 0) {
      dispatch(fetchCottages(currentPage, pageSize, search));
    }
  }, [updatingCurrencyPrice, dispatch, currentPage, pageSize, search]);

  // NEXT/PREV
  const hasNext = !!next;
  const hasPrevious = !!previous;

  const handlePageChange = (e) => {
    setCurrentPage(Number(e.target.value));
  };
  const handleNextPage = () => {
    if (hasNext) setCurrentPage((prev) => prev + 1);
  };
  const handlePreviousPage = () => {
    if (hasPrevious) setCurrentPage((prev) => prev - 1);
  };
  const handlePageSizeChange = (e) => {
    setPageSize(Number(e.target.value));
    setCurrentPage(1);
  };

  // ----------------------------------
  // SELECT / DELETE / UPDATE Logic
  // ----------------------------------
  const [selectedCottages, setSelectedCottages] = useState([]);
  const [areAllSelected, setAreAllSelected] = useState(false);
  const [currencyPrice, setCurrencyPrice] = useState("");

  const handleSelectCottage = (event, cottage) => {
    const { checked } = event.target;
    let updated;
    if (checked) {
      updated = [...selectedCottages, cottage];
    } else {
      updated = selectedCottages.filter((c) => c.id !== cottage.id);
    }
    setSelectedCottages(updated);
    setAreAllSelected(updated.length === cottages.length); // now comparing to ALL cottages
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

  const handleApplyCurrencyPrice = () => {
    if (!selectedCottages.length || !currencyPrice) {
      alert("انتخاب کوتاژ و نرخ ارز الزامی است");
      return;
    }
    const promises = selectedCottages.map((c) =>
      dispatch(updateCottageCurrencyPrice(c.id, currencyPrice))
    );
    Promise.all(promises)
      .then(() => {
        alert("نرخ ارز برای اظهارنامه های انتخاب شده بروزرسانی شد");
        dispatch(fetchCottages(currentPage, pageSize, search));
      })
      .catch((err) => alert("خطا در بروزرسانی نرخ ارز: " + err));
  };

  const handleDeleteSelectedCottages = () => {
    if (!selectedCottages.length) {
      alert("لطفاً حداقل یک کوتاژ را انتخاب کنید.");
      return;
    }
    if (!window.confirm("آیا از حذف کوتاژهای انتخاب شده اطمینان دارید؟")) {
      return;
    }
    const idsToDelete = selectedCottages.map((c) => c.id);
    dispatch(deleteCottages(idsToDelete))
      .then(() => {
        alert("کوتاژهای انتخاب شده با موفقیت حذف شدند.");
        setSelectedCottages([]);
        dispatch(fetchCottages(currentPage, pageSize, search));
      })
      .catch((err) => alert("خطا در حذف کوتاژها: " + err));
  };

  return (
    <div className="cottage-cont">
      <div className="cottage-list-container">
        <h2>لیست اظهارنامه ها</h2>

        {/* (!!!) SEARCH ROW: only for sending 'search' to backend */}
        <div className="search-bar">
          <label>جستجو (کد/نام فارسی/نام انگلیسی):</label>
          <input
            type="text"
            placeholder="Type your search..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
          <button onClick={handleSearchButtonClick}>Search</button>
        </div>

        {/* Currency Price UI */}
        <div className="currency-price-section">
          <input
            className="c-price-input"
            type="number"
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
          ثبت نرخ ارز برای انتخاب شده
        </button>
        <button
          onClick={handleDeleteSelectedCottages}
          disabled={!selectedCottages.length}
          className="delete-button"
        >
          حذف کوتاژهای انتخاب شده
        </button>

        {/* Loading / Error */}
        {loading && <p className="loading">در حال بارگذاری...</p>}
        {error && <p className="error">{error}</p>}

        {/* TABLE + PAGINATION */}
        {!loading && !error && cottages.length === 0 ? (
          <p className="no-data">هیچ داده‌ای یافت نشد.</p>
        ) : (
          <>
            {/* TOP PAGINATION */}
            <PaginationControls
              currentPage={currentPage}
              totalPages={totalPages}
              pageSize={pageSize}
              pageSizeOptions={[10, 20, 50, 100]}
              hasNext={!!next}
              hasPrevious={!!previous}
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
                    (sel) => sel.id === cottage.id
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

            {/* BOTTOM PAGINATION */}
            <PaginationControls
              currentPage={currentPage}
              totalPages={totalPages}
              pageSize={pageSize}
              pageSizeOptions={[10, 20, 50, 100]}
              hasNext={!!next}
              hasPrevious={!!previous}
              onPageChange={handlePageChange}
              onNextPage={handleNextPage}
              onPreviousPage={handlePreviousPage}
              onPageSizeChange={handlePageSizeChange}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default CottageList;
