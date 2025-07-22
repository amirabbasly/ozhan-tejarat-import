import React, { useState, useEffect } from "react";
import axiosInstance from "../utils/axiosInstance";
import "../style/CottageForm.css";
import Select from "react-select";

const ExpenseForm = () => {
  const [formData, setFormData] = useState({
    cottage: "",
    value: "",
    description: "",
    receipt: null,
  });
  const [cottages, setCottages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch cottages for select
  useEffect(() => {
    const fetchCottages = async () => {
      setLoading(true);
      try {
        const { data } = await axiosInstance.get("/cottages/");
        setCottages(data.results || data);
      } catch (err) {
        setError("خطا در دریافت لیست کوتاژها");
      } finally {
        setLoading(false);
      }
    };
    fetchCottages();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, receipt: e.target.files[0] });
  };

  const handleSelectChange = (selected) => {
    setFormData({ ...formData, cottage: selected ? selected.value : "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitLoading(true);
    setError(null);
    try {
      const payload = new FormData();
      payload.append("cottage", formData.cottage);
      payload.append("value", formData.value);
      payload.append("description", formData.description);
      if (formData.receipt) payload.append("receipt", formData.receipt);

      await axiosInstance.post("/expenses/", payload, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("هزینه با موفقیت ثبت شد");
      setFormData({ cottage: "", value: "", description: "", receipt: null });
    } catch (err) {
      setError(err.response?.data?.detail || "خطا در ثبت هزینه");
    } finally {
      setSubmitLoading(false);
    }
  };

  const cottageOptions = cottages.map((c) => ({
    value: c.id,
    label: c.cottage_number || c.id,
  }));

  return (
    <form className="cottage-form" onSubmit={handleSubmit}>
      <h2>ثبت هزینه جدید</h2>
      <div className="form-group">
        <span>کوتاژ</span>
        <Select
          name="cottage"
          className="selectPrf"
          value={
            cottageOptions.find((o) => o.value === formData.cottage) || null
          }
          onChange={handleSelectChange}
          options={cottageOptions}
          isLoading={loading}
          isClearable
          placeholder={loading ? "در حال بارگذاری..." : "انتخاب کوتاژ"}
          noOptionsMessage={() =>
            !loading ? "کوتاژ یافت نشد" : "در حال بارگذاری..."
          }
        />
        <span>مقدار</span>
        <input
          type="number"
          name="value"
          value={formData.value}
          onChange={handleChange}
          placeholder="مقدار هزینه"
          required
        />
        <span>شرح</span>
        <input
          type="text"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="شرح هزینه"
        />
        <span>رسید</span>
        <input
          type="file"
          name="receipt"
          accept="image/*"
          onChange={handleFileChange}
        />
      </div>
      {error && <p className="error">{error}</p>}
      <button type="submit" className="btn-grad1" disabled={submitLoading}>
        {submitLoading ? "در حال ارسال..." : "ثبت هزینه"}
      </button>
    </form>
  );
};

export default ExpenseForm;
