import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import "./HSCodeDetail.css";

const HSCodeDetail = ({ onClose }) => {
  const [isClosing, setIsClosing] = useState(false);

  // Retrieve the HSCode detail state from Redux
  const { loading, data, error } = useSelector(
    (state) => state.hscode || { loading: false, data: null, error: null }
  );

  // Trigger fade-out animation
  const handleClose = () => {
    setIsClosing(true);
  };

  // Once fade-out finishes, call onClose() to unmount this component
  useEffect(() => {
    let timer;
    if (isClosing) {
      timer = setTimeout(() => {
        onClose(); // the function passed by the parent
      }, 300); // match your CSS animation duration
    }
    return () => clearTimeout(timer);
  }, [isClosing, onClose]);

  // Add .closing class if isClosing is true
  const overlayClass = `overlay ${isClosing ? "closing" : ""}`;
  const contentClass = `overlay-content ${isClosing ? "closing" : ""}`;

  return (
    <div className={overlayClass} onClick={handleClose}>

      <div
        className={contentClass}
        onClick={(e) => {
          e.stopPropagation(); // Don’t close if clicking inside
        }}
      >
        <div className="overlay-rib">
        <button className="close-btn" onClick={handleClose}>
X
        </button>
        {data.code}
</div>
        {loading && <p className="detail-loading">Loading details...</p>}

        {error && <p className="detail-error">Error: {error}</p>}

        {data && (
          <div className="detail-container">
            <h3 className="detail-title">{data.code}</h3>
            <p>
              <strong>کد تعرفه:</strong> {data.code}
            </p>
            <p>
              <strong>نام تجاری فارسی:</strong> {data.goods_name_fa}
            </p>
            <p>
              <strong>نام تجاری انگلیسی:</strong> {data.goods_name_en}
            </p>
            <p>
              <strong>سود بازرگانی:</strong> {data.profit}
            </p>
            <p>
              <strong>حقوق گمرکی:</strong> {data.customs_duty_rate}
            </p>
            <p>
              <strong>الویت کالایی:</strong> {data.priority}
            </p>
            <p>
              <strong>واحد:</strong> {data.SUQ}
            </p>
            <p>
              <strong>فصل:</strong> {data.season.description}
            </p>
            {data.tags && data.tags.length > 0 && (
              <div className="detail-tags">
                <strong>Tags:</strong>
                <ul>
                  {data.tags.map((tag, idx) => (
                    <li key={idx}>{tag}</li>
                  ))}
                </ul>
              </div>
            )}
            
          </div>
        )}
      </div>
    </div>
  );
};

export default HSCodeDetail;
