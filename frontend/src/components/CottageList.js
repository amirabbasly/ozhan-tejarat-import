import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  fetchCottages,
  updateCottageCurrencyPrice,
} from '../actions/cottageActions';
import './CottageList.css';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';


const CottageList = () => {
  const navigate = useNavigate ();
  const auth = useSelector((state) => state.auth);
  useEffect(() => {
    if (auth.isAuthenticated===false) {
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
  

  return (
    <div className="cottage-cont">
      <div className="cottage-list-container">
        <h2>لیست اظهارنامه ها</h2>

        {/* Currency Price Section */}
        <div className="currency-price-section">
          <label htmlFor="currencyPrice">نرخ ارز:</label>
          <input
            type="number"
            id="currencyPrice"
            value={currencyPrice}
            onChange={(e) => setCurrencyPrice(e.target.value)}
            placeholder="نرخ ارز را وارد کنید"
          />

        </div>
        <button
            onClick={handleApplyCurrencyPrice}
            disabled={selectedCottages.length === 0 || !currencyPrice}
          >
            ثبت نرخ ارز برای کوتاژهای انتخاب شده
          </button>

        {loading && <p className="loading">در حال بارگذاری...</p>}
        {error && <p className="error">{error}</p>}
        {!loading && !error && (
          cottages.length === 0 ? (
            <p className="no-data">هیچ اظهارنامه ای موجود نیست.</p>
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
                  <th> ردیف</th>
                  <th>شماره کوتاژ</th>
                  <th>تاریخ</th>
                  <th>شماره پرفورم</th>
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
                        {new Intl.NumberFormat('fa-IR', ).format(cottage.total_value)}
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
