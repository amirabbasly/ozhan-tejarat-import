// import React, { useEffect, useState } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import {
//     fetchChecks,
//     deleteCheck,
//     updateCheck

// } from '../actions/representationActions';
// import '../style/RepresentationList.css';
// import DatePicker from 'react-multi-date-picker';
// import persian from "react-date-object/calendars/persian";
// import persian_fa from "react-date-object/locales/persian_fa";

// const RepresentationList = () => {
//     const dispatch = useDispatch();
//     const { checks, loading, error } = useSelector((state) => state.checks);

//     const [editingId, setEditingId] = useState(null); // Track which representation is being edited
//     const [editFormData, setEditFormData] = useState({}); // Store form data for editing

//     useEffect(() => {
//         dispatch(fetchChecks());
//     }, [dispatch]);

//     const handleDelete = (id) => {
//         if (window.confirm('Are you sure you want to delete this check?')) {
//             dispatch(deleteCheck(id));
//         }
//     };

//     const handleEditClick = (check) => {
//         setEditingId(check.id); // Set the editing ID
//         setEditFormData({ ...check }); // Populate the form with existing data
//     };

//     const handleCancelEdit = () => {
//         setEditingId(null); // Exit editing mode
//         setEditFormData({}); // Clear form data
//     };

//     const handleChange = (e) => {
//         const { name, value, type, checked, files } = e.target;
//         if (type === 'file') {
//             setEditFormData({
//                 ...editFormData,
//                 [name]: files[0],
//             });
//         } else {
//             setEditFormData({
//                 ...editFormData,
//                 [name]: type === 'checkbox' ? checked : value,
//             });
//         }
//     };

//     const handleSaveEdit = async () => {
//         const formData = new FormData();
    
//         // Append fields except file
//         Object.keys(editFormData).forEach((key) => {
//             if (key !== 'document') {
//                 formData.append(key, editFormData[key]);
//             }
//         });
    
//         // Append the file only if it's actually a File object
//         if (editFormData.document && editFormData.document instanceof File) {
//             formData.append('document', editFormData.document);
//         }
    
//         try {
//             await dispatch(updateCheck(editingId, formData));
//             setEditingId(null);
//         } catch (error) {
//             console.error('Error saving representation:', error);
//         }
//     };
    
    

//     if (loading) return <div>Loading...</div>;
//     if (error) return <div>Error: {error}</div>;

//     return (
//         <div className="representation-list">
//             <h2>لیست چک ها</h2>
//             <table>
//                 <thead>
//                     <tr>
//                         <th>کد چک</th>
//                         <th>صادر کننده</th>
//                         <th>مبلغ</th>
//                         <th>در وجه</th>
//                         <th>تاریخ چک</th>
//                         <th>بانک</th>
//                         <th>پاس شده</th>
//                         <th>فایل</th>
//                         <th>Actions</th>
//                     </tr>
//                 </thead>
//                 <tbody>
//                     {checks.map((rep) =>
//                         editingId === rep.id ? (
//                             <tr key={rep.id}>
//                                 <td>
//                                     <input
//                                         type="text"
//                                         name="check_code"
//                                         value={editFormData.check_code || ''}
//                                         onChange={handleChange}
//                                     />
//                                 </td>
//                                 <td>
//                                     <input
//                                         type="text"
//                                         name="issuer"
//                                         value={editFormData.issuer || ''}
//                                         onChange={handleChange}
//                                     />
//                                 </td>
//                                 <td>
//                                     <input
//                                         type="text"
//                                         name="value"
//                                         value={editFormData.value || ''}
//                                         onChange={handleChange}
//                                     />
//                                 </td>
//                                 <td>
//                                     <input
//                                         type="text"
//                                         name="issued_for"
//                                         value={editFormData.issued_for || ''}
//                                         onChange={handleChange}
//                                     />
//                                 </td>
//                                 <td>
//                                 <DatePicker
//                                 calendar={persian}
//                                 locale={persian_fa}
//                                 format="YYYY-MM-DD"            // Tells the picker how to interpret the value string
//                                 value={editFormData.date} // This can be a simple string like "1403-09-13"
//                                 onChange={(value) => {
//                                     setEditFormData({
//                                     ...editFormData,
//                                     date: value.format("YYYY-MM-DD") // Convert the returned DateObject to a string
//                                     });
//                                 }}
//                                 />

//                                 </td>
//                                 <td>
//                                     <input
//                                         type="text"
//                                         name="bank"
//                                         value={editFormData.bank || ''}
//                                         onChange={handleChange}
//                                     />
//                                 </td>
//                                 <td>
//                                     <input
//                                         type="checkbox"
//                                         name="is_paid"
//                                         checked={!!editFormData.is_paid}
//                                         onChange={handleChange}
//                                     />
//                                 </td>
//                                 <td>
//                                     <input
//                                         type="file"
//                                         name="document"
//                                         onChange={handleChange}
//                                     />
//                                 </td>
//                                 <td>
//                                     <button onClick={handleSaveEdit}>ذخیره</button>
//                                     <button onClick={handleCancelEdit}>لغو</button>
//                                 </td>
//                             </tr>
//                         ) : (
//                             <tr key={rep.id}>
//                                 <td>{rep.check_code}</td>
//                                 <td>{rep.issuer}</td>
//                                 <td>{rep.value}</td>
//                                 <td>{rep.issued_for}</td>
//                                 <td>{rep.date}</td>
//                                 <td>{rep.bank}</td>
//                                 <td>{rep.is_paid ? 'بله':'خیر'}</td>
//                                 <td>
//                                     {rep.document ? (
//                                         <a
//                                             href={rep.document}
//                                             target="_blank"
//                                             rel="noopener noreferrer"
//                                         >
//                                             View File
//                                         </a>
//                                     ) : (
//                                         'No File'
//                                     )}
//                                 </td>
//                                 <td>
//                                     <button onClick={() => handleEditClick(rep)}>ویرایش</button>
//                                     <button onClick={() => handleDelete(rep.id)}>حذف</button>
//                                 </td>
//                             </tr>
//                         )
//                     )}
//                 </tbody>
//             </table>
//         </div>
//     );
// };

// export default RepresentationList;




import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchChecks, deleteCheck, updateCheck } from "../actions/representationActions";
import "../style/RepresentationList.css";
import DatePicker from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import Select from "react-select";
import PaginationControls from "../components/PaginationControls";

const RepresentationList = () => {
  const dispatch = useDispatch();
  const { checks = [], loading, error, count = 0, next, previous } = useSelector((state) => state.checks);

  const [editingId, setEditingId] = useState(null);
  const [editFormData, setEditFormData] = useState({});
  const [searchText, setSearchText] = useState("");
  const [query, setQuery] = useState("");
  const [isPaidFilter, setIsPaidFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(50);

  // Is Paid filter options
  const isPaidOptions = [
    { value: "", label: "همه" },
    { value: "True", label: "بله" },
    { value: "False", label: "خیر" },
  ];

  // Debounced search
  useEffect(() => {
    const handler = setTimeout(() => {
      setQuery(searchText);
      setCurrentPage(1);
    }, 300);

    return () => clearTimeout(handler);
  }, [searchText]);

  // Fetch checks with filters and pagination
  useEffect(() => {
    const filters = {
      search: query,
      isPaid: isPaidFilter,
    };
    dispatch(fetchChecks({ page: currentPage, pageSize, ...filters }));
  }, [dispatch, currentPage, pageSize, query, isPaidFilter]);

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

  const handleDelete = (id) => {
    if (window.confirm("آیا از حذف این چک اطمینان دارید؟")) {
      dispatch(deleteCheck(id)).then(() => {
        dispatch(fetchChecks({ page: currentPage, pageSize, search: query, isPaid: isPaidFilter }));
      });
    }
  };

  const handleEditClick = (check) => {
    setEditingId(check.id);
    setEditFormData({ ...check });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditFormData({});
  };

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (type === "file") {
      setEditFormData({
        ...editFormData,
        [name]: files[0],
      });
    } else {
      setEditFormData({
        ...editFormData,
        [name]: type === "checkbox" ? checked : value,
      });
    }
  };

  const handleSaveEdit = async () => {
    const formData = new FormData();

    Object.keys(editFormData).forEach((key) => {
      if (key !== "document") {
        formData.append(key, editFormData[key]);
      }
    });

    if (editFormData.document && editFormData.document instanceof File) {
      formData.append("document", editFormData.document);
    }

    try {
      await dispatch(updateCheck(editingId, formData));
      setEditingId(null);
      dispatch(fetchChecks({ page: currentPage, pageSize, search: query, isPaid: isPaidFilter }));
    } catch (error) {
      console.error("Error saving check:", error);
    }
  };

  return (
    <div className="representation-list mt-24">
      <h2>لیست چک‌ها</h2>

      {/* Search and Filters Section */}
      <label>جستجو (کد چک/صادر کننده/در وجه):</label>
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
          <label>پاس شده:</label>
          <Select
            className="filter-react-select"
            value={isPaidOptions.find((opt) => opt.value === isPaidFilter) || null}
            onChange={(opt) => setIsPaidFilter(opt ? opt.value : "")}
            options={isPaidOptions}
            isLoading={loading}
            isClearable
            placeholder={loading ? "در حال بارگذاری..." : error ? "خطا در بارگذاری" : "همه"}
            noOptionsMessage={() => (loading || error ? "در حال بارگذاری..." : "گزینه‌ای موجود نیست")}
          />
        </div>
      </div>

      {/* Loading/Error */}
      {loading && <p className="loading">در حال بارگذاری...</p>}
      {error && <p className="error">{error}</p>}

      {/* Display Table & Pagination */}
      {!loading && !error && (
        <>
          {checks.length === 0 ? (
            <p className="no-data">هیچ چکی با این جستجو و فیلترها یافت نشد。</p>
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
              <table>
                <thead>
                  <tr>
                    <th>ردیف</th>
                    <th>کد چک</th>
                    <th>صادر کننده</th>
                    <th>مبلغ</th>
                    <th>در وجه</th>
                    <th>تاریخ چک</th>
                    <th>بانک</th>
                    <th>پاس شده</th>
                    <th>فایل</th>
                    <th>عملیات</th>
                  </tr>
                </thead>
                <tbody>
                  {checks.map((rep, index) =>
                    editingId === rep.id ? (
                      <tr key={rep.id}>
                        <td>{index + 1}</td>
                        <td>
                          <input
                            type="text"
                            name="check_code"
                            value={editFormData.check_code || ""}
                            onChange={handleChange}
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            name="issuer"
                            value={editFormData.issuer || ""}
                            onChange={handleChange}
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            name="value"
                            value={editFormData.value || ""}
                            onChange={handleChange}
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            name="issued_for"
                            value={editFormData.issued_for || ""}
                            onChange={handleChange}
                          />
                        </td>
                        <td>
                          <DatePicker
                            calendar={persian}
                            locale={persian_fa}
                            format="YYYY-MM-DD"
                            value={editFormData.date}
                            onChange={(value) => {
                              setEditFormData({
                                ...editFormData,
                                date: value ? value.format("YYYY-MM-DD") : "",
                              });
                            }}
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            name="bank"
                            value={editFormData.bank || ""}
                            onChange={handleChange}
                          />
                        </td>
                        <td>
                          <input
                            type="checkbox"
                            name="is_paid"
                            checked={!!editFormData.is_paid}
                            onChange={handleChange}
                          />
                        </td>
                        <td>
                          <input
                            type="file"
                            name="document"
                            onChange={handleChange}
                          />
                        </td>
                        <td>
                          <button onClick={handleSaveEdit}>ذخیره</button>
                          <button onClick={handleCancelEdit}>لغو</button>
                        </td>
                      </tr>
                    ) : (
                      <tr key={rep.id}>
                        <td>{index + 1}</td>
                        <td>{rep.check_code}</td>
                        <td>{rep.issuer}</td>
                        <td>{rep.value}</td>
                        <td>{rep.issued_for}</td>
                        <td>{rep.date}</td>
                        <td>{rep.bank}</td>
                        <td>{rep.is_paid ? "بله" : "خیر"}</td>
                        <td>
                          {rep.document ? (
                            <a
                              href={rep.document}
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
                          <button onClick={() => handleEditClick(rep)}>ویرایش</button>
                          <button onClick={() => handleDelete(rep.id)}>حذف</button>
                        </td>
                      </tr>
                    )
                  )}
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
  );
};

export default RepresentationList;