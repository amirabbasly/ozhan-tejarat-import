import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  fetchCottages,
  updateCottageCurrencyPrice,
  deleteCottages, // Import the deleteCottages action
} from '../actions/cottageActions';

import './CottageList.css';
import { Link, useNavigate } from 'react-router-dom';
import DatePicker from 'react-multi-date-picker';
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import DateObject from "react-date-object";

const CottageList = () => {
  const navigate = useNavigate();
  const auth = useSelector((state) => state.auth);

  useEffect(() => {
    if (auth.isAuthenticated === false) {
      navigate('/');
    }
  }, [auth.isAuthenticated, navigate]);

  const dispatch = useDispatch();

  // Access cottages state from Redux store
  const {
    cottages,
    loading,
    error,
    updatingCurrencyPrice,
    updateCurrencyPriceError,
  } = useSelector((state) => state.cottages);

  const [selectedCottages, setSelectedCottages] = useState([]);
  const [areAllSelected, setAreAllSelected] = useState(false);
  const [currencyPrice, setCurrencyPrice] = useState('');

  // States for search, filters, and date range
  const [searchTerm, setSearchTerm] = useState('');
  const [proformaFilter, setProformaFilter] = useState('');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [filteredCottages, setFilteredCottages] = useState([]);

  useEffect(() => {
    dispatch(fetchCottages());
  }, [dispatch]);

  useEffect(() => {
    if (Object.keys(updatingCurrencyPrice || {}).length === 0) {
      // Fetch updated cottages when all updates are complete
      dispatch(fetchCottages());
    }
  }, [updatingCurrencyPrice, dispatch]);

  useEffect(() => {
    console.log('Error:', error);
    console.log('Update Currency Price Error:', updateCurrencyPriceError);
  }, [error, updateCurrencyPriceError]);

  // Filtering logic
  useEffect(() => {
    const filtered = cottages.filter((cottage) => {
      const matchesSearchTerm =
        searchTerm.trim() === '' ||
        cottage.cottage_number.toString().includes(searchTerm) ||
        (cottage.proforma && cottage.proforma.includes(searchTerm));

      const matchesProforma =
        proformaFilter === '' || (cottage.proforma && cottage.proforma === proformaFilter);

      // Parse cottage_date into DateObject
      const cottageDate = new DateObject({
        date: cottage.cottage_date,
        format: 'YYYY/MM/DD',
        calendar: persian,
        locale: persian_fa,
      });

      let matchesDate = true;

      if (startDate) {
        matchesDate = matchesDate && cottageDate.unix >= startDate.unix;
      }

      if (endDate) {
        matchesDate = matchesDate && cottageDate.unix <= endDate.unix;
      }

      return matchesSearchTerm && matchesProforma && matchesDate;
    });

    setFilteredCottages(filtered);
  }, [cottages, searchTerm, proformaFilter, startDate, endDate]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleProformaChange = (e) => {
    setProformaFilter(e.target.value);
  };

  // Existing selection and currency price functions
  const handleSelectCottage = (event, cottage) => {
    const { checked } = event.target;
    let updatedSelections;

    if (checked) {
      updatedSelections = [...selectedCottages, cottage];
    } else {
      updatedSelections = selectedCottages.filter(
        (selectedCottage) => selectedCottage.id !== cottage.id
      );
    }

    setSelectedCottages(updatedSelections);
    setAreAllSelected(updatedSelections.length === filteredCottages.length);
  };

  const handleSelectAll = (event) => {
    const { checked } = event.target;
    setAreAllSelected(checked);

    if (checked) {
      setSelectedCottages(filteredCottages);
    } else {
      setSelectedCottages([]);
    }
  };

  const handleApplyCurrencyPrice = () => {
    if (selectedCottages.length === 0 || !currencyPrice) {
      alert('لطفاً حداقل یک کوتاژ را انتخاب کرده و نرخ ارز را وارد کنید.');
      return;
    }

    // Create an array of promises from dispatching the update actions
    const updatePromises = selectedCottages.map((cottage) =>
      dispatch(updateCottageCurrencyPrice(cottage.id, currencyPrice))
    );

    // Wait for all update actions to complete
    Promise.all(updatePromises)
      .then(() => {
        // After all updates, fetch the cottages again
        dispatch(fetchCottages());
        alert('نرخ ارز برای اظهارنامه های انتخاب شده به‌روزرسانی شد.');
      })
      .catch((error) => {
        console.error('Error updating currency price:', error);
        alert('خطا در به‌روزرسانی نرخ ارز برای برخی از کوتاژها.');
      });
  };
  const handleDeleteSelectedCottages = () => {
    if (selectedCottages.length === 0) {
      alert('لطفاً حداقل یک کوتاژ را انتخاب کنید.');
      return;
    }
  
    if (!window.confirm('آیا از حذف کوتاژهای انتخاب شده اطمینان دارید؟')) {
      return;
    }
  
    const idsToDelete = selectedCottages.map((cottage) => cottage.id);
  
    dispatch(deleteCottages(idsToDelete))
      .then(() => {
        alert('کوتاژهای انتخاب شده با موفقیت حذف شدند.');
        // Clear selected cottages and fetch the updated list
        setSelectedCottages([]);
        dispatch(fetchCottages());
      })
      .catch((error) => {
        console.error('Error deleting cottages:', error);
        alert('خطا در حذف کوتاژها.');
      });
  };
  

  return (
    <div className="cottage-cont">
      <div className="cottage-list-container">
        <h2>لیست اظهارنامه ها</h2>

        {/* Search and Filters Section */}
        <div className="filter-container">
          <input
            type="text"
            placeholder="جستجو..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="search-input"
          />
          <select value={proformaFilter} onChange={handleProformaChange} className="filter-select">
            <option value="">همه پروفرم‌ها</option>
            {[...new Set(cottages.map((cottage) => cottage.proforma))].map((proforma, index) => (
              <option key={index} value={proforma}>
                {proforma}
              </option>
            ))}
          </select>
          <DatePicker
            value={startDate}
            onChange={setStartDate}
            calendar={persian}
            locale={persian_fa}
            format="YYYY/MM/DD"
            placeholder="تاریخ شروع"
            className="date-picker"
          />
          <DatePicker
            value={endDate}
            onChange={setEndDate}
            calendar={persian}
            locale={persian_fa}
            format="YYYY/MM/DD"
            placeholder="تاریخ پایان"
            className="date-picker"
          />
        </div>

        {/* Currency Price Section */}
        <div className="currency-price-section">
          <input
          className='c-price-input'
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
          disabled={selectedCottages.length === 0 || !currencyPrice}
        >
          ثبت نرخ ارز برای کوتاژهای انتخاب شده
        </button>
        <button
          onClick={handleDeleteSelectedCottages}
          disabled={selectedCottages.length === 0}
          className="delete-button"
        >
          حذف کوتاژهای انتخاب شده
        </button>


        {loading && <p className="loading">در حال بارگذاری...</p>}
        {error && <p className="error">{error}</p>}
        {!loading && !error && (
          filteredCottages.length === 0 ? (
            <p className="no-data">هیچ اظهارنامه ای با این جستجو و فیلترها یافت نشد.</p>
          ) : (
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
                {filteredCottages.map((cottage, index) => {
                  const isChecked = selectedCottages.some(
                    (selectedCottage) => selectedCottage.id === cottage.id
                  );
                  const isUpdating =
                    updatingCurrencyPrice && updatingCurrencyPrice[cottage.id];
                  const updateError = updateCurrencyPriceError && updateCurrencyPriceError[cottage.id];

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
                      <td>
                        {new Intl.NumberFormat('fa-IR').format(cottage.total_value)}
                      </td>
                      <td>
                        {isUpdating ? (
                          <span className="loading">در حال به‌روزرسانی...</span>
                        ) : updateError ? (
                          <span className="error">
                            {typeof updateError === 'string' ? updateError : JSON.stringify(updateError)}
                          </span>
                        ) : cottage.currency_price ? (
                          `${cottage.currency_price} ریال`
                        ) : (
                          '—'
                        )}
                      </td>
                      <td>
                        <Link to={`/cottages/${cottage.cottage_number}`}>جزئیات</Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )
        )}
      </div>
    </div>
  );
};

export default CottageList;
