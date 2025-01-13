// src/components/PaginationControls.js

import React from "react";
import "./PaginationControls.css";

/**
 * Reusable Pagination Controls
 *
 * Props:
 * - currentPage (number): currently selected page
 * - totalPages (number): total number of pages
 * - pageSize (number): current page size
 * - pageSizeOptions (array): array of selectable page sizes, e.g. [50, 100, 200, 500]
 *
 * - hasNext (bool): whether 'Next' is enabled (e.g., if API returns "next" link or if currentPage < totalPages)
 * - hasPrevious (bool): whether 'Previous' is enabled
 *
 * - onPageChange (function): called when user selects a page from the dropdown
 * - onNextPage (function): called when user clicks Next
 * - onPreviousPage (function): called when user clicks Previous
 * - onPageSizeChange (function): called when user selects a new page size
 */
const PaginationControls = ({
  currentPage,
  totalPages,
  pageSize,
  pageSizeOptions,
  hasNext,
  hasPrevious,
  onPageChange,
  onNextPage,
  onPreviousPage,
  onPageSizeChange,
}) => {
  return (
    <div className="pagination-controls">
      {/* Page Size Dropdown */}
      <div className="page-size-selector">
        <label htmlFor="pageSize">سایز صفحه: </label>
        <select
          id="pageSize"
          className="page-size-select"
          value={pageSize}
          onChange={onPageSizeChange}
        >
          {pageSizeOptions.map((size) => (
            <option key={size} value={size}>
              {size}
            </option>
          ))}
        </select>
      </div>

      {/* Previous Button */}
      <button
        className="prev-button"
        onClick={onPreviousPage}
        disabled={!hasPrevious}
      >
        قبلی
      </button>

      {/* Page Select */}
      <span className="page-info">
        صفحه{" "}
        <select
          className="page-select"
          value={currentPage}
          onChange={onPageChange}
        >
          {Array.from({ length: totalPages }, (_, index) => (
            <option key={index + 1} value={index + 1}>
              {index + 1}
            </option>
          ))}
        </select>{" "}
        از {totalPages}
      </span>

      {/* Next Button */}
      <button className="next-button" onClick={onNextPage} disabled={!hasNext}>
        بعدی
      </button>
    </div>
  );
};

export default PaginationControls;
