// src/components/BuyerForm.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";

function BuyerForm() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    buyer_name: "",
    buyer_card_number: "",
    buyer_country: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.post("documents/buyers/", formData);
      alert("خریدار با موفقیت ایجاد شد!");
      navigate("/");
    } catch (error) {
      console.error("خطا در ایجاد خریدار:", error);
      alert("ایجاد خریدار با خطا مواجه شد.");
    }
  };

  return (
    <form className="cottage-form" dir="rtl" onSubmit={handleSubmit}>
      <h2>ایجاد خریدار</h2>

      <div className="form-group">
        <label htmlFor="buyer_name">نام خریدار:</label>
        <input
          type="text"
          id="buyer_name"
          name="buyer_name"
          value={formData.buyer_name}
          onChange={handleChange}
          placeholder="نام خریدار را وارد کنید"
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="buyer_card_number">شماره کارت:</label>
        <input
          type="text"
          id="buyer_card_number"
          name="buyer_card_number"
          value={formData.buyer_card_number}
          onChange={handleChange}
          placeholder="شماره کارت را وارد کنید"
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="buyer_country">کشور خریدار:</label>
        <input
          type="text"
          id="buyer_country"
          name="buyer_country"
          value={formData.buyer_country}
          onChange={handleChange}
          placeholder="کشور خریدار را وارد کنید"
          required
        />
      </div>

      <button type="submit" className="btn-grad1">
        ذخیره خریدار
      </button>
    </form>
  );
}

export default BuyerForm;
