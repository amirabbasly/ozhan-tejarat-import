import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchGoddsList } from "../actions/cottageActions"; // Adjust the path as needed
import PaginationControls from "./PaginationControls"; // <-- Import your component
import "./GoodsList.css"; // Add your styling here
import { Link } from "react-router-dom";
const GoodsList = () => {
  const dispatch = useDispatch();

  // Access goods state from Redux store
  const {
    goods,
    loading,
    error,
    next,
    previous,
    count,
  } = useSelector((state) => state.cottageGoods);

  const [searchText, setSearchText] = useState("");
  const [query, setQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(50);
  const totalPages = Math.ceil(count / pageSize);

  // -------------------- PAGINATION HANDLERS --------------------
  const handleSearchButtonClick = () => {
    setQuery(searchText);
    setCurrentPage(1); // Reset to page 1 when searching
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
    setCurrentPage(1); // Reset to page 1 when page size changes
  };

  // -------------------- EFFECT TO FETCH GOODS --------------------
  useEffect(() => {
    const filters = {
      search: query,
    };
    dispatch(fetchGoddsList(currentPage, pageSize, filters));
  }, [dispatch, currentPage, pageSize, query]);

  return (
    <div className="goods-cont">
      <div className="goods-list-container">
        <h2>لیست کالاها</h2>

        {/* SEARCH BAR */}
        <label>جستجو (کد کالا/شرح کالا):</label>
        <div className="search-bar">
          <input
            type="text"
            placeholder="Type your search..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
          <button className="btn-grad" onClick={handleSearchButtonClick}>
            جستجو
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
                    <th>ردیف</th>
                    <th>کد کالا</th>
                    <th> ثبت سفارش</th>
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
                      <td>{index + 1}</td>
                      <td>{good.goodscode}</td>
                      <td><Link to={`/order-details/${good.cottage.proforma.prfVCodeInt}`}>{good.cottage.proforma.prf_order_no}</Link></td>
                      <td><Link to={`/cottages/${good.cottage.cottage_number}`}>{good.cottage.cottage_number}</Link></td>
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
