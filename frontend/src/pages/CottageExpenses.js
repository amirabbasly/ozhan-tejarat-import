import React, { useEffect, useState } from "react";
import axiosInstance from "../utils/axiosInstance";
import PaginationControls from "../components/PaginationControls";
import { Link } from "react-router-dom";
import "../style/GoodsList.css";

const ExpensesList = () => {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [query, setQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(50);
  const [count, setCount] = useState(0);
  const [next, setNext] = useState(null);
  const [previous, setPrevious] = useState(null);

  const totalPages = Math.ceil(count / pageSize);

  // Fetch expenses from API
  const fetchExpenses = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = { page: currentPage, page_size: pageSize };
      if (query) params.search = query;
      const { data } = await axiosInstance.get("/expenses/", { params });
      setExpenses(data.results);
      setCount(data.count);
      setNext(data.next);
      setPrevious(data.previous);
    } catch (err) {
      setError(err.response?.data?.detail || "خطایی رخ داد");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    const handler = setTimeout(() => {
      setQuery(searchText);
      setCurrentPage(1);
    }, 300); // ← 300ms “wait time”

    return () => clearTimeout(handler);
  }, [searchText]);

  useEffect(() => {
    fetchExpenses();
  }, [currentPage, pageSize, query]);

  const handleSearch = () => {
    setQuery(searchText);
    setCurrentPage(1);
  };

  const hasNext = !!next;
  const hasPrevious = !!previous;

  return (
    <div className="goods-cont">
      <div className="goods-list-container">
        <Link to={"/new-expense"}>
          <button>هزینه جدید</button>
        </Link>
        <h2>لیست هزینه‌ها</h2>

        {/* Search Bar */}
        <label>جستجو (شرح/شماره کوتاژ):</label>
        <div className="search-bar">
          <input
            type="text"
            placeholder="متن جستجو را وارد کنید..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
          {/* search button is commented out to avoid confusion with the input
          <button className="btn-grad" onClick={handleSearch}>
            جستجو
          </button>*/}
        </div>

        {/* Loading and Error */}
        {loading && <p className="loading">در حال بارگذاری...</p>}
        {error && <p className="error">{error}</p>}

        {/* Table and Pagination */}
        {!loading &&
          !error &&
          (expenses.length === 0 ? (
            <p className="no-data">هیچ هزینه‌ای یافت نشد.</p>
          ) : (
            <>
              {/* Top Pagination */}
              <PaginationControls
                currentPage={currentPage}
                totalPages={totalPages}
                pageSize={pageSize}
                pageSizeOptions={[5, 10, 20, 50, 100]}
                hasNext={hasNext}
                hasPrevious={hasPrevious}
                onPageChange={(e) => setCurrentPage(Number(e.target.value))}
                onNextPage={() => hasNext && setCurrentPage((c) => c + 1)}
                onPreviousPage={() =>
                  hasPrevious && setCurrentPage((c) => c - 1)
                }
                onPageSizeChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setCurrentPage(1);
                }}
              />

              <table className="goods-table">
                <thead>
                  <tr>
                    <th>ردیف</th>
                    <th>شماره کوتاژ</th>
                    <th>مقدار</th>
                    <th>شرح</th>
                    <th>رسید</th>
                  </tr>
                </thead>
                <tbody>
                  {expenses.map((exp, index) => (
                    <tr key={exp.id}>
                      <td>{index + 1 + (currentPage - 1) * pageSize}</td>
                      <td>
                        <Link
                          to={`/cottages/${exp.cottage_detail.cottage_number}`}
                        >
                          {exp.cottage_detail.cottage_number}
                        </Link>
                      </td>
                      <td>{exp.value}</td>
                      <td>{exp.description || "-"}</td>
                      <td>
                        {exp.receipt ? (
                          <a
                            href={exp.receipt}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            مشاهده رسید
                          </a>
                        ) : (
                          "-"
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Bottom Pagination */}
              <PaginationControls
                currentPage={currentPage}
                totalPages={totalPages}
                pageSize={pageSize}
                pageSizeOptions={[5, 10, 20, 50, 100]}
                hasNext={hasNext}
                hasPrevious={hasPrevious}
                onPageChange={(e) => setCurrentPage(Number(e.target.value))}
                onNextPage={() => hasNext && setCurrentPage((c) => c + 1)}
                onPreviousPage={() =>
                  hasPrevious && setCurrentPage((c) => c - 1)
                }
                onPageSizeChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setCurrentPage(1);
                }}
              />
            </>
          ))}
      </div>
    </div>
  );
};

export default ExpensesList;
