import React, { useEffect, useState } from "react";
import axiosInstance from "../utils/axiosInstance";
import "./InvoiceList.css"; // Import the CSS file
import { Link } from "react-router-dom";

function BuyerList() {
  const [buyers, setBuyers] = useState([]);

  useEffect(() => {
    axiosInstance
      .get("documents/buyers/")
      .then((res) => setBuyers(res.data))
      .catch((err) => console.error("خطا در دریافت اطلاعات:", err));
  }, []);

  return (
    <div className="invoice-list-container">
      <h2>فهرست خریدار ها</h2>
      <table className="invoice-list-table">
        <thead>
          <tr>
            <th>نام فروشنده</th>
            <th>آدرس فروشنده</th>
            <th>نام بانک</th>
            <th>جزئیات</th>
          </tr>
        </thead>
        <tbody>
          {buyers.map((byr) => (
            <tr key={byr.id}>
              <td>{byr.buyer_name}</td>
              <td>{byr.buyer_address}</td>
              <td>{byr.buyer_tel}</td>

              <td>
                <Link to={`/buyers/details/${byr.id}`}> جزئیات</Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default BuyerList;
