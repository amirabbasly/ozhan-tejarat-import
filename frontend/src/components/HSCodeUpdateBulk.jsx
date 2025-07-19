import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchHSCodeDetail, fetchHSCode } from "../actions/hscodeActions";

const HSCodeUpdateBulk = ({ codes }) => {
  const dispatch = useDispatch();

  // Adjust this selector according to your Redux state slices.
  const { loading, error } = useSelector((state) => state.hscode);

  // Hidden inputs for sessionId & authorization
  const [formData, setFormData] = useState({
    sessionId: "",
    authorization: "",
  });

  // For success/failure messages
  const [statusMessage, setStatusMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(null);

  // Check if both parameters are set
  const bothParamsSet = formData.sessionId && formData.authorization;
  const circleClass = bothParamsSet ? "circle circle-green" : "circle circle-red";
  const paramText = bothParamsSet
    ? "پارامترها تنظیم شده‌اند"
    : "پارامترها تنظیم نشده‌اند";

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if both sessionId and authorization are provided.
    if (!bothParamsSet) return;

    // Make sure there are codes to update
    if (!codes || codes.length === 0) {
      setIsSuccess(false);
      setStatusMessage("هیچ کدی برای به‌روزرسانی انتخاب نشده است.");
      return;
    }

    try {
      // Dispatch update for each code.
      // If your API supports bulk update via a single call, you can optimize by calling that endpoint.
      await Promise.all(
        codes.map((code) =>
          dispatch(
            fetchHSCode({
              sessionId: formData.sessionId,
              authorization: formData.authorization,
              tariffCode: code,
            })
          )
        )
      );

      // After all updates, re-fetch details for each code
      await Promise.all(codes.map((code) => dispatch(fetchHSCodeDetail(code))));

      // Mark success
      setIsSuccess(true);
      setStatusMessage("به‌روزرسانی تعرفه‌های انتخاب شده با موفقیت انجام شد.");
    } catch (err) {
      // Show error message
      setIsSuccess(false);
      setStatusMessage("خطا در به‌روزرسانی تعرفه‌ها. لطفاً دوباره تلاش کنید.");
    }
  };

  return (
    <div>
      {/* Status Message */}
      {statusMessage && (
        <p style={{ color: isSuccess ? "green" : "red" }}>
          {statusMessage}
        </p>
      )}

      {/* Loading/Error Message */}
      {loading && <p>در حال بارگذاری...</p>}
      {error && (
        <p style={{ color: "red" }}>
          {typeof error.detail === "string"
            ? error.detail
            : JSON.stringify(error.detail)}
        </p>
      )}

      <form className="hsupdate-form" onSubmit={handleSubmit}>
        <div className="param-status-line">
          <span className={circleClass} />
          <span>{paramText}</span>
        </div>

        {/* Hidden input for sessionId */}
        <div className="form-group hidden-input-group">
          <label htmlFor="sessionId">شناسه جلسه</label>
          <input
            type="text"
            id="sessionId"
            value={formData.sessionId}
            onChange={(e) =>
              setFormData({ ...formData, sessionId: e.target.value })
            }
            className="form-control hidden-input"
          />
        </div>

        {/* Hidden input for authorization */}
        <div className="form-group hidden-input-group">
          <label htmlFor="authorization">مجوز</label>
          <input
            type="text"
            id="authorization"
            value={formData.authorization}
            onChange={(e) =>
              setFormData({ ...formData, authorization: e.target.value })
            }
            className="form-control hidden-input"
          />
        </div>

        <button
          type="submit"
          className="btn-grad1"
          disabled={!bothParamsSet}
        >
          بروزرسانی تعرفه‌های انتخاب شده
        </button>
      </form>
    </div>
  );
};

export default HSCodeUpdateBulk;
