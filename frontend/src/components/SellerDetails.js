// src/components/InvoiceDetail.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";
import "../pages/CottageDetails.css";

const SellerDetails = () => {
  const { sellerId } = useParams();
  const [seller, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const sellerResponse = await axiosInstance.get(
          `/documents/sellers/by-id/${sellerId}/`
        );

        setInvoice(sellerResponse.data);
        setLoading(false);
      } catch (err) {
        setError("خطا در دریافت اطلاعات");
        setLoading(false);
      }
    };

    fetchData();
  }, [sellerId]);

  const handleSubmit = (e) => {
    e.preventDefault();
    axiosInstance
      .put(`/documents/sellers/by-id/${sellerId}/`, seller)
      .then((response) => {
        setInvoice(response.data);
        setSuccessMessage("تغییرات با موفقیت ذخیره شدند.");
        setError("");
      })
      .catch((err) => {
        setError("خطا در ذخیره تغییرات.");
        setSuccessMessage("");
      });
  };

  if (loading) return <div className="loading">در حال بارگذاری...</div>;
  if (!seller) return <div className="error">{error}</div>;

  return (
    <div className="cottage-details-container">
      <div className="header">جزئیات فروشنده</div>
      <form onSubmit={handleSubmit}>
        {/* Port of Loading */}
        <div className="form-group">
          <label htmlFor="seller_name">نام فروشنده:</label>
          <input
            type="text"
            id="seller_name"
            name="seller_name"
            value={seller.seller_name || ""}
            placeholder="نام فروشنده"
            className="editable-input"
          />
        </div>
        <div className="form-group">
          <label htmlFor="seller_address">آدرس فروشنده:</label>
          <textarea
            type="text"
            id="seller_address"
            name="seller_address"
            value={seller.seller_address || ""}
            placeholder="نام فروشنده"
            className="editable-input form-textarea"
          />
        </div>
        <div className="form-group">
          <label htmlFor="seller_country">کشور فروشنده:</label>
          <input
            type="text"
            id="seller_country"
            name="seller_country"
            value={seller.seller_country || ""}
            placeholder="کشور فروشنده"
            className="editable-input"
          />
        </div>
        <div className="form-group">
          <label htmlFor="seller_bank_name">نام بانک:</label>
          <input
            type="text"
            id="seller_bank_name"
            name="seller_bank_name"
            value={seller.seller_bank_name || ""}
            placeholder="نام بانک"
            className="editable-input"
          />
        </div>

        <div className="form-group">
          <label htmlFor="seller_iban">iban:</label>
          <input
            type="text"
            id="seller_iban"
            name="seller_iban"
            value={seller.seller_iban || ""}
            placeholder="iban"
            className="editable-input"
          />
        </div>
        <div className="form-group">
          <label htmlFor="seller_swift">swift:</label>
          <input
            type="text"
            id="seller_swift"
            name="seller_swift"
            value={seller.seller_swift || ""}
            placeholder="swift"
            className="editable-input"
          />
        </div>
        <div className="form-group">
          <label htmlFor="seller_seal">مهر فروشنده:</label>
          <input
            type="file"
            id="seller_seal"
            name="seller_seal"
            onChange={(e) => {
              const file = e.target.files[0]; // Get the selected file
              onFieldChange("seller_seal", file); // Assuming you have an `onFieldChange` function to update the state
            }}
            className="editable-input"
          />
        </div>

        <button type="submit" className="primary-button">
          ثبت تغییرات
        </button>
      </form>
      {successMessage && <div className="cottage-info">{successMessage}</div>}
      {error && <div className="error">{error}</div>}
    </div>
  );
};

export default SellerDetails;
