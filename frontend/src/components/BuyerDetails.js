import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";
import "../pages/CottageDetails.css";

const BuyerDetails = () => {
  const { buyerId } = useParams();
  const [buyer, setBuyer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const buyerResponse = await axiosInstance.get(
          `/documents/buyers/by-id/${buyerId}/`
        );
        setBuyer(buyerResponse.data);
        setLoading(false);
      } catch (err) {
        setError("خطا در دریافت اطلاعات");
        setLoading(false);
      }
    };

    fetchData();
  }, [buyerId]);
  const handleDelete = async () => {
    if (
      !window.confirm("آیا مطمئن هستید که می‌خواهید این خریدار را حذف کنید؟")
    ) {
      return;
    }

    try {
      await axiosInstance.delete(`/documents/buyers/${buyerId}/`);
      alert("خریدار با موفقیت حذف شد.");
      window.location.href = "/buyers/list"; // Redirect to the buyer list page
    } catch (err) {
      setError("خطا در حذف خریدار.");
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    try {
      const response = await axiosInstance.put(
        `/documents/buyers/${buyerId}/`,
        buyer
      );
      setSuccessMessage("تغییرات با موفقیت ذخیره شد.");
    } catch (err) {
      setError("خطا در ذخیره تغییرات.");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBuyer((prev) => ({ ...prev, [name]: value }));
  };

  if (loading) return <div className="loading">در حال بارگذاری...</div>;
  if (!buyer) return <div className="error">{error}</div>;

  return (
    <div className="cottage-details-container">
      <div className="header">جزئیات خریدار</div>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div className="form-group">
          <label htmlFor="buyer_name">نام خریدار:</label>
          <input
            type="text"
            id="buyer_name"
            name="buyer_name"
            value={buyer.buyer_name || ""}
            onChange={handleChange}
            className="editable-input"
          />
        </div>
        <div className="form-group">
          <label htmlFor="buyer_address">آدرس خریدار:</label>
          <textarea
            id="buyer_address"
            name="buyer_address"
            value={buyer.buyer_address || ""}
            onChange={handleChange}
            className="editable-input form-textarea"
          />
        </div>
        <div className="form-group">
          <label htmlFor="buyer_card_number">شماره کارت بازرگانی:</label>
          <input
            type="text"
            id="buyer_card_number"
            name="buyer_card_number"
            value={buyer.buyer_card_number || ""}
            onChange={handleChange}
            className="editable-input"
          />
        </div>
        <div className="form-group">
          <label htmlFor="buyer_tel">تلفن خریدار:</label>
          <input
            type="text"
            id="buyer_tel"
            name="buyer_tel"
            value={buyer.buyer_tel || ""}
            onChange={handleChange}
            className="editable-input"
          />
        </div>

        <button type="submit" className="primary-button">
          ثبت تغییرات
        </button>
        <button type="button" className="delete-button" onClick={handleDelete}>
          حذف خریدار
        </button>
      </form>
      {successMessage && <div className="cottage-info">{successMessage}</div>}
      {error && <div className="error">{error}</div>}
    </div>
  );
};

export default BuyerDetails;
