import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";
import "../pages/CottageDetails.css";

const CustomerDetails = () => {
  const { customerId } = useParams();
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const customerResponse = await axiosInstance.get(
          `/accounts/customers/by-id/${customerId}/`
        );
        setCustomer(customerResponse.data);
        setLoading(false);
      } catch (err) {
        setError("خطا در دریافت اطلاعات");
        setLoading(false);
      }
    };

    fetchData();
  }, [customerId]);
  const handleDelete = async () => {
    if (
      !window.confirm("آیا مطمئن هستید که می‌خواهید این مشتری را حذف کنید؟")
    ) {
      return;
    }

    try {
      await axiosInstance.delete(`/accounts/customers/${customerId}/`);
      alert("مشتری با موفقیت حذف شد.");
      window.location.href = "/customers/list"; // Redirect to the customer list page
    } catch (err) {
      setError("خطا در حذف مشتری.");
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    try {
      const response = await axiosInstance.put(
        `/accounts/customers/${customerId}/`,
        customer
      );
      setSuccessMessage("تغییرات با موفقیت ذخیره شد.");
    } catch (err) {
      setError("خطا در ذخیره تغییرات.");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCustomer((prev) => ({ ...prev, [name]: value }));
  };

  if (loading) return <div className="loading">در حال بارگذاری...</div>;
  if (!customer) return <div className="error">{error}</div>;

  return (
    <div className="cottage-details-container">
      <div className="header">جزئیات مشتری</div>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div className="form-group">
          <label htmlFor="customer_name">نام مشتری:</label>
          <input
            type="text"
            id="customer_name"
            name="customer_name"
            value={customer.full_name || ""}
            onChange={handleChange}
            className="editable-input"
          />
        </div>
        <div className="form-group">
          <label htmlFor="customer_address">آدرس مشتری:</label>
          <textarea
            id="customer_address"
            name="customer_address"
            value={customer.customer_address || ""}
            onChange={handleChange}
            className="editable-input form-textarea"
          />
        </div>
        <div className="form-group">
          <label htmlFor="national_code">کد ملی:</label>
          <input
            type="text"
            id="national_code"
            name="national_code"
            value={customer.national_code || ""}
            onChange={handleChange}
            className="editable-input"
          />
        </div>
        <div className="form-group">
          <label htmlFor="phone_number">تلفن مشتری:</label>
          <input
            type="text"
            id="phone_number"
            name="phone_number"
            value={customer.phone_number || ""}
            onChange={handleChange}
            className="editable-input"
          />
        </div>

        <button type="submit" className="primary-button">
          ثبت تغییرات
        </button>
        <button type="button" className="delete-button" onClick={handleDelete}>
          حذف مشتری
        </button>
      </form>
      {successMessage && <div className="cottage-info">{successMessage}</div>}
      {error && <div className="error">{error}</div>}
    </div>
  );
};

export default CustomerDetails;
