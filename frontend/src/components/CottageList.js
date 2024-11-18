import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './CottageList.css';

const CottageList = () => {
  const [cottages, setCottages] = useState([]);

  // Fetch cottages from the API
  const fetchCottages = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/cottages/');
      setCottages(response.data);
    } catch (error) {
      console.error('Error fetching cottages:', error);
    }
  };

  useEffect(() => {
    fetchCottages();
  }, []);

  return (
    <div className="cottage-list-container">
      <h2>لیست کوتاژ ها</h2>
      {cottages.length === 0 ? (
        <p className="no-data">No cottages available.</p>
      ) : (
        <ul className="cottage-list">
          {cottages.map((cottage) => (
            <li key={cottage.id} className="cottage-item">
              <div className="cottage-details">
                <span><strong>شماره کوتاژ :</strong> {cottage.cottage_number}</span>
                <span><strong>تاریخ :</strong> {cottage.cottage_date}</span>
                <span><strong>شماره ثبت سفارش :</strong> {cottage.proforma}</span>
                <span><strong>بهای نهایی :</strong> {cottage.final_price}  ریال</span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CottageList;
