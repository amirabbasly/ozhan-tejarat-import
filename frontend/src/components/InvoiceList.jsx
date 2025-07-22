import React, { useEffect, useState } from "react";
import axiosInstance from "../utils/axiosInstance";
import "../style/InvoiceList.css"; // Import the CSS file
import { Link } from "react-router-dom";
import PaginationControls from "./PaginationControls";

function InvoiceList() {
  const [invoices, setInvoices] = useState([]);
  const [count, setCount] = useState(0);
  const [next, setNext] = useState(null);
  const [previous, setPrevious] = useState(null);
  const [templates, setTemplates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState("");

  // Server-side Search & Pagination state
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5); // adjust as needed
  const pageSizeOptions = [5, 10, 20, 50, 100];

  // Fetch templates once
  useEffect(() => {
    axiosInstance
      .get(`documents/templates/`)
      .then((res) => setTemplates(res.data))
      .catch((err) => console.error("خطا در دریافت قالب‌ها:", err));
  }, []);

  // Fetch invoices whenever searchTerm, currentPage, or pageSize changes
  useEffect(() => {
    const params = new URLSearchParams();
    if (searchTerm.trim()) params.append("search", searchTerm.trim());
    params.append("page", currentPage);
    params.append("page_size", pageSize);

    axiosInstance
      .get(`documents/invoices/?${params.toString()}`)
      .then((res) => {
        setInvoices(res.data.results);
        setCount(res.data.count);
        setNext(res.data.next);
        setPrevious(res.data.previous);
      })
      .catch((err) => console.error("خطا در دریافت صورتحساب‌ها:", err));
  }, [searchTerm, currentPage, pageSize]);

  // Calculate total pages from count
  const totalPages = Math.ceil(count / pageSize);
  const hasNext = !!next;
  const hasPrevious = !!previous;

  // Handlers
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };
  const handlePageChange = (e) => {
    setCurrentPage(Number(e.target.value));
  };
  const handlePageSizeChange = (e) => {
    setPageSize(Number(e.target.value));
    setCurrentPage(1);
  };
  const handleNextPage = () => {
    if (hasNext) setCurrentPage((prev) => prev + 1);
  };
  const handlePreviousPage = () => {
    if (hasPrevious) setCurrentPage((prev) => prev - 1);
  };

  // Download helper
  const downloadBlob = (url, filename) => {
    axiosInstance
      .get(url, { responseType: "blob" })
      .then((response) => {
        const fileURL = window.URL.createObjectURL(new Blob([response.data]));
        const fileLink = document.createElement("a");
        fileLink.href = fileURL;
        fileLink.setAttribute("download", filename);
        document.body.appendChild(fileLink);
        fileLink.click();
        fileLink.remove();
      })
      .catch((error) => console.error("خطا در دانلود فایل:", error));
  };

  return (
    <div className="invoice-list-container">
      <h2>فهرست فاکتور ها</h2>
      <Link to={"/invoices/new"}>
        <button>فاکتور جدید</button>
      </Link>
      {/* Search Input */}
      <div className="filter-container">
        <input
          type="text"
          placeholder="جستجوی فاکتور..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="search-input"
        />
      </div>

      {/* Top Pagination Controls */}
      <PaginationControls
        currentPage={currentPage}
        totalPages={totalPages}
        pageSize={pageSize}
        pageSizeOptions={pageSizeOptions}
        hasNext={hasNext}
        hasPrevious={hasPrevious}
        onPageChange={handlePageChange}
        onNextPage={handleNextPage}
        onPreviousPage={handlePreviousPage}
        onPageSizeChange={handlePageSizeChange}
      />

      <table className="invoice-list-table">
        <thead>
          <tr>
            <th>ردیف</th>
            <th>شماره اظهارنامه</th>
            <th>شماره ثبت سفارش</th>
            <th>شماره فاکتور</th>
            <th>مبلغ کل</th>
            <th>هزینه حمل</th>
            <th>واحد پول</th>
            <th>تاریخ</th>
            <th>اینوویس</th>
            <th>بسته‌بندی</th>
            <th>گواهی مبدأ</th>
            <th>کل مدارک</th>
            <th>جزئیات</th>
          </tr>
        </thead>
        <tbody>
          {invoices.map((inv, index) => (
            <tr key={inv.id}>
              <td>{index + 1 + (currentPage - 1) * pageSize}</td>
              <td>
                <Link to={`/cottages/${inv.cottage}`}>{inv.cottage}</Link>
              </td>
              <td>
                <Link
                  to={`/order-details/${inv.proforma_details?.prfVCodeInt}`}
                >
                  {inv.proforma_details?.prf_order_no}
                </Link>
              </td>
              <td>{inv.invoice_number}</td>
              <td>{inv.total_amount}</td>
              <td>{inv.freight_charges}</td>
              <td>{inv.invoice_currency}</td>
              <td>{inv.invoice_date}</td>
              <td>
                <button
                  className="invoice-list-btn"
                  onClick={() =>
                    downloadBlob(
                      `documents/invoices/${inv.id}/pdf/`,
                      `invoice_${inv.id}.pdf`
                    )
                  }
                >
                  دانلود اینوویس
                </button>
              </td>
              <td>
                <button
                  className="invoice-list-btn"
                  onClick={() =>
                    downloadBlob(
                      `documents/packing/${inv.id}/pdf/`,
                      `packing_${inv.id}.pdf`
                    )
                  }
                >
                  دانلود پکینگ
                </button>
              </td>
              <td>
                <select
                  className="invoice-list-select"
                  value={selectedTemplate}
                  onChange={(e) => setSelectedTemplate(e.target.value)}
                >
                  <option value="">انتخاب قالب</option>
                  {templates.map((template) => (
                    <option key={template.id} value={template.id}>
                      {template.name}
                    </option>
                  ))}
                </select>
                <button
                  className="invoice-list-btn"
                  onClick={() =>
                    downloadBlob(
                      `documents/origin-cert/`,
                      `invoice_overlay_${inv.id}.jpg`
                    )
                  }
                >
                  دانلود گواهی مبدا
                </button>
              </td>
              <td>
                <button
                  className="invoice-list-btn"
                  onClick={() =>
                    downloadBlob(
                      `documents/combined-pdf/${inv.id}/?template_id=${selectedTemplate}`,
                      `invoice_documents_${inv.id}.pdf`
                    )
                  }
                >
                  دانلود مدارک
                </button>
              </td>
              <td>
                <Link to={`/invoices/details/${inv.invoice_id}`}> جزئیات</Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Bottom Pagination Controls */}
      <PaginationControls
        currentPage={currentPage}
        totalPages={totalPages}
        pageSize={pageSize}
        pageSizeOptions={pageSizeOptions}
        hasNext={hasNext}
        hasPrevious={hasPrevious}
        onPageChange={handlePageChange}
        onNextPage={handleNextPage}
        onPreviousPage={handlePreviousPage}
        onPageSizeChange={handlePageSizeChange}
      />
    </div>
  );
}

export default InvoiceList;
