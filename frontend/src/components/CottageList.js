import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './CottageList.css';
import { Link } from 'react-router-dom';

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
    <div className='cottage-cont'>
      <div className="cottage-list-container">
        <h2>لیست کوتاژ ها</h2>
        {cottages.length === 0 ? (
          <p className="no-data">No cottages available.</p>
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
                  <td>{cottage.total_value} ریال</td>
                  <td>{cottage.currency_price} ریال</td>
                  <td><Link> جزئیات  </Link></td> 
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default CottageList;
