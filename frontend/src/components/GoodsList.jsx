// import React, { useEffect, useState } from "react";
// import { useSelector, useDispatch } from "react-redux";
// import { fetchGoddsList } from "../actions/cottageActions"; // Adjust the path as needed
// import PaginationControls from "./PaginationControls"; // <-- Import your component
// import "./GoodsList.css"; // Add your styling here
// import { Link } from "react-router-dom";
// const GoodsList = () => {
//   const dispatch = useDispatch();

//   // Access goods state from Redux store
//   const { goods, loading, error, next, previous, count } = useSelector(
//     (state) => state.cottageGoods
//   );

//   const [searchText, setSearchText] = useState("");
//   const [query, setQuery] = useState("");
//   const [currentPage, setCurrentPage] = useState(1);
//   const [pageSize, setPageSize] = useState(50);
//   const totalPages = Math.ceil(count / pageSize);

//   // -------------------- PAGINATION HANDLERS --------------------
//   const handleSearchButtonClick = () => {
//     setQuery(searchText);
//     setCurrentPage(1); // Reset to page 1 when searching
//   };

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
//     setCurrentPage(1); // Reset to page 1 when page size changes
//   };

//   // -------------------- EFFECT TO FETCH GOODS --------------------
//   useEffect(() => {
//     const filters = {
//       search: query,
//     };
//     dispatch(fetchGoddsList(currentPage, pageSize, filters));
//   }, [dispatch, currentPage, pageSize, query]);
//   useEffect(() => {
//     const handler = setTimeout(() => {
//       setQuery(searchText);
//       setCurrentPage(1);
//     }, 300); // ← 300ms “wait time”

//     return () => clearTimeout(handler);
//   }, [searchText]);
//   return (
//     <div className="goods-cont">
//       <div className="goods-list-container">
//         <h2>لیست کالاها</h2>

//         {/* SEARCH BAR */}

//         <label>جستجو (کد کالا/شرح کالا):</label>
//         <div className="search-bar">
//           <input
//             type="text"
//             placeholder="Type your search..."
//             value={searchText}
//             onChange={(e) => setSearchText(e.target.value)}
//           />
//           {/* Search button */}
//           {/* Uncomment if you want a button instead of auto-search
//           <button className="btn-grad" onClick={handleSearchButtonClick}>
//             جستجو
//           </button>*/}
//         </div>

//         {/* LOADING/ERROR */}
//         {loading && <p className="loading">در حال بارگذاری...</p>}
//         {error && <p className="error">{error}</p>}

//         {/* DISPLAY TABLE & PAGINATION */}
//         {!loading &&
//           !error &&
//           (goods.length === 0 ? (
//             <p className="no-data">هیچ کالایی یافت نشد.</p>
//           ) : (
//             <>
//               {/* -- TOP PAGINATION -- */}
//               <PaginationControls
//                 currentPage={currentPage}
//                 totalPages={totalPages}
//                 pageSize={pageSize}
//                 pageSizeOptions={[10, 20, 50, 100, 200, 500]}
//                 hasNext={hasNext}
//                 hasPrevious={hasPrevious}
//                 onPageChange={handlePageChange}
//                 onNextPage={handleNextPage}
//                 onPreviousPage={handlePreviousPage}
//                 onPageSizeChange={handlePageSizeChange}
//               />

//               <table className="goods-table">
//                 <thead>
//                   <tr>
//                     <th>ردیف</th>
//                     <th>کد کالا</th>
//                     <th> ثبت سفارش</th>
//                     <th>شماره کوتاژ</th>
//                     <th>شرح کالا</th>
//                     <th>تعداد</th>
//                     <th>ارزش کل ارزی</th>
//                     <th>حواله ریالی</th>
//                     <th>قیمت نهایی</th>
//                     <th>قیمت واحد</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {goods.map((good, index) => (
//                     <tr key={good.id}>
//                       <td>{index + 1}</td>
//                       <td>{good.goodscode}</td>
//                       <td>
//                         <Link
//                           to={`/order-details/${good.cottage.proforma.prfVCodeInt}`}
//                         >
//                           {good.cottage.proforma.prf_order_no}
//                         </Link>
//                       </td>
//                       <td>
//                         <Link to={`/cottages/${good.cottage.cottage_number}`}>
//                           {good.cottage.cottage_number}
//                         </Link>
//                       </td>
//                       <td>{good.goods_description}</td>
//                       <td>{good.quantity}</td>
//                       <td>{good.total_value}</td>
//                       <td>{good.riali}</td>
//                       <td>{good.final_price}</td>
//                       <td>{(good.final_price / good.quantity).toFixed(0)}</td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>

//               {/* -- BOTTOM PAGINATION -- */}
//               <PaginationControls
//                 currentPage={currentPage}
//                 totalPages={totalPages}
//                 pageSize={pageSize}
//                 pageSizeOptions={[10, 20, 50, 100, 200, 500]}
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

// export default GoodsList;

import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchGoddsList } from "../actions/cottageActions";
import PaginationControls from "./PaginationControls";
import "../style/GoodsList.css";
import { Link } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";
import Select from "react-select";

const GoodsList = () => {
  const dispatch = useDispatch();

  // Access goods state from Redux store
  const { goods, loading, error, next, previous, count } = useSelector(
    (state) => state.cottageGoods
  );

  const [searchText, setSearchText] = useState("");
  const [cottageFilter, setCottageFilter] = useState("");
  const [proformaFilter, setProformaFilter] = useState("");
  const [query, setQuery] = useState("");
  const [cottageQuery, setCottageQuery] = useState("");
  const [proformaQuery, setProformaQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(50);
  const totalPages = Math.ceil(count / pageSize);
  const [number, setNumber] = useState([]);
  const [ordernumber, setOrderNumber] = useState([]);
  const [selectedGoods, setSelectedGoods] = useState([]);
  const [areAllSelected, setAreAllSelected] = useState(false);

  // Options for react-select (Cottage Numbers)
  const cottageOptions = [
    { value: "", label: "همه" },
    ...number.map((num) => ({ value: num, label: num })),
  ];

  // Options for react-select (Proforma Numbers)
  const proformaOptions = [
    { value: "", label: "همه" },
    ...ordernumber.map((num) => ({ value: num, label: num })),
  ];

  useEffect(() => {
    const fetchPerformaNumber = async () => {
      try {
        const response = await axiosInstance.get("/performas/numbers");
        if (response.data && Array.isArray(response.data)) {
          const proformaNumbers = response.data.map(
            (item) => item.prf_order_no
          );
          setOrderNumber(proformaNumbers);
        } else {
          setOrderNumber([]);
        }
      } catch (err) {
        setOrderNumber([]);
      }
    };

    fetchPerformaNumber();
  }, []);

  useEffect(() => {
    const fetchCottageNumber = async () => {
      try {
        const response = await axiosInstance.get("/cottages/numbers/");
        if (response.data.results && Array.isArray(response.data.results)) {
          const cottageNumbers = response.data.results.map(
            (item) => item.cottage_number
          );
          setNumber(cottageNumbers);
        } else {
          setNumber([]);
        }
      } catch (err) {
        setNumber([]);
      }
    };

    fetchCottageNumber();
  }, []);

  // -------------------- SELECTION HANDLERS --------------------
  const handleSelectGood = (event, good) => {
    const { checked } = event.target;
    let updatedSelections;
    if (checked) {
      updatedSelections = [...selectedGoods, good.goodscode];
    } else {
      updatedSelections = selectedGoods.filter((id) => id !== good.goodscode);
    }
    setSelectedGoods(updatedSelections);
    setAreAllSelected(updatedSelections.length === goods.length);
  };
  const handleSelectAll = (event) => {
    const { checked } = event.target;
    setAreAllSelected(checked);
    if (checked) {
      setSelectedGoods(goods.map((good) => good.goodscode));
    } else {
      setSelectedGoods([]);
    }
  };

  // -------------------- EXPORT HANDLER --------------------
  const handleExport = async () => {
    if (!selectedGoods.length) {
      alert("لطفاً حداقل یک کالا را انتخاب کنید.");
      return;
    }

    try {
      const res = await axiosInstance.post(
        "/export-cottage-goods-excel/",
        { goods_codes: selectedGoods },
        { responseType: "blob" }
      );

      const blob = new Blob([res.data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      const filename = `goods_${new Date().toISOString().slice(0, 10)}.xlsx`;
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

  // -------------------- DELETE HANDLER --------------------
  const handleDeleteSelectedGoods = () => {
    if (!selectedGoods.length) {
      alert("لطفاً حداقل یک کالا را انتخاب کنید.");
      return;
    }
    if (!window.confirm("آیا از حذف کالاهای انتخاب شده اطمینان دارید؟")) {
      return;
    }
    // Implement your delete logic here
    alert("حذف کالاهای انتخاب شده با موفقیت انجام شد.");
    setSelectedGoods([]);
  };

  // -------------------- PAGINATION HANDLERS --------------------
  const handleSearchButtonClick = () => {
    setQuery(searchText);
    setCottageQuery(cottageFilter);
    setProformaQuery(proformaFilter);
    setCurrentPage(1);
  };

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

  // -------------------- EFFECT TO FETCH GOODS --------------------
  useEffect(() => {
    const filters = {
      search: query,
      cottage: cottageQuery,
      proforma: proformaQuery,
    };
    dispatch(fetchGoddsList(currentPage, pageSize, filters));
  }, [dispatch, currentPage, pageSize, query, cottageQuery, proformaQuery]);

  // Debounce search inputs
  useEffect(() => {
    const handler = setTimeout(() => {
      setQuery(searchText);
      setCottageQuery(cottageFilter);
      setProformaQuery(proformaFilter);
      setCurrentPage(1);
    }, 300);

    return () => clearTimeout(handler);
  }, [searchText, cottageFilter, proformaFilter]);

  return (
    <div className="goods-cont">
      <div className="goods-list-container">
        <h2>لیست کالاها</h2>

        {/* SEARCH BAR */}
        <div className="search-bar">
          <div>
            <label>جستجو (کد کالا/شرح کالا):</label>
            <input
              type="text"
              placeholder="Type your search..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
          </div>
          <div className="filter-row">
            <label>شماره کوتاژ:</label>
            <Select
              className="filter-react-select"
              value={cottageOptions.find((opt) => opt.value === cottageFilter)}
              onChange={(opt) => setCottageFilter(opt ? opt.value : "")}
              options={cottageOptions}
              placeholder="انتخاب شماره کوتاژ"
              isClearable
            />
          </div>
          <div className="filter-row">
            <label>ثبت سفارش:</label>
            <Select
              className="filter-react-select"
              value={proformaOptions.find(
                (opt) => opt.value === proformaFilter
              )}
              onChange={(opt) => setProformaFilter(opt ? opt.value : "")}
              options={proformaOptions}
              placeholder="انتخاب ثبت سفارش"
              isClearable
            />
          </div>
        </div>

        {/* ACTION BUTTONS */}
        <div
          style={{
            display: "flex",
            gap: "1rem",
            marginBottom: "1rem",
            justifyContent: "right",
          }}
        >
          <button
            onClick={handleDeleteSelectedGoods}
            disabled={!selectedGoods.length}
            className="delete-button"
          >
            حذف کالاهای انتخاب شده
          </button>
          <button
            onClick={handleExport}
            disabled={!selectedGoods.length}
            className="export-button"
          >
            صادر به اکسل
          </button>
        </div>

        {/* LOADING/ERROR */}
        {loading && <p className="loading">در حال بارگذاری...</p>}
        {error && <p className="error">{error}</p>}

        {/* DISPLAY TABLE & PAGINATION */}
        {!loading &&
          !error &&
          (goods.length === 0 ? (
            <p className="no-data">هیچ کالایی یافت نشد.</p>
          ) : (
            <>
              {/* -- TOP PAGINATION -- */}
              <PaginationControls
                currentPage={currentPage}
                totalPages={totalPages}
                pageSize={pageSize}
                pageSizeOptions={[10, 20, 50, 100, 200, 500]}
                hasNext={hasNext}
                hasPrevious={hasPrevious}
                onPageChange={handlePageChange}
                onNextPage={handleNextPage}
                onPreviousPage={handlePreviousPage}
                onPageSizeChange={handlePageSizeChange}
              />

              <table className="goods-table">
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
                    <th>کد کالا</th>
                    <th>ثبت سفارش</th>
                    <th>شماره کوتاژ</th>
                    <th>شرح کالا</th>
                    <th>تعداد</th>
                    <th>ارزش کل ارزی</th>
                    <th>حواله ریالی</th>
                    <th>قیمت نهایی</th>
                    <th>قیمت واحد</th>
                  </tr>
                </thead>
                <tbody>
                  {goods.map((good, index) => (
                    <tr key={good.id}>
                      <td>
                        <input
                          type="checkbox"
                          checked={selectedGoods.includes(good.id)}
                          onChange={(e) => handleSelectGood(e, good)}
                        />
                      </td>
                      <td>{index + 1}</td>
                      <td>{good.goodscode}</td>
                      <td>
                        <Link
                          className="text-sky-700 border-b cursor-pointer border-sky-700"
                          to={`/order-details/${good.cottage.proforma.prfVCodeInt}`}
                        >
                          {good.cottage.proforma.prf_order_no}
                        </Link>
                      </td>
                      <td>
                        <Link
                          className="text-sky-700 border-b cursor-pointer border-sky-700"
                          to={`/cottages/${good.cottage.cottage_number}`}
                        >
                          {good.cottage.cottage_number}
                        </Link>
                      </td>
                      <td>{good.goods_description}</td>
                      <td>{good.quantity}</td>
                      <td>{good.total_value}</td>
                      <td>{good.riali}</td>
                      <td>{good.final_price}</td>
                      <td>{(good.final_price / good.quantity).toFixed(0)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* -- BOTTOM PAGINATION -- */}
              <PaginationControls
                currentPage={currentPage}
                totalPages={totalPages}
                pageSize={pageSize}
                pageSizeOptions={[10, 20, 50, 100, 200, 500]}
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

export default GoodsList;
