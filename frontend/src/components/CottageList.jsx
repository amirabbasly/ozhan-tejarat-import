// import React, { useEffect, useState } from "react";
// import { useSelector, useDispatch } from "react-redux";
// import {
//   fetchCottages,
//   updateCottageCurrencyPrice,
//   deleteCottages,
// } from "../actions/cottageActions";
// import { fetchOrders } from "../actions/performaActions";
// import { Link, useNavigate } from "react-router-dom";
// import { formatNumber } from "../utils/numberFormat";
// import "../style/CottageList.css";
// import PaginationControls from "./PaginationControls";
// import Select from "react-select";
// import DatePicker from "react-multi-date-picker";
// import persian from "react-date-object/calendars/persian";
// import persian_fa from "react-date-object/locales/persian_fa";
// import moment from "moment-jalaali";
// import { fetchCostumers } from "../actions/authActions";
// import axiosInstance from "../utils/axiosInstance";
// import { toast } from "react-toastify"; // 🆕 Added for notifications
// import "react-toastify/dist/ReactToastify.css"; // 🆕 Added for toast styling

// const CottageList = () => {
//   const navigate = useNavigate();
//   const auth = useSelector((state) => state.auth);
//   const orders = useSelector((state) => state.order.orders);
//   const orderOptions = orders.map((order) => ({
//     value: order.prf_order_no,
//     label: order.prf_order_no,
//   }));
//   const costumerstate = useSelector((state) => state.costumers);
//   const { costumerList, costumersLoading, costumersError } = costumerstate || {
//     costumerList: [],
//     costumersLoading: false,
//     costumersError: null,
//   };

//   useEffect(() => {
//     if (auth.isAuthenticated === false) {
//       navigate("/");
//     }
//   }, [auth.isAuthenticated, navigate]);

//   // -------------------- BOOLEAN FILTERS --------------------
//   const [rafeeTaahod, setRafeeTaahod] = useState("");
//   const [docsRecieved, setDocsRecieved] = useState("");
//   const [rewatchStatus, setRewatchStatus] = useState("");

//   const dispatch = useDispatch();
//   const [searchText, setSearchText] = useState("");
//   const [query, setQuery] = useState("");
//   const [automationLoading, setAutomationLoading] = useState(false); // 🆕 Added for automation loading state

//   const handleSearchButtonClick = () => {
//     setQuery(searchText);
//     setCurrentPage(1);
//   };

//   useEffect(() => {
//     const handler = setTimeout(() => {
//       setQuery(searchText);
//       setCurrentPage(1);
//     }, 300);

//     return () => clearTimeout(handler);
//   }, [searchText]);

//   // Access cottages state from Redux store
//   const {
//     cottages,
//     loading,
//     error,
//     next,
//     previous,
//     count,
//     updatingCurrencyPrice,
//     updateCurrencyPriceError,
//   } = useSelector((state) => state.cottages);

//   // -------------------- PAGINATION STATE --------------------
//   const [currentPage, setCurrentPage] = useState(1);
//   const [pageSize, setPageSize] = useState(50);
//   const totalPages = Math.ceil(count / pageSize);
//   const [cottageDate, setCottageDate] = useState("");
//   const [cottageDateBefore, setCottageDateBefore] = useState("");
//   const [prfOrderNo, setPrfOrderNo] = useState("");

//   const convertToWesternDigits = (str) => {
//     if (typeof str !== "string") return str;
//     const easternDigits = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];
//     const westernDigits = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
//     return str.replace(
//       /[۰-۹]/g,
//       (d) => westernDigits[easternDigits.indexOf(d)]
//     );
//   };

//   const handleCottageDateChange = (date) => {
//     if (date && date.format) {
//       setCottageDate(date.format("YYYY-MM-DD"));
//     } else {
//       setCottageDate("");
//     }
//   };

//   const handleCottageDateBeforeChange = (date) => {
//     if (date && date.format) {
//       setCottageDateBefore(date.format("YYYY-MM-DD"));
//     } else {
//       setCottageDateBefore("");
//     }
//   };

//   const handleExport = async () => {
//     if (!selectedCottages.length) {
//       alert("لطفاً حداقل یک کوتاژ را انتخاب کنید.");
//       return;
//     }

//     const cottageNumbers = selectedCottages.map((c) => c.cottage_number);
//     try {
//       const res = await axiosInstance.post(
//         "/export-cottages-excel/",
//         { cottage_numbers: cottageNumbers },
//         { responseType: "blob" }
//       );

//       const blob = new Blob([res.data], {
//         type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
//       });
//       const url = window.URL.createObjectURL(blob);
//       const link = document.createElement("a");
//       link.href = url;
//       const filename = `cottages_${new Date().toISOString().slice(0, 10)}.xlsx`;
//       link.setAttribute("download", filename);
//       document.body.appendChild(link);
//       link.click();
//       link.remove();
//       window.URL.revokeObjectURL(url);
//     } catch (err) {
//       console.error("Export error:", err);
//       alert("خطا در صدور فایل اکسل.");
//     }
//   };

//   // 🆕 Start EPL automation for selected cottages
//   const handleStartAutomation = async () => {
//     if (!selectedCottages.length) {
//       toast.warn("لطفاً حداقل یک کوتاژ را انتخاب کنید.");
//       return;
//     }

//     const cottageNumbers = selectedCottages.map((c) => c.cottage_number);

//     try {
//       setAutomationLoading(true);
//       const res = await axiosInstance.post("/start-epl-automation/", {
//         cottage_numbers: cottageNumbers,
//       });
//       toast.success(res.data.message || "اتوماسیون آغاز شد.");
//     } catch (err) {
//       console.error("Automation error:", err);
//       toast.error(
//         err.response?.data?.error || "خطا در راه‌اندازی اتوماسیون EPL."
//       );
//     } finally {
//       setAutomationLoading(false);
//     }
//   };

//   useEffect(() => {
//     dispatch(fetchCostumers());
//     dispatch(fetchOrders());
//     const filters = {
//       search: query,
//       cottageDate: convertToWesternDigits(cottageDate),
//       cottageDateBefore: convertToWesternDigits(cottageDateBefore),
//       prfOrderNo,
//       ...(rafeeTaahod && { rafee_taahod: rafeeTaahod }),
//       ...(docsRecieved && { docs_recieved: docsRecieved }),
//       ...(rewatchStatus && { rewatch: rewatchStatus }),
//     };

//     console.log("Dispatching filters:", filters);
//     console.log("Cottage Date before sending:", filters.cottageDate);

//     dispatch(fetchCottages(currentPage, pageSize, filters));
//   }, [
//     dispatch,
//     currentPage,
//     pageSize,
//     query,
//     cottageDate,
//     prfOrderNo,
//     cottageDateBefore,
//     rafeeTaahod,
//     docsRecieved,
//     rewatchStatus,
//   ]);

//   const hasNext = !!next;
//   const hasPrevious = !!previous;

//   const handlePageChange = (e) => {
//     setCurrentPage(Number(e.target.value));
//   };

//   const handleNextPage = () => {
//     if (hasNext) setCurrentPage((prev) => prev + 1);
//   };

//   const handlePreviousPage = () => {
//     if (hasPrevious) setCurrentPage((prev) => prev - 1);
//   };

//   const handlePageSizeChange = (e) => {
//     setPageSize(Number(e.target.value));
//     setCurrentPage(1);
//   };

//   // -------------------- SELECTED COTTAGES LOGIC --------------------
//   const [selectedCottages, setSelectedCottages] = useState([]);
//   const [areAllSelected, setAreAllSelected] = useState(false);
//   const [currencyPrice, setCurrencyPrice] = useState("");

//   const handleSelectCottage = (event, cottage) => {
//     const { checked } = event.target;
//     let updatedSelections;
//     if (checked) {
//       updatedSelections = [...selectedCottages, cottage];
//     } else {
//       updatedSelections = selectedCottages.filter((c) => c.id !== cottage.id);
//     }
//     setSelectedCottages(updatedSelections);
//     setAreAllSelected(updatedSelections.length === cottages.length);
//   };

//   const handleSelectAll = (event) => {
//     const { checked } = event.target;
//     setAreAllSelected(checked);
//     if (checked) {
//       setSelectedCottages(cottages);
//     } else {
//       setSelectedCottages([]);
//     }
//   };

//   // -------------------- UPDATE & DELETE ACTIONS --------------------
//   const handleApplyCurrencyPrice = () => {
//     if (!selectedCottages.length || !currencyPrice) {
//       alert("لطفاً حداقل یک کوتاژ را انتخاب کرده و نرخ ارز را وارد کنید.");
//       return;
//     }
//     const updatePromises = selectedCottages.map((cottage) =>
//       dispatch(updateCottageCurrencyPrice(cottage.id, currencyPrice))
//     );
//     Promise.all(updatePromises)
//       .then(() => {
//         alert("نرخ ارز برای اظهارنامه های انتخاب شده به‌روزرسانی شد.");
//         dispatch(fetchCottages(currentPage));
//       })
//       .catch((error) => {
//         console.error("Error updating currency price:", error);
//         alert("خطا در به‌روزرسانی نرخ ارز برای برخی از کوتاژها.");
//       });
//   };

//   const booleanOptions = [
//     { value: "", label: "همه" },
//     { value: "True", label: "بله" },
//     { value: "False", label: "خیر" },
//   ];

//   const handleDeleteSelectedCottages = () => {
//     if (!selectedCottages.length) {
//       alert("لطفاً حداقل یک کوتاژ را انتخاب کنید.");
//       return;
//     }
//     if (!window.confirm("آیا از حذف کوتاژهای انتخاب شده اطمینان دارید؟")) {
//       return;
//     }
//     const idsToDelete = selectedCottages.map((cottage) => cottage.id);
//     dispatch(deleteCottages(idsToDelete))
//       .then(() => {
//         alert("کوتاژهای انتخاب شده با موفقیت حذف شدند.");
//         setSelectedCottages([]);
//         dispatch(fetchCottages(currentPage));
//       })
//       .catch((error) => {
//         console.error("Error deleting cottages:", error);
//         alert("خطا در حذف کوتاژها.");
//       });
//   };

//   return (
//     <div className="cottage-cont">
//       <div className="cottage-list-container">
//         <h2>لیست اظهارنامه ها</h2>

//         {/* SIMPLE SEARCH BAR (NO FILTERING) */}
//         <label>جستجو (کد/نام فارسی/نام انگلیسی):</label>
//         <div className="search-bar">
//           <input
//             type="text"
//             placeholder="Type your search..."
//             value={searchText}
//             onChange={(e) => setSearchText(e.target.value)}
//           />
//         </div>

//         <div className="filter-container">
//           <div className="filter-row">
//             <label>ثبت سفارش:</label>
//             <Select
//               name="proforma"
//               className="filter-react-select"
//               value={
//                 orderOptions.find((option) => option.value === prfOrderNo) ||
//                 null
//               }
//               onChange={(selectedOption) =>
//                 setPrfOrderNo(selectedOption ? selectedOption.value : "")
//               }
//               options={orderOptions}
//               isLoading={loading}
//               isClearable
//               placeholder={
//                 loading
//                   ? "در حال بارگذاری..."
//                   : error
//                   ? "خطا در بارگذاری"
//                   : "انتخاب سفارش"
//               }
//               noOptionsMessage={() =>
//                 !loading && !error ? "سفارشی موجود نیست" : "در حال بارگذاری..."
//               }
//             />
//           </div>
//           <div className="filter-row">
//             <label>تاریخ شروع:</label>
//             <DatePicker
//               value={cottageDate}
//               onChange={handleCottageDateChange}
//               calendar={persian}
//               locale={persian_fa}
//               isClearable
//               format="YYYY-MM-DD"
//               numerals="en"
//               placeholder="تاریخ شروع"
//               className="date-picker"
//               clearable
//             />
//           </div>
//           <div className="filter-row">
//             <label>تاریخ پایین:</label>
//             <DatePicker
//               value={cottageDateBefore}
//               onChange={handleCottageDateBeforeChange}
//               calendar={persian}
//               locale={persian_fa}
//               format="YYYY-MM-DD"
//               numerals="en"
//               placeholder="تاریخ پایان"
//               className="date-picker"
//               clearable
//             />
//           </div>
//           <div className="filter-row">
//             <label>رفع تعهد:</label>
//             <Select
//               className="filter-react-select"
//               options={booleanOptions}
//               value={
//                 booleanOptions.find((opt) => opt.value === rafeeTaahod) || null
//               }
//               onChange={(opt) => setRafeeTaahod(opt ? opt.value : "")}
//               placeholder="همه"
//             />
//           </div>
//           <div className="filter-row">
//             <label>اخذ مدارک:</label>
//             <Select
//               className="filter-react-select"
//               options={booleanOptions}
//               value={
//                 booleanOptions.find((opt) => opt.value === docsRecieved) || null
//               }
//               onChange={(opt) => setDocsRecieved(opt ? opt.value : "")}
//               placeholder="همه"
//             />
//           </div>
//           <div className="filter-row">
//             <label>بازبینی:</label>
//             <Select
//               className="filter-react-select"
//               options={booleanOptions}
//               value={
//                 booleanOptions.find((opt) => opt.value === rewatchStatus) ||
//                 null
//               }
//               onChange={(opt) => setRewatchStatus(opt ? opt.value : "")}
//               placeholder="همه"
//             />
//           </div>
//         </div>

//         <button
//           onClick={handleDeleteSelectedCottages}
//           disabled={!selectedCottages.length}
//           className="delete-button"
//         >
//           حذف کوتاژهای انتخاب شده
//         </button>
//         <button
//           onClick={handleExport}
//           disabled={!selectedCottages.length}
//           className="export-button"
//           style={{ marginLeft: "1rem" }}
//         >
//           صادر به اکسل
//         </button>
//         {/* 🆕 Start EPL Automation Button */}
//         <button
//           onClick={handleStartAutomation}
//           disabled={!selectedCottages.length || automationLoading}
//           className="export-button"
//           style={{ marginLeft: "1rem" }}
//         >
//           {automationLoading ? "در حال اجرا..." : "شروع اتوماسیون EPL"}
//         </button>

//         {loading && <p className="loading">در حال بارگذاری...</p>}
//         {error && <p className="error">{error}</p>}

//         {!loading &&
//           !error &&
//           (cottages.length === 0 ? (
//             <p className="no-data">هیچ اظهارنامه ای یافت نشد.</p>
//           ) : (
//             <>
//               <PaginationControls
//                 currentPage={currentPage}
//                 totalPages={totalPages}
//                 pageSize={pageSize}
//                 pageSizeOptions={[10, 20, 50, 100, 200]}
//                 hasNext={hasNext}
//                 hasPrevious={hasPrevious}
//                 onPageChange={handlePageChange}
//                 onNextPage={handleNextPage}
//                 onPreviousPage={handlePreviousPage}
//                 onPageSizeChange={handlePageSizeChange}
//               />

//               <table className="cottage-table">
//                 <thead>
//                   <tr>
//                     <th>
//                       <input
//                         type="checkbox"
//                         onChange={handleSelectAll}
//                         checked={areAllSelected}
//                       />
//                     </th>
//                     <th>ردیف</th>
//                     <th>شماره کوتاژ</th>
//                     <th>تاریخ</th>
//                     <th>شماره پرفورم</th>
//                     <th>شماره ثبت سفارش</th>
//                     <th>نام مشتری</th>
//                     <th>ارزش کل</th>
//                     <th>ارزش گمرکی</th>
//                     <th>هزینه ها</th>
//                     <th>نرخ ارز</th>
//                     <th>ارزش افزوده</th>
//                     <th>رفع تعهد</th>
//                     <th>اخذ مدارک</th>
//                     <th>بازبینی</th>
//                     <th></th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {cottages.map((cottage, index) => {
//                     const customer = costumerList.find(
//                       (cust) => cust.id === cottage.cottage_customer
//                     );

//                     return (
//                       <tr key={cottage.id}>
//                         <td>
//                           <input
//                             type="checkbox"
//                             checked={selectedCottages.some(
//                               (selectedCottage) =>
//                                 selectedCottage.id === cottage.id
//                             )}
//                             onChange={(e) => handleSelectCottage(e, cottage)}
//                           />
//                         </td>
//                         <td>{index + 1}</td>
//                         <td>{cottage.cottage_number}</td>
//                         <td>{cottage.cottage_date}</td>
//                         <td>{cottage.proforma.prf_number}</td>
//                         <td>
//                           <Link
//                             to={`/order-details/${cottage.proforma.prfVCodeInt}`}
//                           >
//                             {cottage.proforma.prf_order_no}
//                           </Link>
//                         </td>
//                         <td>{customer ? customer.full_name : "—"}</td>
//                         <td>{formatNumber(cottage.total_value)}</td>
//                         <td>{formatNumber(cottage.customs_value)}</td>
//                         <td>{formatNumber(cottage.total_expenses)}</td>
//                         <td>
//                           {updatingCurrencyPrice &&
//                           updatingCurrencyPrice[cottage.id] ? (
//                             <span className="loading">
//                               در حال به‌روزرسانی...
//                             </span>
//                           ) : updateCurrencyPriceError &&
//                             updateCurrencyPriceError[cottage.id] ? (
//                             <span className="error">
//                               {typeof updateCurrencyPriceError[cottage.id] ===
//                               "string"
//                                 ? updateCurrencyPriceError[cottage.id]
//                                 : JSON.stringify(
//                                     updateCurrencyPriceError[cottage.id]
//                                   )}
//                             </span>
//                           ) : cottage.currency_price ? (
//                             `${cottage.currency_price} ریال`
//                           ) : (
//                             "—"
//                           )}
//                         </td>
//                         <td>{formatNumber(cottage.added_value)}</td>
//                         <td>{cottage.rafee_taahod ? "بله" : "خیر"}</td>
//                         <td>{cottage.docs_recieved ? "بله" : "خیر"}</td>
//                         <td>{cottage.rewatch ? "بله" : "خیر"}</td>
//                         <td>
//                           <Link to={`/cottages/${cottage.cottage_number}`}>
//                             جزئیات
//                           </Link>
//                         </td>
//                       </tr>
//                     );
//                   })}
//                 </tbody>
//               </table>

//               <PaginationControls
//                 currentPage={currentPage}
//                 totalPages={totalPages}
//                 pageSize={pageSize}
//                 pageSizeOptions={[10, 20, 50, 100, 200]}
//                 hasNext={hasNext}
//                 hasPrevious={hasPrevious}
//                 onPageChange={handlePageChange}
//                 onNextPage={handleNextPage}
//                 onPreviousPage={handlePreviousPage}
//                 onPageSizeChange={handlePageSizeChange}
//               />
//             </>
//           ))}
//       </div>
//     </div>
//   );
// };

// export default CottageList;

import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchCottages,
  updateCottageCurrencyPrice,
  deleteCottages,
} from "../actions/cottageActions";
import { fetchOrders } from "../actions/performaActions";
import { Link, useNavigate } from "react-router-dom";
import { formatNumber } from "../utils/numberFormat";
import "../style/CottageList.css";
import PaginationControls from "./PaginationControls";
import Select from "react-select";
import DatePicker from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import moment from "moment-jalaali";
import { fetchCostumers } from "../actions/authActions";
import axiosInstance from "../utils/axiosInstance";
import { toast } from "react-toastify"; // 🆕 Added for notifications
import "react-toastify/dist/ReactToastify.css"; // 🆕 Added for toast styling

const CottageList = () => {
  const navigate = useNavigate();
  const auth = useSelector((state) => state.auth);
  const orders = useSelector((state) => state.order.orders);
  const orderOptions = orders.map((order) => ({
    value: order.prf_order_no,
    label: order.prf_order_no,
  }));
  const costumerstate = useSelector((state) => state.costumers);
  const { costumerList, costumersLoading, costumersError } = costumerstate || {
    costumerList: [],
    costumersLoading: false,
    costumersError: null,
  };

  useEffect(() => {
    if (auth.isAuthenticated === false) {
      navigate("/");
    }
  }, [auth.isAuthenticated, navigate]);

  // -------------------- BOOLEAN FILTERS --------------------
  const [rafeeTaahod, setRafeeTaahod] = useState("");
  const [docsRecieved, setDocsRecieved] = useState("");
  const [rewatchStatus, setRewatchStatus] = useState("");

  const dispatch = useDispatch();
  const [searchText, setSearchText] = useState("");
  const [query, setQuery] = useState("");
  const [automationLoading, setAutomationLoading] = useState(false); // 🆕 Added for automation loading state

  const handleSearchButtonClick = () => {
    setQuery(searchText);
    setCurrentPage(1);
  };

  useEffect(() => {
    const handler = setTimeout(() => {
      setQuery(searchText);
      setCurrentPage(1);
    }, 300);

    return () => clearTimeout(handler);
  }, [searchText]);

  // Access cottages state from Redux store
  const {
    cottages,
    loading,
    error,
    next,
    previous,
    count,
    updatingCurrencyPrice,
    updateCurrencyPriceError,
  } = useSelector((state) => state.cottages);

  // -------------------- PAGINATION STATE --------------------
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(50);
  const totalPages = Math.ceil(count / pageSize);
  const [cottageDate, setCottageDate] = useState("");
  const [cottageDateBefore, setCottageDateBefore] = useState("");
  const [prfOrderNo, setPrfOrderNo] = useState("");

  const convertToWesternDigits = (str) => {
    if (typeof str !== "string") return str;
    const easternDigits = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];
    const westernDigits = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
    return str.replace(
      /[۰-۹]/g,
      (d) => westernDigits[easternDigits.indexOf(d)]
    );
  };

  const handleCottageDateChange = (date) => {
    if (date && date.format) {
      setCottageDate(date.format("YYYY-MM-DD"));
    } else {
      setCottageDate("");
    }
  };

  const handleCottageDateBeforeChange = (date) => {
    if (date && date.format) {
      setCottageDateBefore(date.format("YYYY-MM-DD"));
    } else {
      setCottageDateBefore("");
    }
  };

  const handleExport = async () => {
    if (!selectedCottages.length) {
      alert("لطفاً حداقل یک کوتاژ را انتخاب کنید.");
      return;
    }

    const cottageNumbers = selectedCottages.map((c) => c.cottage_number);
    try {
      const res = await axiosInstance.post(
        "/export-cottages-excel/",
        { cottage_numbers: cottageNumbers },
        { responseType: "blob" }
      );

      const blob = new Blob([res.data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      const filename = `cottages_${new Date().toISOString().slice(0, 10)}.xlsx`;
      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Export error:", err);
      alert("خطا در صدور فایل اکسل.");
    }
  };

  // 🆕 Start EPL automation for selected cottages
  const handleStartAutomation = async () => {
    if (!selectedCottages.length) {
      toast.warn("لطفاً حداقل یک کوتاژ را انتخاب کنید.");
      return;
    }

    const cottageNumbers = selectedCottages.map((c) => c.cottage_number);

    try {
      setAutomationLoading(true);
      const res = await axiosInstance.post("/start-epl-automation/", {
        cottage_numbers: cottageNumbers,
      });
      toast.success(res.data.message || "اتوماسیون آغاز شد.");
    } catch (err) {
      console.error("Automation error:", err);
      toast.error(
        err.response?.data?.error || "خطا در راه‌اندازی اتوماسیون EPL."
      );
    } finally {
      setAutomationLoading(false);
    }
  };

  useEffect(() => {
    dispatch(fetchCostumers());
    dispatch(fetchOrders());
    const filters = {
      search: query,
      cottageDate: convertToWesternDigits(cottageDate),
      cottageDateBefore: convertToWesternDigits(cottageDateBefore),
      prfOrderNo,
      ...(rafeeTaahod && { rafee_taahod: rafeeTaahod }),
      ...(docsRecieved && { docs_recieved: docsRecieved }),
      ...(rewatchStatus && { rewatch: rewatchStatus }),
    };

    console.log("Dispatching filters:", filters);
    console.log("Cottage Date before sending:", filters.cottageDate);

    dispatch(fetchCottages(currentPage, pageSize, filters));
  }, [
    dispatch,
    currentPage,
    pageSize,
    query,
    cottageDate,
    prfOrderNo,
    cottageDateBefore,
    rafeeTaahod,
    docsRecieved,
    rewatchStatus,
  ]);

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

  // -------------------- SELECTED COTTAGES LOGIC --------------------
  const [selectedCottages, setSelectedCottages] = useState([]);
  const [areAllSelected, setAreAllSelected] = useState(false);
  const [currencyPrice, setCurrencyPrice] = useState("");

  const handleSelectCottage = (event, cottage) => {
    const { checked } = event.target;
    let updatedSelections;
    if (checked) {
      updatedSelections = [...selectedCottages, cottage];
    } else {
      updatedSelections = selectedCottages.filter((c) => c.id !== cottage.id);
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

  // -------------------- UPDATE & DELETE ACTIONS --------------------
  const handleApplyCurrencyPrice = () => {
    if (!selectedCottages.length || !currencyPrice) {
      alert("لطفاً حداقل یک کوتاژ را انتخاب کرده و نرخ ارز را وارد کنید.");
      return;
    }
    const updatePromises = selectedCottages.map((cottage) =>
      dispatch(updateCottageCurrencyPrice(cottage.id, currencyPrice))
    );
    Promise.all(updatePromises)
      .then(() => {
        alert("نرخ ارز برای اظهارنامه های انتخاب شده به‌روزرسانی شد.");
        dispatch(fetchCottages(currentPage));
      })
      .catch((error) => {
        console.error("Error updating currency price:", error);
        alert("خطا در به‌روزرسانی نرخ ارز برای برخی از کوتاژها.");
      });
  };

  const booleanOptions = [
    { value: "", label: "همه" },
    { value: "True", label: "بله" },
    { value: "False", label: "خیر" },
  ];

  const handleDeleteSelectedCottages = () => {
    if (!selectedCottages.length) {
      alert("لطفاً حداقل یک کوتاژ را انتخاب کنید.");
      return;
    }
    if (!window.confirm("آیا از حذف کوتاژهای انتخاب شده اطمینان دارید؟")) {
      return;
    }
    const idsToDelete = selectedCottages.map((cottage) => cottage.id);
    dispatch(deleteCottages(idsToDelete))
      .then(() => {
        alert("کوتاژهای انتخاب شده با موفقیت حذف شدند.");
        setSelectedCottages([]);
        dispatch(fetchCottages(currentPage));
      })
      .catch((error) => {
        console.error("Error deleting cottages:", error);
        alert("خطا در حذف کوتاژها.");
      });
  };

  return (
    <div className="cottage-cont">
      <div className="cottage-list-container">
        <h2>لیست اظهارنامه ها</h2>

        {/* SIMPLE SEARCH BAR (NO FILTERING) */}
        <label>جستجو (کد/نام فارسی/نام انگلیسی):</label>
        <div className="search-bar">
          <input
            type="text"
            placeholder="Type your search..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
        </div>

        <div className="filter-container">
          <div className="filter-row">
            <label>ثبت سفارش:</label>
            <Select
              name="proforma"
              className="filter-react-select"
              value={
                orderOptions.find((option) => option.value === prfOrderNo) ||
                null
              }
              onChange={(selectedOption) =>
                setPrfOrderNo(selectedOption ? selectedOption.value : "")
              }
              options={orderOptions}
              isLoading={loading}
              isClearable
              placeholder={
                loading
                  ? "در حال بارگذاری..."
                  : error
                  ? "خطا در بارگذاری"
                  : "انتخاب سفارش"
              }
              noOptionsMessage={() =>
                !loading && !error ? "سفارشی موجود نیست" : "در حال بارگذاری..."
              }
            />
          </div>
          <div className="filter-row">
            <label>تاریخ شروع:</label>
            <DatePicker
              value={cottageDate}
              onChange={handleCottageDateChange}
              calendar={persian}
              locale={persian_fa}
              isClearable
              format="YYYY-MM-DD"
              numerals="en"
              placeholder="تاریخ شروع"
              className="date-picker"
              clearable
            />
          </div>
          <div className="filter-row">
            <label>تاریخ پایین:</label>
            <DatePicker
              value={cottageDateBefore}
              onChange={handleCottageDateBeforeChange}
              calendar={persian}
              locale={persian_fa}
              format="YYYY-MM-DD"
              numerals="en"
              placeholder="تاریخ پایان"
              className="date-picker"
              clearable
            />
          </div>
          <div className="filter-row">
            <label>رفع تعهد:</label>
            <Select
              className="filter-react-select"
              options={booleanOptions}
              value={
                booleanOptions.find((opt) => opt.value === rafeeTaahod) || null
              }
              onChange={(opt) => setRafeeTaahod(opt ? opt.value : "")}
              placeholder="همه"
            />
          </div>
          <div className="filter-row">
            <label>اخذ مدارک:</label>
            <Select
              className="filter-react-select"
              options={booleanOptions}
              value={
                booleanOptions.find((opt) => opt.value === docsRecieved) || null
              }
              onChange={(opt) => setDocsRecieved(opt ? opt.value : "")}
              placeholder="همه"
            />
          </div>
          <div className="filter-row">
            <label>بازبینی:</label>
            <Select
              className="filter-react-select"
              options={booleanOptions}
              value={
                booleanOptions.find((opt) => opt.value === rewatchStatus) ||
                null
              }
              onChange={(opt) => setRewatchStatus(opt ? opt.value : "")}
              placeholder="همه"
            />
          </div>
        </div>

        <button
          onClick={handleDeleteSelectedCottages}
          disabled={!selectedCottages.length}
          className="delete-button"
        >
          حذف کوتاژهای انتخاب شده
        </button>
        <button
          onClick={handleExport}
          disabled={!selectedCottages.length}
          className="text-white bg-sky-500 cursor-pointer hover:bg-sky-600 transition duration-300 shadow-md hover:shadow-lg px-6 py-2"
          style={{ marginLeft: "1rem" }}
        >
          صادر به اکسل
        </button>
        {/* 🆕 Start EPL Automation Button */}
        <button
          onClick={handleStartAutomation}
          disabled={!selectedCottages.length || automationLoading}
          className="text-white bg-sky-500 cursor-pointer hover:bg-sky-600 transition duration-300 shadow-md hover:shadow-lg px-6 py-2"
          style={{ marginLeft: "1rem" }}
        >
          {automationLoading ? "در حال اجرا..." : "شروع اتوماسیون EPL"}
        </button>

        {loading && <p className="loading">در حال بارگذاری...</p>}
        {error && <p className="error">{error}</p>}

        {!loading &&
          !error &&
          (cottages.length === 0 ? (
            <p className="no-data">هیچ اظهارنامه ای یافت نشد.</p>
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
                        checked={areAllSelected}
                      />
                    </th>
                    <th>ردیف</th>
                    <th>شماره کوتاژ</th>
                    <th>تاریخ</th>
                    <th>شماره پرفورم</th>
                    <th>شماره ثبت سفارش</th>
                    <th>نام مشتری</th>
                    <th>ارزش کل</th>
                    <th>ارزش گمرکی</th>
                    <th>هزینه ها</th>
                    <th>نرخ ارز</th>
                    <th>ارزش افزوده</th>
                    <th>رفع تعهد</th>
                    <th>اخذ مدارک</th>
                    <th>بازبینی</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {cottages.map((cottage, index) => {
                    const customer = costumerList.find(
                      (cust) => cust.id === cottage.cottage_customer
                    );
                    // Check if customs_value and customs_value_ep1 are not equal
                    const isValueMismatch =
                      cottage?.customs_value !== cottage?.customs_value_epl;
                    console.log(
                      cottage.cottage_number,
                      cottage.customs_value,
                      cottage.customs_value_epl,
                      "mismatch?",
                      isValueMismatch
                    );

                    return (
                      <tr
                        key={cottage.id}
                        className={
                          cottage?.customs_value != null &&
                          cottage?.customs_value_epl != null &&
                          Number(cottage.customs_value) !==
                            Number(cottage.customs_value_epl)
                            ? "!bg-sky-300 !text-white"
                            : ""
                        }
                      >
                        <td>
                          <input
                            type="checkbox"
                            checked={selectedCottages.some(
                              (selectedCottage) =>
                                selectedCottage.id === cottage.id
                            )}
                            onChange={(e) => handleSelectCottage(e, cottage)}
                          />
                        </td>
                        <td>{index + 1}</td>
                        <td>{cottage.cottage_number}</td>
                        <td>{cottage.cottage_date}</td>
                        <td>{cottage.proforma.prf_number}</td>
                        <td>
                          <Link
                            className="text-sky-700 border-b cursor-pointer border-sky-700"
                            to={`/order-details/${cottage.proforma.prfVCodeInt}`}
                          >
                            {cottage.proforma.prf_order_no}
                          </Link>
                        </td>
                        <td>{customer ? customer.full_name : "—"}</td>
                        <td>{formatNumber(cottage.total_value)}</td>
                        <td>{formatNumber(cottage.customs_value)}</td>
                        <td>{formatNumber(cottage.total_expenses)}</td>
                        <td>
                          {updatingCurrencyPrice &&
                          updatingCurrencyPrice[cottage.id] ? (
                            <span className="loading">
                              در حال به‌روزرسانی...
                            </span>
                          ) : updateCurrencyPriceError &&
                            updateCurrencyPriceError[cottage.id] ? (
                            <span className="error">
                              {typeof updateCurrencyPriceError[cottage.id] ===
                              "string"
                                ? updateCurrencyPriceError[cottage.id]
                                : JSON.stringify(
                                    updateCurrencyPriceError[cottage.id]
                                  )}
                            </span>
                          ) : cottage.currency_price ? (
                            `${cottage.currency_price} ریال`
                          ) : (
                            "—"
                          )}
                        </td>
                        <td>{formatNumber(cottage.added_value)}</td>
                        <td>{cottage.rafee_taahod ? "بله" : "خیر"}</td>
                        <td>{cottage.docs_recieved ? "بله" : "خیر"}</td>
                        <td>{cottage.rewatch ? "بله" : "خیر"}</td>
                        <td>
                          <Link
                            className="text-sky-700 border-b cursor-pointer border-sky-700"
                            to={`/cottages/${cottage.cottage_number}`}
                          >
                            جزئیات
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
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
          ))}
      </div>
    </div>
  );
};

export default CottageList;
