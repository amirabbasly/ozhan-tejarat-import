import React, { useEffect } from "react";
import "./InvoiceList.css"; // Import the CSS file
import { Link } from "react-router-dom";
import { fetchCostumers } from "../actions/authActions";
import { useDispatch, useSelector } from "react-redux";

function CustomerList() {
  const costumerstate = useSelector((state) => state.costumers);

  const { costumerList, customersLoading, customersError } = costumerstate || {
    costumerList: [],
    costumersLoading: false,
    costumersError: null,
  };
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchCostumers());
  }, [dispatch]);

  return (
    <div className="invoice-list-container">
      <h2>فهرست مشتری ها</h2>
      <table className="invoice-list-table">
        <thead>
          <tr>
            <th>نام مشتری</th>
            <th>شماره تماس مشتری</th>
            <th>کد ملی مشتری</th>
            <th>جزئیات</th>
          </tr>
        </thead>
        <tbody>
          {costumerList.map((cmr) => (
            <tr key={cmr.id}>
              <td>{cmr.full_name}</td>
              <td>{cmr.phone_number}</td>
              <td>{cmr.national_code}</td>

              <td>
                <Link to={`/sellers/details/${cmr.id}`}> جزئیات</Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default CustomerList;
