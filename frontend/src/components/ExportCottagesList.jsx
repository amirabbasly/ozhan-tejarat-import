import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  fetchExportCottages,
  deleteExportCottages, // Import the deleteCottages action
} from '../actions/cottageActions';

import "../style/CottageList.css";
import { Link, useNavigate } from 'react-router-dom';
import DatePicker from 'react-multi-date-picker';
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import DateObject from "react-date-object";

const ExportCottageList = () => {
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
  } = useSelector((state) => state.exportCottages);

  const [selectedCottages, setSelectedCottages] = useState([]);
  const [areAllSelected, setAreAllSelected] = useState(false);

  // States for search, filters, and date range
  const [searchTerm, setSearchTerm] = useState('');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [filteredCottages, setFilteredCottages] = useState([]);

  useEffect(() => {
    dispatch(fetchExportCottages());
  }, [dispatch]);


  // Filtering logic
  useEffect(() => {
    const filtered = cottages.filter((cottage) => {
      const matchesSearchTerm =
        searchTerm.trim() === '' ||
        cottage.full_serial_number.toString().includes(searchTerm) ||
        (cottage.proforma && cottage.proforma.includes(searchTerm));



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

      return matchesSearchTerm && matchesDate;
    });

    setFilteredCottages(filtered);
  }, [cottages, searchTerm, startDate, endDate]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
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
const handleDeleteSelectedCottages = () => {
    if (selectedCottages.length === 0) {
      alert('لطفاً حداقل یک کوتاژ را انتخاب کنید.');
      return;
    }
  
    if (!window.confirm('آیا از حذف کوتاژهای انتخاب شده اطمینان دارید؟')) {
      return;
    }
  
    const idsToDelete = selectedCottages.map((cottage) => cottage.id);
  
    dispatch(deleteExportCottages(idsToDelete))
      .then(() => {
        alert('کوتاژهای انتخاب شده با موفقیت حذف شدند.');
        // Clear selected cottages and fetch the updated list
        setSelectedCottages([]);
        dispatch(fetchExportCottages());
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
                  <th>ارزش کل</th>
                  <th>نرخ ارز</th>
                  <th>مانده</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {filteredCottages.map((cottage, index) => {
                  const isChecked = selectedCottages.some(
                    (selectedCottage) => selectedCottage.id === cottage.id
                  );


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
                      <td>{cottage.full_serial_number}</td>
                      <td>{cottage.cottage_date}</td>
                      <td>
                        {cottage.total_value}
                      </td>
                      <td>
                        {cottage.currency_price}
                      </td>
                      <td>
                        {cottage.remaining_total}
                      </td>
                      <td>
                        <Link to={`/export-cottages/${cottage.full_serial_number}`}>جزئیات</Link>
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

export default ExportCottageList;
