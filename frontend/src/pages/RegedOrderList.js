// import React, { useEffect, useState } from "react";
// import { useSelector, useDispatch } from "react-redux";
// import { fetchOrders, deletePerformas } from "../actions/performaActions";
// import "../components/CottageList.css";
// import { Link, useNavigate } from "react-router-dom";
// import DatePicker from "react-multi-date-picker";
// import persian from "react-date-object/calendars/persian";
// import persian_fa from "react-date-object/locales/persian_fa";
// import moment from "moment-jalaali";
// import DateObject from "react-date-object";
// import { formatNumber } from "../utils/numberFormat";

// moment.loadPersian({ dialect: "persian-modern" });

// const RegedOrderList = () => {
//   const navigate = useNavigate();
//   const auth = useSelector((state) => state.auth);

//   useEffect(() => {
//     if (auth.isAuthenticated === false) {
//       navigate("/");
//     }
//   }, [auth.isAuthenticated, navigate]);

//   const dispatch = useDispatch();

//   // Access orders state from Redux store
//   const { orders, loading, error } = useSelector((state) => state.order);

//   // States for search, filters, and date range
//   const [searchTerm, setSearchTerm] = useState("");
//   const [statusFilter, setStatusFilter] = useState("");
//   const [startDate, setStartDate] = useState(null);
//   const [endDate, setEndDate] = useState(null);
//   const [filteredOrders, setFilteredOrders] = useState([]);
//   const [selectedOrders, setSelectedOrders] = useState([]);

//   useEffect(() => {
//     dispatch(fetchOrders());
//   }, [dispatch]);

//   useEffect(() => {
//     const filtered = orders.filter((order) => {
//       const matchesSearchTerm =
//         searchTerm.trim() === "" ||
//         String(order.prf_order_no ?? "").includes(searchTerm) ||
//         (order.prf_seller_name ?? "").includes(searchTerm) ||
//         (order.prf_status ?? "").includes(searchTerm);

//       const matchesStatus =
//         statusFilter === "" ||
//         (order.prf_status && order.prf_status === statusFilter);

//       // Parse order date into DateObject
//       const orderDate = new DateObject({
//         date: order.prf_expire_date,
//         format: "YYYY/MM/DD",
//         calendar: persian,
//         locale: persian_fa,
//       });

//       let matchesDate = true;

//       if (startDate) {
//         matchesDate = matchesDate && orderDate.unix >= startDate.unix;
//       }

//       if (endDate) {
//         matchesDate = matchesDate && orderDate.unix <= endDate.unix;
//       }

//       return matchesSearchTerm && matchesStatus && matchesDate;
//     });

//     setFilteredOrders(filtered);
//   }, [orders, searchTerm, statusFilter, startDate, endDate]);

//   const handleSearchChange = (e) => {
//     setSearchTerm(e.target.value);
//   };

//   const handleStatusChange = (e) => {
//     setStatusFilter(e.target.value);
//   };

//   const handleDeleteSelectedOrders = () => {
//     if (!window.confirm("آیا از حذف سفارش‌های انتخاب شده اطمینان دارید؟")) {
//       return;
//     }

//     dispatch(deletePerformas(selectedOrders))
//       .then(() => {
//         alert("سفارش‌های انتخاب شده با موفقیت حذف شدند.");
//         setSelectedOrders([]); // Clear selected orders
//         dispatch(fetchOrders());
//       })

//       .catch((error) => {
//         console.error("Error deleting orders:", error);
//         alert("خطا در حذف سفارش‌ها.");
//       });
//   };
//   console.log();
  
//   return (
//     <div className="cottage-cont">
//       <div className="cottage-list-container">
//         <h2>لیست سفارش‌های ثبت‌شده</h2>

//         {/* Search and Filters Section */}
//         <div className="filter-container">
//           <input
//             type="text"
//             placeholder="جستجو..."
//             value={searchTerm}
//             onChange={handleSearchChange}
//             className="search-input"
//           />
//           <select
//             value={statusFilter}
//             onChange={handleStatusChange}
//             className="filter-select"
//           >
//             <option value="">همه وضعیت‌ها</option>
//             {[...new Set(orders.map((order) => order.prf_status))].map(
//               (status, index) => (
//                 <option key={index} value={status}>
//                   {status}
//                 </option>
//               )
//             )}
//           </select>
//           <DatePicker
//             value={startDate}
//             onChange={setStartDate}
//             calendar={persian}
//             locale={persian_fa}
//             format="YYYY/MM/DD"
//             placeholder="تاریخ شروع"
//             className="date-picker"
//           />
//           <DatePicker
//             value={endDate}
//             onChange={setEndDate}
//             calendar={persian}
//             locale={persian_fa}
//             format="YYYY/MM/DD"
//             placeholder="تاریخ پایان"
//             className="date-picker"
//           />

//           <button
//             onClick={handleDeleteSelectedOrders}
//             disabled={selectedOrders.length === 0}
//             className="delete-button"
//           >
//             حذف
//           </button>
//         </div>

//         {loading && <p className="loading">در حال بارگذاری...</p>}
//         {error && <p className="error">{error}</p>}
//         {!loading &&
//           !error &&
//           (filteredOrders.length === 0 ? (
//             <p className="no-data">
//               هیچ سفارشی با این جستجو و فیلترها یافت نشد.
//             </p>
//           ) : (
//             <table className="cottage-table">
//               <thead>
//                 <tr>
//                   <th>
//                     <input
//                       type="checkbox"
//                       onChange={(e) => {
//                         const isChecked = e.target.checked;
//                         if (isChecked) {
//                           setSelectedOrders(
//                             filteredOrders.map((order) => order.prfVCodeInt)
//                           );
//                         } else {
//                           setSelectedOrders([]);
//                         }
//                       }}
//                     />
//                   </th>

//                   <th>ردیف</th>
//                   <th>شماره سفارش</th>
//                   <th>تاریخ سفارش</th>
//                   <th>تاریخ اعتبار سفارش</th>
//                   <th>مبلغ کل</th>
//                   <th>باقیمانده</th>
//                   <th>وضعیت</th>
//                   <th></th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {filteredOrders.map((order, index) => (
//                   <tr key={order.id}>
//                     <td>
//                       <input
//                         type="checkbox"
//                         checked={selectedOrders.includes(order.prfVCodeInt)}
//                         onChange={(e) => {
//                           const isChecked = e.target.checked;
//                           setSelectedOrders((prev) =>
//                             isChecked
//                               ? [...prev, order.prfVCodeInt]
//                               : prev.filter((id) => id !== order.prfVCodeInt)
//                           );
//                         }}
//                       />
//                     </td>

//                     <td>{index + 1}</td>
//                     <td>{order.prf_order_no}</td>
//                     <td>{order.prf_date}</td>
//                     <td>{order.prf_expire_date}</td>
//                     <td>{formatNumber(order.prf_total_price)}</td>
//                     <td>
//                       {order.remaining_total > -1
//                         ? `باقی مانده : ${formatNumber(order.remaining_total)}`
//                         : `مابع تفاوت : ${formatNumber(
//                             Math.abs(order.remaining_total)
//                           )}`}
//                     </td>

//                     <td>{order.prf_status || "—"}</td>
//                     <td>
//                       <Link to={`/order-details/${order.prfVCodeInt}`}>
//                         جزئیات
//                       </Link>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           ))}
//       </div>
//     </div>
//   );
// };

// export default RegedOrderList;

// added pagination 


// import React, { useEffect, useState } from "react";
// import { useSelector, useDispatch } from "react-redux";
// import { fetchOrders, deletePerformas } from "../actions/performaActions";
// import { Link, useNavigate } from "react-router-dom";
// import DatePicker from "react-multi-date-picker";
// import persian from "react-date-object/calendars/persian";
// import persian_fa from "react-date-object/locales/persian_fa";
// import moment from "moment-jalaali";
// import Select from "react-select";
// import PaginationControls from "../components/PaginationControls";
// import { formatNumber } from "../utils/numberFormat";
// import "../components/CottageList.css";
// import PropTypes from "prop-types";

// moment.loadPersian({ dialect: "persian-modern" });

// const RegedOrderList = () => {
//   const navigate = useNavigate();
//   const dispatch = useDispatch();

//   // Access orders state from Redux store
//   const { orders, loading, error, count, next, previous } = useSelector((state) => state.order);
//   const auth = useSelector((state) => state.auth);

//   // Authentication check
//   useEffect(() => {
//     if (auth.isAuthenticated === false) {
//       navigate("/");
//     }
//   }, [auth.isAuthenticated, navigate]);

//   // States for search, filters, and pagination
//   const [searchText, setSearchText] = useState("");
//   const [query, setQuery] = useState("");
//   const [statusFilter, setStatusFilter] = useState("");
//   const [startDate, setStartDate] = useState("");
//   const [endDate, setEndDate] = useState("");
//   const [selectedOrders, setSelectedOrders] = useState([]);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [pageSize, setPageSize] = useState(50);

//   // Map status options for Select component
//   const statusOptions = [
//     { value: "", label: "همه وضعیت‌ها" },
//     ...[...new Set(orders.map((order) => order.prf_status))].map((status) => ({
//       value: status,
//       label: status,
//     })),
//   ];

//   // Debounced search
//   useEffect(() => {
//     const handler = setTimeout(() => {
//       setQuery(searchText);
//       setCurrentPage(1);
//     }, 300);

//     return () => clearTimeout(handler);
//   }, [searchText]);

//   // Fetch orders with filters and pagination
//   useEffect(() => {
//     const filters = {
//       search: query,
//       status: statusFilter,
//       startDate: startDate,
//       endDate: endDate,
//     };
//     dispatch(fetchOrders(currentPage, pageSize, filters));
//   }, [dispatch, currentPage, pageSize, query, statusFilter, startDate, endDate]);

//   // Date change handlers
//   const handleStartDateChange = (date) => {
//     if (date && date.format) {
//       setStartDate(date.format("YYYY-MM-DD"));
//     } else {
//       setStartDate("");
//     }
//   };

//   const handleEndDateChange = (date) => {
//     if (date && date.format) {
//       setEndDate(date.format("YYYY-MM-DD"));
//     } else {
//       setEndDate("");
//     }
//   };

  // // Pagination handlers
  // const totalPages = Math.ceil(count / pageSize);
  // const hasNext = !!next;
  // const hasPrevious = !!previous;

  // const handlePageChange = (e) => {
  //   setCurrentPage(Number(e.target.value));
  // };

  // const handleNextPage = () => {
  //   if (hasNext) setCurrentPage((prev) => prev + 1);
  // };

  // const handlePreviousPage = () => {
  //   if (hasPrevious) setCurrentPage((prev) => prev - 1);
  // };

  // const handlePageSizeChange = (e) => {
  //   setPageSize(Number(e.target.value));
  //   setCurrentPage(1);
  // };

  // // Selection handlers
  // const handleSelectOrder = (event, order) => {
  //   const { checked } = event.target;
  //   let updatedSelections;
  //   if (checked) {
  //     updatedSelections = [...selectedOrders, order.prfVCodeInt];
  //   } else {
  //     updatedSelections = selectedOrders.filter((id) => id !== order.prfVCodeInt);
  //   }
  //   setSelectedOrders(updatedSelections);
  // };

  // const handleSelectAll = (event) => {
  //   const { checked } = event.target;
  //   if (checked) {
  //     setSelectedOrders(orders.map((order) => order.prfVCodeInt));
  //   } else {
  //     setSelectedOrders([]);
  //   }
  // };

  // // Delete handler
  // const handleDeleteSelectedOrders = () => {
  //   if (!selectedOrders.length) {
  //     alert("لطفاً حداقل یک سفارش را انتخاب کنید.");
  //     return;
  //   }
  //   if (!window.confirm("آیا از حذف سفارش‌های انتخاب شده اطمینان دارید؟")) {
  //     return;
  //   }
  //   dispatch(deletePerformas(selectedOrders))
  //     .then(() => {
  //       alert("سفارش‌های انتخاب شده با موفقیت حذف شدند.");
  //       setSelectedOrders([]);
  //       dispatch(fetchOrders(currentPage, pageSize, { search: query, status: statusFilter, startDate, endDate }));
  //     })
  //     .catch((error) => {
  //       console.error("Error deleting orders:", error);
  //       alert("خطا در حذف سفارش‌ها.");
  //     });
  // };

//   return (
//     <div className="cottage-cont">
//       <div className="cottage-list-container">
//         <h2>لیست سفارش‌های ثبت‌شده</h2>

//         {/* Search and Filters Section */}
//         <label>جستجو (شماره سفارش/نام فروشنده/وضعیت):</label>
//         <div className="search-bar">
//           <input
//             type="text"
//             placeholder="جستجو..."
//             value={searchText}
//             onChange={(e) => setSearchText(e.target.value)}
//             className="search-input"
//           />
//         </div>

//         <div className="filter-container">
//           <div className="filter-row">
//             <label>وضعیت:</label>
//             <Select
//               className="filter-react-select"
//               value={statusOptions.find((opt) => opt.value === statusFilter) || null}
//               onChange={(opt) => setStatusFilter(opt ? opt.value : "")}
//               options={statusOptions}
//               isLoading={loading}
//               isClearable
//               placeholder={loading ? "در حال بارگذاری..." : error ? "خطا در بارگذاری" : "همه وضعیت‌ها"}
//               noOptionsMessage={() => (loading || error ? "در حال بارگذاری..." : "وضعیتی موجود نیست")}
//             />
//           </div>
//           <div className="filter-row">
//             <label>تاریخ شروع:</label>
//             <DatePicker
//               value={startDate}
//               onChange={handleStartDateChange}
//               calendar={persian}
//               locale={persian_fa}
//               format="YYYY-MM-DD"
//               numerals="en"
//               placeholder="تاریخ شروع"
//               className="date-picker"
//               clearable
//             />
//           </div>
//           <div className="filter-row">
//             <label>تاریخ پایان:</label>
//             <DatePicker
//               value={endDate}
//               onChange={handleEndDateChange}
//               calendar={persian}
//               locale={persian_fa}
//               format="YYYY-MM-DD"
//               numerals="en"
//               placeholder="تاریخ پایان"
//               className="date-picker"
//               clearable
//             />
//           </div>
//         </div>

//         <button
//           onClick={handleDeleteSelectedOrders}
//           disabled={!selectedOrders.length}
//           className="delete-button"
//         >
//           حذف سفارش‌های انتخاب شده
//         </button>

//         {/* Loading/Error */}
//         {loading && <p className="loading">در حال بارگذاری...</p>}
//         {error && <p className="error">{error}</p>}

//         {/* Display Table & Pagination */}
//         {!loading && !error && (
//           <>
//             {orders.length === 0 ? (
//               <p className="no-data">هیچ سفارشی با این جستجو و فیلترها یافت نشد.</p>
//             ) : (
//               <>
//                 <PaginationControls
//                   currentPage={currentPage}
//                   totalPages={totalPages}
//                   pageSize={pageSize}
//                   pageSizeOptions={[10, 20, 50, 100, 200]}
//                   hasNext={hasNext}
//                   hasPrevious={hasPrevious}
//                   onPageChange={handlePageChange}
//                   onNextPage={handleNextPage}
//                   onPreviousPage={handlePreviousPage}
//                   onPageSizeChange={handlePageSizeChange}
//                 />
//                 <table className="cottage-table">
//                   <thead>
//                     <tr>
//                       <th>
//                         <input
//                           type="checkbox"
//                           onChange={handleSelectAll}
//                           checked={selectedOrders.length === orders.length && orders.length > 0}
//                         />
//                       </th>
//                       <th>ردیف</th>
//                       <th>شماره سفارش</th>
//                       <th>تاریخ سفارش</th>
//                       <th>تاریخ اعتبار سفارش</th>
//                       <th>مبلغ کل</th>
//                       <th>باقیمانده</th>
//                       <th>وضعیت</th>
//                       <th></th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {orders.map((order, index) => (
//                       <tr key={order.id}>
//                         <td>
//                           <input
//                             type="checkbox"
//                             checked={selectedOrders.includes(order.prfVCodeInt)}
//                             onChange={(e) => handleSelectOrder(e, order)}
//                           />
//                         </td>
//                         <td>{index + 1}</td>
//                         <td>{order.prf_order_no}</td>
//                         <td>{order.prf_date}</td>
//                         <td>{order.prf_expire_date}</td>
//                         <td>{formatNumber(order.prf_total_price)}</td>
//                         <td>
//                           {order.remaining_total > -1
//                             ? `باقی مانده : ${formatNumber(order.remaining_total)}`
//                             : `مابع تفاوت : ${formatNumber(Math.abs(order.remaining_total))}`}
//                         </td>
//                         <td>{order.prf_status || "—"}</td>
//                         <td>
//                           <Link to={`/order-details/${order.prfVCodeInt}`}>
//                             جزئیات
//                           </Link>
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//                 <PaginationControls
//                   currentPage={currentPage}
//                   totalPages={totalPages}
//                   pageSize={pageSize}
//                   pageSizeOptions={[10, 20, 50, 100, 200]}
//                   hasNext={hasNext}
//                   hasPrevious={hasPrevious}
//                   onPageChange={handlePageChange}
//                   onNextPage={handleNextPage}
//                   onPreviousPage={handlePreviousPage}
//                   onPageSizeChange={handlePageSizeChange}
//                 />
//               </>
//             )}
//           </>
//         )}
//       </div>
//     </div>
//   );
// };

// // PropTypes for type checking
// RegedOrderList.propTypes = {
//   // No props are passed to RegedOrderList, but adding PropTypes for consistency
// };

// export default RegedOrderList;



import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchOrders, deletePerformas } from "../actions/performaActions";
import { Link, useNavigate } from "react-router-dom";
import DatePicker from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import moment from "moment-jalaali";
import Select from "react-select";
import PaginationControls from "../components/PaginationControls";
import { formatNumber } from "../utils/numberFormat";
import "../style/CottageList.css";
import PropTypes from "prop-types";

moment.loadPersian({ dialect: "persian-modern" });

const RegedOrderList = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Access orders state from Redux store
  const { orders, loading, error, count, next, previous } = useSelector((state) => state.order);
  const auth = useSelector((state) => state.auth);

  // Authentication check
  useEffect(() => {
    if (auth.isAuthenticated === false) {
      navigate("/");
    }
  }, [auth.isAuthenticated, navigate]);

  // States for search, filters, and pagination
  const [searchText, setSearchText] = useState("");
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [selectedOrders, setSelectedOrders] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(50);
  const [currency, setCurrency] = useState(""); // Default currency is EUR

  // Currency options
  const currencyOptions = [
    { value: "یورو", label: "یورو" },
    { value: "دلار", label: "دلار" },
    { value: "ریال", label: "ریال" },
    { value: "یوان", label: "یوان" },
    { value: "درهم", label: "درهم" },
  ];

  // Map status options for Select component
  const statusOptions = [
    { value: "", label: "همه وضعیت‌ها" },
    ...[...new Set(orders.map((order) => order.prf_status))].map((status) => ({
      value: status,
      label: status,
    })),
  ];

  // Debounced search
  useEffect(() => {
    const handler = setTimeout(() => {
      setQuery(searchText);
      setCurrentPage(1);
    }, 300);

    return () => clearTimeout(handler);
  }, [searchText]);

  // Fetch orders with filters and pagination
  useEffect(() => {
    const filters = {
      search: query,
      status: statusFilter,
      startDate: startDate,
      endDate: endDate,
      currency: currency, // Add currency to filters
    };
    dispatch(fetchOrders(currentPage, pageSize, filters));
  }, [dispatch, currentPage, pageSize, query, statusFilter, startDate, endDate, currency]);

  // Date change handlers
  const handleStartDateChange = (date) => {
    if (date && date.format) {
      setStartDate(date.format("YYYY-MM-DD"));
    } else {
      setStartDate("");
    }
  };

  const handleEndDateChange = (date) => {
    if (date && date.format) {
      setEndDate(date.format("YYYY-MM-DD"));
    } else {
      setEndDate("");
    }
  };

  // Pagination handlers
  const totalPages = Math.ceil(count / pageSize);
  const hasNext = !!next;
  const hasPrevious = !!previous;

  const handlePageChange = (e) => {
    setCurrentPage(Number(e.target.value));
  };

  const handleNextPage = () => {
    if (hasNext) setCurrentPage((prev) => prev + 1);
  };

  const handlePreviousPage = () => {
    if (hasPrevious) setCurrentPage((prev) => prev - 1);
  };

  const handlePageSizeChange = (e) => {
    setPageSize(Number(e.target.value));
    setCurrentPage(1);
  };

  // Selection handlers
  const handleSelectOrder = (event, order) => {
    const { checked } = event.target;
    let updatedSelections;
    if (checked) {
      updatedSelections = [...selectedOrders, order.prfVCodeInt];
    } else {
      updatedSelections = selectedOrders.filter((id) => id !== order.prfVCodeInt);
    }
    setSelectedOrders(updatedSelections);
  };

  const handleSelectAll = (event) => {
    const { checked } = event.target;
    if (checked) {
      setSelectedOrders(orders.map((order) => order.prfVCodeInt));
    } else {
      setSelectedOrders([]);
    }
  };

  // Delete handler
  const handleDeleteSelectedOrders = () => {
    if (!selectedOrders.length) {
      alert("لطفاً حداقل یک سفارش را انتخاب کنید.");
      return;
    }
    if (!window.confirm("آیا از حذف سفارش‌های انتخاب شده اطمینان دارید؟")) {
      return;
    }
    dispatch(deletePerformas(selectedOrders))
      .then(() => {
        alert("سفارش‌های انتخاب شده با موفقیت حذف شدند.");
        setSelectedOrders([]);
        dispatch(fetchOrders(currentPage, pageSize, { search: query, status: statusFilter, startDate, endDate }));
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
        <label>جستجو (شماره سفارش/نام فروشنده/وضعیت):</label>
        <div className="search-bar">
          <input
            type="text"
            placeholder="جستجو..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="filter-container">
          <div className="filter-row">
            <label>وضعیت:</label>
            <Select
              className="filter-react-select"
              value={statusOptions.find((opt) => opt.value === statusFilter) || null}
              onChange={(opt) => setStatusFilter(opt ? opt.value : "")}
              options={statusOptions}
              isLoading={loading}
              isClearable
              placeholder={loading ? "در حال بارگذاری..." : error ? "خطا در بارگذاری" : "همه وضعیت‌ها"}
              noOptionsMessage={() => (loading || error ? "در حال بارگذاری..." : "وضعیتی موجود نیست")}
            />
          </div>
          
          {/* New Currency Filter */}
          <div className="filter-row">
            <label>ارز:</label>
            <Select
              className="filter-react-select"
              value={currencyOptions.find((opt) => opt.value === currency)}
              onChange={(opt) => setCurrency(opt ? opt.value : "EUR")}
              options={currencyOptions}
              placeholder="انتخاب ارز"
            />
          </div>
          
          <div className="filter-row">
            <label>تاریخ شروع:</label>
            <DatePicker
              value={startDate}
              onChange={handleStartDateChange}
              calendar={persian}
              locale={persian_fa}
              format="YYYY-MM-DD"
              numerals="en"
              placeholder="تاریخ شروع"
              className="date-picker"
              clearable
            />
          </div>
          <div className="filter-row">
            <label>تاریخ پایان:</label>
            <DatePicker
              value={endDate}
              onChange={handleEndDateChange}
              calendar={persian}
              locale={persian_fa}
              format="YYYY-MM-DD"
              numerals="en"
              placeholder="تاریخ پایان"
              className="date-picker"
              clearable
            />
          </div>
        </div>
        <button
          onClick={handleDeleteSelectedOrders}
          disabled={!selectedOrders.length}
          className="delete-button"
        >
          حذف سفارش‌های انتخاب شده
        </button>

        {/* Loading/Error */}
        {loading && <p className="loading">در حال بارگذاری...</p>}
        {error && <p className="error">{error}</p>}

        {/* Display Table & Pagination */}
        {!loading && !error && (
          <>
            {orders.length === 0 ? (
              <p className="no-data">هیچ سفارشی با این جستجو و فیلترها یافت نشد.</p>
            ) : (
              <>
                <PaginationControls
                  currentPage={currentPage}
                  totalPages={totalPages}
                  pageSize={pageSize}
                  pageSizeOptions={[10, 20, 50, 100, 200]}
                  hasNext={hasNext}
                  hasPrevious={hasPrevious}
                  onPageChange={handlePageChange}
                  onNextPage={handleNextPage}
                  onPreviousPage={handlePreviousPage}
                  onPageSizeChange={handlePageSizeChange}
                />
                <table className="cottage-table">
                  <thead>
                    <tr>
                      <th>
                        <input
                          type="checkbox"
                          onChange={handleSelectAll}
                          checked={selectedOrders.length === orders.length && orders.length > 0}
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
                    {orders.map((order, index) => (
                      <tr key={order.id}>
                        <td>
                          <input
                            type="checkbox"
                            checked={selectedOrders.includes(order.prfVCodeInt)}
                            onChange={(e) => handleSelectOrder(e, order)}
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
                            : `مابع تفاوت : ${formatNumber(Math.abs(order.remaining_total))}`}
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
                <PaginationControls
                  currentPage={currentPage}
                  totalPages={totalPages}
                  pageSize={pageSize}
                  pageSizeOptions={[10, 20, 50, 100, 200]}
                  hasNext={hasNext}
                  hasPrevious={hasPrevious}
                  onPageChange={handlePageChange}
                  onNextPage={handleNextPage}
                  onPreviousPage={handlePreviousPage}
                  onPageSizeChange={handlePageSizeChange}
                />
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};

RegedOrderList.propTypes = {
  // No props are passed to RegedOrderList, but adding PropTypes for consistency
};

export default RegedOrderList;