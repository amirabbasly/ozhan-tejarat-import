// src/components/CottageList.js

import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchCottages } from '../actions/cottageActions';
import './CottageList.css';
import { Link } from 'react-router-dom';

const CottageList = () => {
  const dispatch = useDispatch();

  // Access cottages state from Redux store
  const { cottages, loading, error } = useSelector((state) => state.cottages);

  useEffect(() => {
    dispatch(fetchCottages());
  }, [dispatch]);

  return (
    <div className='cottage-cont'>
      <div className="cottage-list-container">
        <h2>لیست کوتاژ ها</h2>
        {loading && <p className="loading">در حال بارگذاری...</p>}
        {error && <p className="error">{error}</p>}
        {!loading && !error && (
          cottages.length === 0 ? (
            <p className="no-data">هیچ کوتاژی موجود نیست.</p>
          ) : (
            <table className="cottage-table">
              <thead>
                <tr>
                  <th>شماره کوتاژ</th>
                  <th>تاریخ</th>
                  <th>شماره پرفورم</th>
                  <th>ارزش کل</th>
                  <th>نرخ ارز</th>
                  <th> </th>
                </tr>
              </thead>
              <tbody>
                {cottages.map((cottage) => (
                  <tr key={cottage.id}>
                    <td>{cottage.cottage_number}</td>
                    <td>{cottage.cottage_date}</td>
                    <td>{cottage.proforma}</td>
                    <td>{cottage.total_value}</td>
                    <td>{cottage.currency_price} ریال</td>
                    <td>
                      <Link to={`/cottages/${cottage.id}`}>جزئیات</Link>
                    </td> 
                  </tr>
                ))}
              </tbody>
            </table>
          )
        )}
      </div>
    </div>
  );
};

export default CottageList;
