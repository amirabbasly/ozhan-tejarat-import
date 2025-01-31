import React, { useState } from "react";
import axiosInstance from "../utils/axiosInstance";
import "./CottageForm.css"; // Your existing CSS

const CustomerCreateForm = () => {
  const [formData, setFormData] = useState({
    full_name: "",
    phone_number: "",
    national_code: "",
  });

  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" })); // Clear error for the field
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
        phone_number: "",
        national_code: "",
      });
    } catch (error) {
      // If the server responds with validation errors:
      if (error.response && error.response.data) {
        setErrors(error.response.data);
      } else {
        // General fallback error:
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
      <h2>ایجاد مشتری جدید</h2>

      {/* Success message */}
      {successMessage && <div className="add-success">{successMessage}</div>}

      {/* General errors */}
      {errors.general && <div className="add-error">{errors.general}</div>}

      <form onSubmit={handleSubmit}>
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

        <button type="submit" disabled={isSubmitting} className="btn-grad">
          {isSubmitting ? "در حال ایجاد..." : "ایجاد مشتری"}
        </button>
      </form>
    </div>
  );
};

export default CustomerCreateForm;
