import React, { useEffect, useState } from "react";
import axiosInstance from "../utils/axiosInstance";
import "./InvoiceList.css"; // Import the CSS file
import { Link } from "react-router-dom";

function SellerList() {
  const [sellers, setSellers] = useState([]);

  useEffect(() => {
    axiosInstance
      .get("documents/sellers/")
      .then((res) => setSellers(res.data))
      .catch((err) => console.error("خطا در دریافت صورتحساب‌ها:", err));
  }, []);

  return (
    <div className="invoice-list-container">
      <h2>فهرست فروشنده ها</h2>
      <table className="invoice-list-table">
        <thead>
          <tr>
            <th>نام فروشنده</th>
            <th>کشور فروشنده</th>
            <th>نام بانک</th>
            <th>جزئیات</th>
          </tr>
        </thead>
        <tbody>
          {sellers.map((slr) => (
            <tr key={slr.id}>
              <td>{slr.seller_name}</td>
              <td>{slr.seller_country}</td>
              <td>{slr.seller_bank_name}</td>

              <td>
                <Link to={`/sellers/details/${slr.id}`}> جزئیات</Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default SellerList;
