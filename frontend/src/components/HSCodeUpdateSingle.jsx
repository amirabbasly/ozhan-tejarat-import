import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchHSCodeDetail, fetchHSCode } from "../actions/hscodeActions";

const HSCodeUpdateSingle = ({ code }) => {
  const dispatch = useDispatch();

  // If your Redux store has separate slices, adjust accordingly:
  const { loading, error } = useSelector((state) => state.hscode);

  // Hidden inputs for sessionId & authorization
  const [formData, setFormData] = useState({
    sessionId: "",
    authorization: "",
  });

  // For success/failure messages
  const [statusMessage, setStatusMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(null);

  // Are both params set?
  const bothParamsSet = formData.sessionId && formData.authorization;

  // Circle + text to display
  const circleClass = bothParamsSet ? "circle circle-green" : "circle circle-red";
  const paramText = bothParamsSet
    ? "پارامترها تنظیم شده‌اند"
    : "پارامترها تنظیم نشده‌اند";

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Already disabled in the button, but we do a final check:
    if (!bothParamsSet) return;

    if (!code) {
      setIsSuccess(false);
      setStatusMessage("کد تعرفه یافت نشد.");
      return;
    }

    try {
      // 1) Update the code
      await dispatch(
        fetchHSCode({
          sessionId: formData.sessionId,
          authorization: formData.authorization,
          tariffCode: code,
        })
      );

      // 2) Once update is successful, re-fetch details for the same code
      //    so the overlay displays the latest data
      await dispatch(fetchHSCodeDetail(code));

      // 3) Mark success
      setIsSuccess(true);
      setStatusMessage("به‌روزرسانی تعرفه با موفقیت انجام شد.");
    } catch (err) {
      // If any error occurs, show failure message
      setIsSuccess(false);
      setStatusMessage("خطا در به‌روزرسانی تعرفه. لطفاً دوباره تلاش کنید.");
    }
  };

  return (
    <div >

      {/* Success/failure message */}
      {statusMessage && (
        <p style={{ color: isSuccess ? "green" : "red" }}>
          {statusMessage}
        </p>
      )}

      {/* Loading/error from Redux */}
      {loading && <p>در حال بارگذاری...</p>}
      {error && (
        <p style={{ color: "red" }}>
          {/* Guard against error.detail being an object */}
          {typeof error.detail === "string" ? error.detail : JSON.stringify(error.detail)}
        </p>
      )}

      <form className="hsupdate-form" onSubmit={handleSubmit}>
        {/* Single line for param status (circle + text) */}
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
          بروزرسانی تعرفه
        </button>
      </form>
    </div>
  );
};

export default HSCodeUpdateSingle;
