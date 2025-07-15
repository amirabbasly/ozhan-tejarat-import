import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchOrders, deletePerformas } from "../actions/performaActions";
import "../components/CottageList.css";
import { Link, useNavigate } from "react-router-dom";
import DatePicker from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import moment from "moment-jalaali";
import DateObject from "react-date-object";
import { formatNumber } from "../utils/numberFormat";

moment.loadPersian({ dialect: "persian-modern" });

const RegedOrderList = () => {
  const navigate = useNavigate();
  const auth = useSelector((state) => state.auth);

  useEffect(() => {
    if (auth.isAuthenticated === false) {
      navigate("/");
    }
  }, [auth.isAuthenticated, navigate]);

  const dispatch = useDispatch();

  // Access orders state from Redux store
  const { orders, loading, error } = useSelector((state) => state.order);

  // States for search, filters, and date range
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [selectedOrders, setSelectedOrders] = useState([]);

  useEffect(() => {
    dispatch(fetchOrders());
  }, [dispatch]);

  useEffect(() => {
    const filtered = orders.filter((order) => {
      const matchesSearchTerm =
        searchTerm.trim() === "" ||
        String(order.prf_order_no ?? "").includes(searchTerm) ||
        (order.prf_seller_name ?? "").includes(searchTerm) ||
        (order.prf_status ?? "").includes(searchTerm);

      const matchesStatus =
        statusFilter === "" ||
        (order.prf_status && order.prf_status === statusFilter);

      // Parse order date into DateObject
      const orderDate = new DateObject({
        date: order.prf_expire_date,
        format: "YYYY/MM/DD",
        calendar: persian,
        locale: persian_fa,
      });

      let matchesDate = true;

      if (startDate) {
        matchesDate = matchesDate && orderDate.unix >= startDate.unix;
      }

      if (endDate) {
        matchesDate = matchesDate && orderDate.unix <= endDate.unix;
      }

      return matchesSearchTerm && matchesStatus && matchesDate;
    });

    setFilteredOrders(filtered);
  }, [orders, searchTerm, statusFilter, startDate, endDate]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleStatusChange = (e) => {
    setStatusFilter(e.target.value);
  };

  const handleDeleteSelectedOrders = () => {
    if (!window.confirm("آیا از حذف سفارش‌های انتخاب شده اطمینان دارید؟")) {
      return;
    }

    dispatch(deletePerformas(selectedOrders))
      .then(() => {
        alert("سفارش‌های انتخاب شده با موفقیت حذف شدند.");
        setSelectedOrders([]); // Clear selected orders
        dispatch(fetchOrders());
      })

      .catch((error) => {
        console.error("Error deleting orders:", error);
        alert("خطا در حذف سفارش‌ها.");
      });
  };

  return (
    <div className="cottage-cont">
      <div className="cottage-list-container">
        <h2>لیست سفارش‌های ثبت‌شده</h2>

        {/* Search and Filters Section */}
        <div className="filter-container">
          <input
            type="text"
            placeholder="جستجو..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="search-input"
          />
          <select
            value={statusFilter}
            onChange={handleStatusChange}
            className="filter-select"
          >
            <option value="">همه وضعیت‌ها</option>
            {[...new Set(orders.map((order) => order.prf_status))].map(
              (status, index) => (
                <option key={index} value={status}>
                  {status}
                </option>
              )
            )}
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

          <button
            onClick={handleDeleteSelectedOrders}
            disabled={selectedOrders.length === 0}
            className="delete-button"
          >
            حذف
          </button>
        </div>

        {loading && <p className="loading">در حال بارگذاری...</p>}
        {error && <p className="error">{error}</p>}
        {!loading &&
          !error &&
          (filteredOrders.length === 0 ? (
            <p className="no-data">
              هیچ سفارشی با این جستجو و فیلترها یافت نشد.
            </p>
          ) : (
            <table className="cottage-table">
              <thead>
                <tr>
                  <th>
                    <input
                      type="checkbox"
                      onChange={(e) => {
                        const isChecked = e.target.checked;
                        if (isChecked) {
                          setSelectedOrders(
                            filteredOrders.map((order) => order.prfVCodeInt)
                          );
                        } else {
                          setSelectedOrders([]);
                        }
                      }}
                    />
                  </th>

                  <th>ردیف</th>
                  <th>شماره سفارش</th>
                  <th>تاریخ سفارش</th>
                  <th>تاریخ اعتبار سفارش</th>
                  <th>مبلغ کل</th>
                  <th>باقیمانده</th>
                  <th>وضعیت</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order, index) => (
                  <tr key={order.id}>
                    <td>
                      <input
                        type="checkbox"
                        checked={selectedOrders.includes(order.prfVCodeInt)}
                        onChange={(e) => {
                          const isChecked = e.target.checked;
                          setSelectedOrders((prev) =>
                            isChecked
                              ? [...prev, order.prfVCodeInt]
                              : prev.filter((id) => id !== order.prfVCodeInt)
                          );
                        }}
                      />
                    </td>

                    <td>{index + 1}</td>
                    <td>{order.prf_order_no}</td>
                    <td>{order.prf_date}</td>
                    <td>{order.prf_expire_date}</td>
                    <td>{formatNumber(order.prf_total_price)}</td>
                    <td>
                      {order.remaining_total > -1
                        ? `باقی مانده : ${formatNumber(order.remaining_total)}`
                        : `مابع تفاوت : ${formatNumber(
                            Math.abs(order.remaining_total)
                          )}`}
                    </td>

                    <td>{order.prf_status || "—"}</td>
                    <td>
                      <Link to={`/order-details/${order.prfVCodeInt}`}>
                        جزئیات
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ))}
      </div>
    </div>
  );
};

export default RegedOrderList;
