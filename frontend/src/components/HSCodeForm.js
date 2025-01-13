import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchHSCode } from "../actions/hscodeActions";

const HSCodeForm = () => {
  const dispatch = useDispatch();
  const { loading, hscodeData, error } = useSelector((state) => state.hscode);

  const [formData, setFormData] = useState({
    sessionId: "",
    authorization: "",
    tariffCode: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(fetchHSCode(formData));
  };

  return (
    <div className="hscode-form">
      <h2>Fetch HSCode</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>_clck:</label>
          <input
            type="text"
            name="sessionId"
            id="sessionId"
            value={formData.sessionId}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Authorization:</label>
          <input
            type="text"
            id="authorization"
            name="authorization"
            value={formData.authorization}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Tariff Code:</label>
          <input
            type="text"
            name="tariffCode"
            value={formData.tariffCode}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? "Loading..." : "Fetch HSCode"}
        </button>
      </form>

      {error && <div className="error">{error}</div>}
      {hscodeData && (
        <div className="hscode-data">
          <h3>HSCode Data</h3>
          <p>
            <strong>Tariff Code:</strong> {hscodeData.HSCode}
          </p>
          <h4>Tags:</h4>
          <ul>
            {hscodeData.tags.map((tag, index) => (
              <li key={index}>{tag}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default HSCodeForm;
