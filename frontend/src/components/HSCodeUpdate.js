import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllCodes, fetchHSCode } from "../actions/hscodeActions";
import Select from "react-select"; // Import a multi-select dropdown library

const HSCodeUpdate = () => {
  const dispatch = useDispatch();
  const { loading, codeList, error } = useSelector((state) => state.hscode);
  
  const [formData, setFormData] = useState({
    sessionId: "",
    authorization: "",
    tariffCodes: [], // Array to hold selected tariff codes
  });
  const [statusMessage, setStatusMessage] = useState(""); // State for success/failure message
  const [isSuccess, setIsSuccess] = useState(null); // State to track success or failure

  useEffect(() => {
    dispatch(fetchAllCodes());
  }, [dispatch]);

  const handleTariffCodeChange = (selectedOptions) => {
    // Update the state with selected tariff codes
    setFormData({
      ...formData,
      tariffCodes: selectedOptions ? selectedOptions.map((option) => option.value) : [],
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let success = true;
    for (const tariffCode of formData.tariffCodes) {
      const data = {
        sessionId: formData.sessionId,
        authorization: formData.authorization,
        tariffCode: tariffCode,
      };

      try {
        await dispatch(fetchHSCode(data));
      } catch (err) {
        success = false;
        setIsSuccess(false);
        setStatusMessage("خطا در به‌روزرسانی تعرفه‌ها. لطفاً دوباره تلاش کنید.");
        break;
      }
    }

    if (success) {
      setIsSuccess(true);
      setStatusMessage("به‌روزرسانی تعرفه‌ها با موفقیت انجام شد.");
    }
  };

  // Transform codeList into options for the dropdown
  const codeOptions = codeList
    ? codeList.map((code) => ({ value: code.code, label: code.code }))
    : [];

  return (
    <div className="hscode-form">
      <h2>بروزرسانی تعرفه ها</h2>
      {statusMessage && (
        <p style={{ color: isSuccess ? "green" : "red" }}>{statusMessage}</p>
      )}
      {loading ? (
        <p>در حال بارگذاری...</p>
      ) : error ? (
        <p style={{ color: "red" }}>{error.detail}</p>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="sessionId">شناسه جلسه</label>
            <p>{formData.sessionId ? "شناسه جلسه تنظیم شده است" : "شناسه جلسه تنظیم نشده است"}</p>
            <input
              type="text"
              id="sessionId"
              value={formData.sessionId}
              onChange={(e) => setFormData({ ...formData, sessionId: e.target.value })}
              className="form-control hidden-input"
            />
          </div>
          <div className="form-group">
            <label htmlFor="authorization">مجوز</label>
            <p>{formData.authorization ? "مجوز تنظیم شده است" : "مجوز تنظیم نشده است"}</p>
            <input
              type="text"
              id="authorization"
              value={formData.authorization}
              onChange={(e) => setFormData({ ...formData, authorization: e.target.value })}
              className="form-control hidden-input"
            />
          </div>
          <div className="form-group">
            <label htmlFor="tariffCodes">کدهای تعرفه</label>
            <Select
              isMulti
              id="tariffCodes"
              options={codeOptions}
              onChange={handleTariffCodeChange}
              placeholder="کد تعرفه را انتخاب کنید..."
              className="basic-multi-select"
              classNamePrefix="select"
            />
          </div>
          <button type="submit" className="btn btn-primary">
            بروزرسانی تعرفه ها
          </button>
        </form>
      )}
    </div>
  );
};

export default HSCodeUpdate;

