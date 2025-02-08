import React, { useState, useEffect } from "react";
import axiosInstance from "../utils/axiosInstance";
import "./TextOverlayForm.css"; // Import the CSS file for styling

const TextOverlayForm = () => {
  const [templates, setTemplates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const [formData, setFormData] = useState({
    exporter: "",
    consignee: "",
    means_of_transport: "",
  });
  const [goods, setGoods] = useState([]);
  const [processedImage, setProcessedImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // دریافت قالب‌ها هنگام بارگذاری
  useEffect(() => {
    axiosInstance
      .get("/documents/templates/")
      .then((response) => setTemplates(response.data))
      .catch((err) => setError("خطا در دریافت قالب‌ها: " + err.message));
  }, []);

  const handleAddGood = () => {
    setGoods([
      ...goods,
      {
        index: goods.length + 1, // اختصاص اندیس به کالا
        description: "",
        hscode: "",
        quantity: "",
        number_of_invoices: "",
      },
    ]);
  };

  const handleGoodChange = (index, field, value) => {
    const updatedGoods = goods.map((good, i) =>
      i === index ? { ...good, [field]: value } : good
    );
    setGoods(updatedGoods);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!selectedTemplate) {
      setError("لطفاً یک قالب را انتخاب کنید.");
      setLoading(false);
      return;
    }

    const requestData = {
      ...formData,
      goods,
      template_id: selectedTemplate,
    };

    try {
      const response = await axiosInstance.post(
        "/documents/origin-cert/",
        requestData,
        {
          headers: { "Content-Type": "application/json" },
          responseType: "arraybuffer",
        }
      );

      const imageBlob = new Blob([response.data], { type: "image/jpeg" });
      const imageUrl = URL.createObjectURL(imageBlob);
      setProcessedImage(imageUrl);
    } catch (error) {
      setError("خطا در پردازش داده‌ها: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      <h1 className="form-header">ساخت گواهی مبدا</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>
            قالب را انتخاب کنید:
            <select
              className="form-select"
              onChange={(e) => setSelectedTemplate(e.target.value)}
              value={selectedTemplate}
            >
              <option value="">--انتخاب قالب--</option>
              {templates.map((template) => (
                <option key={template.id} value={template.id}>
                  {template.name}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="form-group">
          <label>
            صادرکننده:
            <input
              type="text"
              className="form-input"
              name="exporter"
              value={formData.exporter}
              onChange={(e) =>
                setFormData({ ...formData, exporter: e.target.value })
              }
            />
          </label>
        </div>

        <div className="form-group">
          <label>
            گیرنده:
            <input
              type="text"
              className="form-input"
              name="consignee"
              value={formData.consignee}
              onChange={(e) =>
                setFormData({ ...formData, consignee: e.target.value })
              }
            />
          </label>
        </div>

        <div className="form-group">
          <label>
            وسیله حمل و نقل:
            <input
              type="text"
              className="form-input"
              name="means_of_transport"
              value={formData.means_of_transport}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  means_of_transport: e.target.value,
                })
              }
            />
          </label>
        </div>

        <h3 className="goods-header">کالاها</h3>
        <div className="goods-list">
          {goods.map((good, index) => (
            <div key={index} className="goods-item">
              <h4 className="goods-title">کالا {good.index}</h4>
              <div className="form-group">
                <label>شرح:</label>
                <textarea
                  rows="3"
                  className="form-textarea"
                  value={good.description}
                  onChange={(e) =>
                    handleGoodChange(index, "description", e.target.value)
                  }
                />
              </div>
              <div className="form-group">
                <label>کد HS:</label>
                <input
                  type="text"
                  className="form-input"
                  value={good.hscode}
                  onChange={(e) =>
                    handleGoodChange(index, "hscode", e.target.value)
                  }
                />
              </div>
              <div className="form-group">
                <label>تعداد:</label>
                <input
                  type="text"
                  className="form-input"
                  value={good.quantity}
                  onChange={(e) =>
                    handleGoodChange(index, "quantity", e.target.value)
                  }
                />
              </div>
              <div className="form-group">
                <label>تعداد فاکتورها:</label>
                <input
                  type="text"
                  className="form-input"
                  value={good.number_of_invoices}
                  onChange={(e) =>
                    handleGoodChange(
                      index,
                      "number_of_invoices",
                      e.target.value
                    )
                  }
                />
              </div>
            </div>
          ))}
        </div>

        <div className="form-group">
          <button type="button" className="btn add-btn" onClick={handleAddGood}>
            اضافه کردن کالا
          </button>
        </div>

        <div className="form-group">
          <button type="submit" className="btn submit-btn" disabled={loading}>
            {loading ? "در حال پردازش..." : "ارسال"}
          </button>
        </div>
      </form>

      {error && <p className="error-message">{error}</p>}

      {processedImage && (
        <div className="image-container">
          <h2>تصویر پردازش شده</h2>
          <img
            src={processedImage}
            alt="Processed"
            className="processed-image"
          />
        </div>
      )}
    </div>
  );
};

export default TextOverlayForm;
