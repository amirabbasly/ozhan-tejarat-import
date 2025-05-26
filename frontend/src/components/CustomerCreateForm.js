import React, { useState } from "react";
import axiosInstance from "../utils/axiosInstance";
import "./CottageForm.css"; // Your existing CSS
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
      customer_birthday: date.format("YYYY-MM-DD"),
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
    <div className="cottage-form">
      <h2>ایجاد شخص جدید</h2>

      {successMessage && <div className="add-success">{successMessage}</div>}
      {errors.general && <div className="add-error">{errors.general}</div>}

      <form onSubmit={handleSubmit}>
        {/* Full Name */}
        <div className="form-group">
          <label htmlFor="full_name">نام کامل</label>
          <input
            type="text"
            id="full_name"
            name="full_name"
            value={formData.full_name}
            onChange={handleChange}
            className={errors.full_name ? "error-input" : ""}
          />
          {errors.full_name && (
            <span className="add-error">{errors.full_name}</span>
          )}
        </div>

        {/* Phone Number */}
        <div className="form-group">
          <label htmlFor="phone_number">شماره تلفن</label>
          <input
            type="text"
            id="phone_number"
            name="phone_number"
            value={formData.phone_number}
            onChange={handleChange}
            className={errors.phone_number ? "error-input" : ""}
          />
          {errors.phone_number && (
            <span className="add-error">{errors.phone_number}</span>
          )}
        </div>

        {/* National Code */}
        <div className="form-group">
          <label htmlFor="national_code">کد ملی</label>
          <input
            type="text"
            id="national_code"
            name="national_code"
            value={formData.national_code}
            onChange={handleChange}
            className={errors.national_code ? "error-input" : ""}
          />
          {errors.national_code && (
            <span className="add-error">{errors.national_code}</span>
          )}
        </div>

        {/* Birthday */}
        <div className="form-group">
          <label htmlFor="customer_birthday">تاریخ تولد</label>
          <DatePicker
            id="customer_birthday"
            name="customer_birthday"
            calendar={persian}
            locale={persian_fa}
            value={formData.customer_birthday}
            onChange={handleDateChange}
            inputClass={errors.customer_birthday ? "error-input" : ""}
            format="YYYY-MM-DD"
            placeholder="----/--/--"
          />
          {errors.customer_birthday && (
            <span className="add-error">{errors.customer_birthday}</span>
          )}
        </div>

        {/* Address */}
        <div className="form-group">
          <label htmlFor="customer_address">آدرس</label>
          <textarea
            id="customer_address"
            name="customer_address"
            rows="3"
            value={formData.customer_address}
            onChange={handleChange}
            className={errors.customer_address ? "form-textarea error-input" : "form-textarea"}
            
          />
          {errors.customer_address && (
            <span className="add-error">{errors.customer_address}</span>
          )}
        </div>

        <button type="submit" disabled={isSubmitting} className="btn-grad1">
          {isSubmitting ? "در حال ایجاد..." : "ایجاد مشتری"}
        </button>
      </form>
    </div>
  );
};

export default CustomerCreateForm;
