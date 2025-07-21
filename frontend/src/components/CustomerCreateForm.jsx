// import React, { useState } from "react";
// import axiosInstance from "../utils/axiosInstance";
// import "../style/CottageForm.css"; // Your existing CSS
// import persian from "react-date-object/calendars/persian";
// import persian_fa from "react-date-object/locales/persian_fa";
// import DatePicker from "react-multi-date-picker";

// const CustomerCreateForm = () => {
//   const [formData, setFormData] = useState({
//     full_name: "",
//     phone_number: null,
//     national_code: null,
//     customer_birthday: null,
//     customer_address: null,
//   });

//   const [errors, setErrors] = useState({});
//   const [successMessage, setSuccessMessage] = useState("");
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//     setErrors((prev) => ({ ...prev, [name]: "" }));
//   };
//   const handleDateChange = (date) => {
//     // date.format() gives “YYYY/MM/DD” in Jalali by default
//     setFormData((prev) => ({
//       ...prev,
//       customer_birthday: date.format("YYYY-MM-DD"),
//     }));
//     setErrors((prev) => ({ ...prev, customer_birthday: "" }));
//   };
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setIsSubmitting(true);
//     setErrors({});
//     setSuccessMessage("");

//     try {
//       await axiosInstance.post("/accounts/customers/", formData);
//       setSuccessMessage("مشتری با موفقیت ایجاد شد!");
//       setFormData({
//         full_name: "",
//         phone_number: null,
//         national_code: null,
//         customer_birthday: null,
//         customer_address: null,
//       });
//     } catch (error) {
//       if (error.response && error.response.data) {
//         setErrors(error.response.data);
//       } else {
//         setErrors({
//           general: "خطایی رخ داده است. لطفاً بعداً دوباره تلاش کنید.",
//         });
//       }
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   return (
//     <div className="cottage-form">
//       <h2>ایجاد شخص جدید</h2>

//       {successMessage && <div className="add-success">{successMessage}</div>}
//       {errors.general && <div className="add-error">{errors.general}</div>}

//       <form onSubmit={handleSubmit}>
//         {/* Full Name */}
//         <div className="form-group">
//           <label htmlFor="full_name">نام کامل</label>
//           <input
//             type="text"
//             id="full_name"
//             name="full_name"
//             value={formData.full_name}
//             onChange={handleChange}
//             className={errors.full_name ? "error-input" : ""}
//           />
//           {errors.full_name && (
//             <span className="add-error">{errors.full_name}</span>
//           )}
//         </div>

//         {/* Phone Number */}
//         <div className="form-group">
//           <label htmlFor="phone_number">شماره تلفن</label>
//           <input
//             type="text"
//             id="phone_number"
//             name="phone_number"
//             value={formData.phone_number}
//             onChange={handleChange}
//             className={errors.phone_number ? "error-input" : ""}
//           />
//           {errors.phone_number && (
//             <span className="add-error">{errors.phone_number}</span>
//           )}
//         </div>

//         {/* National Code */}
//         <div className="form-group">
//           <label htmlFor="national_code">کد ملی</label>
//           <input
//             type="text"
//             id="national_code"
//             name="national_code"
//             value={formData.national_code}
//             onChange={handleChange}
//             className={errors.national_code ? "error-input" : ""}
//           />
//           {errors.national_code && (
//             <span className="add-error">{errors.national_code}</span>
//           )}
//         </div>

//         {/* Birthday */}
//         <div className="form-group">
//           <label htmlFor="customer_birthday">تاریخ تولد</label>
//           <DatePicker
//             id="customer_birthday"
//             name="customer_birthday"
//             calendar={persian}
//             locale={persian_fa}
//             value={formData.customer_birthday}
//             onChange={handleDateChange}
//             inputClass={errors.customer_birthday ? "error-input" : ""}
//             format="YYYY-MM-DD"
//             placeholder="----/--/--"
//           />
//           {errors.customer_birthday && (
//             <span className="add-error">{errors.customer_birthday}</span>
//           )}
//         </div>

//         {/* Address */}
//         <div className="form-group">
//           <label htmlFor="customer_address">آدرس</label>
//           <textarea
//             id="customer_address"
//             name="customer_address"
//             rows="3"
//             value={formData.customer_address}
//             onChange={handleChange}
//             className={errors.customer_address ? "form-textarea error-input" : "form-textarea"}

//           />
//           {errors.customer_address && (
//             <span className="add-error">{errors.customer_address}</span>
//           )}
//         </div>

//         <button type="submit" disabled={isSubmitting} className="btn-grad1">
//           {isSubmitting ? "در حال ایجاد..." : "ایجاد مشتری"}
//         </button>
//       </form>
//     </div>
//   );
// };

// export default CustomerCreateForm;

import React, { useState } from "react";
import axiosInstance from "../utils/axiosInstance";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import DatePicker from "react-multi-date-picker";

const CustomerCreateForm = () => {
  const [formData, setFormData] = useState({
    full_name: "",
    phone_number: null,
    national_code: null,
    customer_birthday: null,
    customer_address: null,
  });

  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleDateChange = (date) => {
    // date.format() gives “YYYY/MM/DD” in Jalali by default
    setFormData((prev) => ({
      ...prev,
      customer_birthday: date ? date.format("YYYY-MM-DD") : null,
    }));
    setErrors((prev) => ({ ...prev, customer_birthday: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({});
    setSuccessMessage("");

    try {
      await axiosInstance.post("/accounts/customers/", formData);
      setSuccessMessage("مشتری با موفقیت ایجاد شد!");
      setFormData({
        full_name: "",
        phone_number: null,
        national_code: null,
        customer_birthday: null,
        customer_address: null,
      });
    } catch (error) {
      if (error.response && error.response.data) {
        setErrors(error.response.data);
      } else {
        setErrors({
          general: "خطایی رخ داده است. لطفاً بعداً دوباره تلاش کنید.",
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="mt-10 sm:mt-16 md:mt-20 lg:mt-24 xl:mt-32 max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md font-vazirmatn direction-rtl"
      dir="rtl"
    >
      <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
        ایجاد شخص جدید
      </h2>

      {successMessage && (
        <div className="mb-4 p-2 bg-green-100 text-green-700 rounded-md text-center">
          {successMessage}
        </div>
      )}
      {errors.general && (
        <div className="mb-4 p-2 bg-red-100 text-red-700 rounded-md text-center">
          {errors.general}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {/* Full Name */}
        <div className="mb-4">
          <label
            htmlFor="full_name"
            className="block text-sm font-medium text-gray-700 mb-1 text-right"
          >
            نام کامل
          </label>
          <input
            type="text"
            id="full_name"
            name="full_name"
            value={formData.full_name}
            onChange={handleChange}
            placeholder="نام کامل را وارد کنید"
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 text-right ${
              errors.full_name
                ? "border-red-500 focus:ring-red-500"
                : "border-gray-300 focus:ring-primary"
            }`}
          />
          {errors.full_name && (
            <span className="text-red-600 text-sm mt-1 block text-right">
              {errors.full_name}
            </span>
          )}
        </div>

        {/* Phone Number */}
        <div className="mb-4">
          <label
            htmlFor="phone_number"
            className="block text-sm font-medium text-gray-700 mb-1 text-right"
          >
            شماره تلفن
          </label>
          <input
            type="text"
            id="phone_number"
            name="phone_number"
            value={formData.phone_number || ""}
            onChange={handleChange}
            placeholder="شماره تلفن را وارد کنید"
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 text-right ${
              errors.phone_number
                ? "border-red-500 focus:ring-red-500"
                : "border-gray-300 focus:ring-primary"
            }`}
          />
          {errors.phone_number && (
            <span className="text-red-600 text-sm mt-1 block text-right">
              {errors.phone_number}
            </span>
          )}
        </div>

        {/* National Code */}
        <div className="mb-4">
          <label
            htmlFor="national_code"
            className="block text-sm font-medium text-gray-700 mb-1 text-right"
          >
            کد ملی
          </label>
          <input
            type="text"
            id="national_code"
            name="national_code"
            value={formData.national_code || ""}
            onChange={handleChange}
            placeholder="کد ملی را وارد کنید"
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 text-right ${
              errors.national_code
                ? "border-red-500 focus:ring-red-500"
                : "border-gray-300 focus:ring-primary"
            }`}
          />
          {errors.national_code && (
            <span className="text-red-600 text-sm mt-1 block text-right">
              {errors.national_code}
            </span>
          )}
        </div>

        {/* Birthday */}
        <div className="mb-4">
          <label
            htmlFor="customer_birthday"
            className="block text-sm font-medium text-gray-700 mb-1 text-right"
          >
            تاریخ تولد
          </label>
          <DatePicker
            id="customer_birthday"
            name="customer_birthday"
            calendar={persian}
            locale={persian_fa}
            value={formData.customer_birthday}
            onChange={handleDateChange}
            inputClass={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 text-right font-vazirmatn ${
              errors.customer_birthday
                ? "border-red-500 focus:ring-red-500"
                : "border-gray-300 focus:ring-primary"
            }`}
            format="YYYY-MM-DD"
            placeholder="----/--/--"
          />
          {errors.customer_birthday && (
            <span className="text-red-600 text-sm mt-1 block text-right">
              {errors.customer_birthday}
            </span>
          )}
        </div>

        {/* Address */}
        <div className="mb-4">
          <label
            htmlFor="customer_address"
            className="block text-sm font-medium text-gray-700 mb-1 text-right"
          >
            آدرس
          </label>
          <textarea
            id="customer_address"
            name="customer_address"
            rows="3"
            value={formData.customer_address || ""}
            onChange={handleChange}
            placeholder="آدرس را وارد کنید"
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 text-right resize-y ${
              errors.customer_address
                ? "border-red-500 focus:ring-red-500"
                : "border-gray-300 focus:ring-primary"
            }`}
          />
          {errors.customer_address && (
            <span className="text-red-600 text-sm mt-1 block text-right">
              {errors.customer_address}
            </span>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-1/2 mx-auto min-w-full px-4 py-2 bg-primary text-white rounded-md hover:bg-blue-700 active:bg-blue-800 transition-colors duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "در حال ایجاد..." : "ایجاد مشتری"}
        </button>
      </form>
    </div>
  );
};

export default CustomerCreateForm;
