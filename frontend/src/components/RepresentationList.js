import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  fetchRepresentations,
  deleteRepresentation,
} from "../actions/representationActions";
import PaginationControls from "../components/PaginationControls";
import "./RepresentationList.css";
import { Link } from "react-router-dom";

const RepresentationList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Pull in both results and pagination info
  const {
    representations = [],
    loading,
    error,
    count,
    next,
    previous,
  } = useSelector((state) => state.representations);

  // Local UI state
  const [searchText, setSearchText] = useState("");
  const [query, setQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(50);

  const totalPages = Math.ceil(count / pageSize);
  const hasNext = !!next;
  const hasPrevious = !!previous;

  // Debounce the live search input
  useEffect(() => {
    const handler = setTimeout(() => {
      setQuery(searchText);
      setCurrentPage(1);
    }, 300);
    return () => clearTimeout(handler);
  }, [searchText]);

  // Fetch whenever page, size or query changes
  useEffect(() => {
    dispatch(
      fetchRepresentations({
        page: currentPage,
        pageSize,
        search: query,
      })
    );
  }, [dispatch, currentPage, pageSize, query]);

  const handleDelete = (id) => {
    if (window.confirm("آیا مطمئن هستید؟")) {
      dispatch(deleteRepresentation(id));
    }
  };
  const handleEditClick = (id) => navigate(`/representations/${id}/edit`);

  return (
    <div className="representation-list">
      <Link to={"/add-representation"}>
        <button>وکالتنامه جدید</button>
      </Link>
      <h2>لیست وکالت‌نامه‌ها</h2>

      {/* Search bar */}
      <label>جستجو:</label>
      <div className="search-bar">
        <input
          type="text"
          placeholder="متن جستجو را وارد کنید..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
      </div>

      {/* Top pagination */}
      <PaginationControls
        currentPage={currentPage}
        totalPages={totalPages}
        pageSize={pageSize}
        pageSizeOptions={[5, 10, 20, 50, 100]}
        hasNext={hasNext}
        hasPrevious={hasPrevious}
        onPageChange={(e) => setCurrentPage(Number(e.target.value))}
        onNextPage={() => hasNext && setCurrentPage((c) => c + 1)}
        onPreviousPage={() => hasPrevious && setCurrentPage((c) => c - 1)}
        onPageSizeChange={(e) => {
          setPageSize(Number(e.target.value));
          setCurrentPage(1);
        }}
      />

      {/* Loading / Error */}
      {loading && <p className="loading">در حال بارگذاری…</p>}
      {error && <p className="error">{error}</p>}

      {/* Data table */}
      {!loading &&
        !error &&
        (representations.length === 0 ? (
          <p className="no-data">هیچ وکالت‌نامه‌ای یافت نشد.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>ردیف</th>
                <th>وکیل</th>
                <th>موکل</th>
                <th>درخواست‌دهنده</th>
                <th>تاریخ شروع</th>
                <th>تاریخ پایان</th>
                <th>توکل به غیر</th>
                <th>عزل وکیل</th>
                <th>خلاصه</th>
                <th>فایل</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {representations.map((rep, index) => (
                <tr key={rep.id}>
                  <td>{index + 1 + (currentPage - 1) * pageSize}</td>
                  <td>
                    {(rep.attorney || []).map((c) => c.full_name).join(", ")}
                  </td>
                  <td>
                    {(rep.principal || []).map((c) => c.full_name).join(", ")}
                  </td>
                  <td>{rep.applicant_info?.full_name || "-"}</td>
                  <td>{rep.start_date || "-"}</td>
                  <td>{rep.end_date || "-"}</td>
                  <td>{rep.another_deligation ? "بله" : "خیر"}</td>
                  <td>{rep.representor_dismissal ? "بله" : "خیر"}</td>
                  <td>{rep.representation_summary || "-"}</td>
                  <td>
                    {rep.file ? (
                      <a
                        href={rep.file}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        مشاهده فایل
                      </a>
                    ) : (
                      "بدون فایل"
                    )}
                  </td>
                  <td>
                    <button onClick={() => handleEditClick(rep.id)}>
                      ویرایش
                    </button>
                    <button onClick={() => handleDelete(rep.id)}>حذف</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ))}

      {/* Bottom pagination */}
      <PaginationControls
        currentPage={currentPage}
        totalPages={totalPages}
        pageSize={pageSize}
        pageSizeOptions={[5, 10, 20, 50, 100]}
        hasNext={hasNext}
        hasPrevious={hasPrevious}
        onPageChange={(e) => setCurrentPage(Number(e.target.value))}
        onNextPage={() => hasNext && setCurrentPage((c) => c + 1)}
        onPreviousPage={() => hasPrevious && setCurrentPage((c) => c - 1)}
        onPageSizeChange={(e) => {
          setPageSize(Number(e.target.value));
          setCurrentPage(1);
        }}
      />
    </div>
  );
};

export default RepresentationList;
