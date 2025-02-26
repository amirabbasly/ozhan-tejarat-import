import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";
import "../pages/CottageDetails.css";

const SellerDetails = () => {
  const { sellerId } = useParams();
  const [seller, setSeller] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const sellerResponse = await axiosInstance.get(
          `/documents/sellers/by-id/${sellerId}/`
        );
        setSeller(sellerResponse.data);
        setLoading(false);
      } catch (err) {
        setError("خطا در دریافت اطلاعات");
        setLoading(false);
      }
    };

    fetchData();
  }, [sellerId]);
  const handleDelete = async () => {
    if (
      !window.confirm("آیا مطمئن هستید که می‌خواهید این فروشنده را حذف کنید؟")
    ) {
      return;
    }

    try {
      await axiosInstance.delete(`/documents/sellers/${sellerId}/`);
      alert("فروشنده با موفقیت حذف شد.");
      window.location.href = "/sellers/list"; // Redirect to the seller list page
    } catch (err) {
      setError("خطا در حذف فروشنده.");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSeller((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setSeller((prev) => ({ ...prev, [name]: files[0] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();

    // Append text fields
    formData.append("seller_name", seller.seller_name);
    formData.append("seller_address", seller.seller_address);
    formData.append("seller_country", seller.seller_country);
    formData.append("seller_bank_name", seller.seller_bank_name);
    formData.append("seller_iban", seller.seller_iban);
    formData.append("seller_swift", seller.seller_swift);

    // Append file fields if they exist
    if (seller.seller_seal instanceof File) {
      formData.append("seller_seal", seller.seller_seal);
    }
    if (seller.seller_logo instanceof File) {
      formData.append("seller_logo", seller.seller_logo);
    }

    try {
      const response = await axiosInstance.put(
        `/documents/sellers/${sellerId}/`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setSeller(response.data);
      setSuccessMessage("تغییرات با موفقیت ذخیره شدند.");
      setError("");
    } catch (err) {
      setError("خطا در ذخیره تغییرات.");
      setSuccessMessage("");
    }
  };

  if (loading) return <div className="loading">در حال بارگذاری...</div>;
  if (!seller) return <div className="error">{error}</div>;

  return (
    <div className="cottage-details-container">
      <div className="header">جزئیات فروشنده</div>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div className="form-group">
          <label htmlFor="seller_name">نام فروشنده:</label>
          <input
            type="text"
            id="seller_name"
            name="seller_name"
            value={seller.seller_name || ""}
            onChange={handleChange}
            className="editable-input"
          />
        </div>
        <div className="form-group">
          <label htmlFor="seller_address">آدرس فروشنده:</label>
          <textarea
            id="seller_address"
            name="seller_address"
            value={seller.seller_address || ""}
            onChange={handleChange}
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
            onChange={handleChange}
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
            onChange={handleChange}
            className="editable-input"
          />
        </div>
        <div className="form-group">
          <label htmlFor="seller_iban">IBAN:</label>
          <input
            type="text"
            id="seller_iban"
            name="seller_iban"
            value={seller.seller_iban || ""}
            onChange={handleChange}
            className="editable-input"
          />
        </div>
        <div className="form-group">
          <label htmlFor="seller_swift">SWIFT:</label>
          <input
            type="text"
            id="seller_swift"
            name="seller_swift"
            value={seller.seller_swift || ""}
            onChange={handleChange}
            className="editable-input"
          />
        </div>
        <div className="form-group">
          <label htmlFor="seller_seal">مهر فروشنده:</label>
          <input
            type="file"
            id="seller_seal"
            name="seller_seal"
            accept="image/*"
            onChange={handleFileChange}
            className="editable-input"
          />
        </div>
        <div className="form-group">
          <label htmlFor="seller_logo">لوگو فروشنده:</label>
          <input
            type="file"
            id="seller_logo"
            name="seller_logo"
            accept="image/*"
            onChange={handleFileChange}
            className="editable-input"
          />
        </div>
        <button type="submit" className="primary-button">
          ثبت تغییرات
        </button>
        <button type="button" className="delete-button" onClick={handleDelete}>
          حذف فروشنده
        </button>
      </form>
      {successMessage && <div className="cottage-info">{successMessage}</div>}
      {error && <div className="error">{error}</div>}
    </div>
  );
};

export default SellerDetails;
