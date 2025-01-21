import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import HSCodeUpdateSingle from "./HSCodeUpdateSingle"; // <-- Import the new component
import "./HSCodeDetail.css";
// import { FiX } from "react-icons/fi"; // optional icon library

const HSCodeDetail = ({ onClose }) => {
  const [isClosing, setIsClosing] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(true);
  const [tagsOpen, setTagsOpen] = useState(false);
  const [commercialsOpen, setCommercialsOpen] = useState(false);

  // We load HS Code details from Redux
  const { loading, data, error } = useSelector(
    (state) => state.hscode || { loading: false, data: null, error: null }
  );
  
  // Get the user's role from Redux (adjust the selector based on your state structure)
  const { role } = useSelector((state) => state.auth.user || { role: null });

  const handleClose = () => setIsClosing(true);

  useEffect(() => {
    let timer;
    if (isClosing) {
      timer = setTimeout(() => {
        onClose();
      }, 300);
    }
    return () => clearTimeout(timer);
  }, [isClosing, onClose]);

  const overlayClass = `overlay ${isClosing ? "closing" : ""}`;
  const contentClass = `overlay-content ${isClosing ? "closing" : ""}`;

  return (
    <div className={overlayClass} onClick={handleClose}>
      {loading && <p className="detail-loading">Loading details...</p>}
      {error && <p className="detail-error">Error: {error}</p>}

      {data && (
        <div
          className={contentClass}
          onClick={(e) => e.stopPropagation()} // stop click from closing overlay
        >
          {/* Top Ribbon */}
          <div className="overlay-rib">
            <button className="close-btn" onClick={handleClose}>
              {/* <FiX size={20} /> If using an icon */}
              X
            </button>
            <p>{data.code}</p>
          </div>

          <div className="detail-container">
            {/* 1) Details */}
            <div className={`dropdown-container ${detailsOpen ? "expanded" : ""}`}>
              <div
                className="dropdown-header"
                onClick={(e) => {
                  e.stopPropagation();
                  setDetailsOpen(!detailsOpen);
                }}
              >
                <span className={`arrow ${detailsOpen ? "down" : "up"}`}></span>
                {detailsOpen ? "بستن جزئیات" : "نمایش جزئیات"}
              </div>
              {detailsOpen && (
                <div className="dropdown-content">
                  <div className="ddown-divide">
                    <p>
                      <strong>کد تعرفه:</strong> {data.code}
                    </p>
                    <p>نام تجاری فارسی: {data.goods_name_fa}</p>
                    <p>
                      <strong>نام تجاری انگلیسی:</strong> {data.goods_name_en}
                    </p>
                    <p>
                      <strong>سود بازرگانی:</strong> {data.profit}
                    </p>
                    <p>
                      <strong>حقوق گمرکی:</strong> {data.customs_duty_rate}
                    </p>
                  </div>
                  <div className="ddown-divide">
                    <p>
                      <strong>اولویت کالایی:</strong> {data.priority}
                    </p>
                    <p>
                      <strong>واحد شمارش:</strong> {data.SUQ}
                    </p>
                    <p>
                      <strong>فصل:</strong> {data.season.description}
                    </p>
                    {data.heading && (
                      <p>
                        <strong>قسمت:</strong> {data.heading.description}
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* 2) Tags and Commercials */}
            <div className="dropdown-row">
              {/* Tags */}
              <div className={`dropdown-container ${tagsOpen ? "expanded" : ""}`}>
                <div
                  className="dropdown-header"
                  onClick={(e) => {
                    e.stopPropagation();
                    setTagsOpen(!tagsOpen);
                  }}
                >
                  <span className={`arrow ${tagsOpen ? "down" : "up"}`}></span>
                  {tagsOpen ? "بستن برچسب‌ها" : "نمایش برچسب‌ها"}
                </div>
                {tagsOpen && data.tags && data.tags.length > 0 && (
                  <div className="dropdown-content">
                    {(() => {
                      const groupedMap = data.tags.reduce((map, tagObj) => {
                        const { title, tag } = tagObj;
                        if (!map.has(title)) {
                          map.set(title, []);
                        }
                        map.get(title).push(`«${tag}»`);
                        return map;
                      }, new Map());

                      const groups = Array.from(groupedMap);

                      return (
                        <ul>
                          {groups.map(([title, tags]) => (
                            <li key={title}>
                              <strong>{title}</strong>: {tags.join(" و ")}
                            </li>
                          ))}
                        </ul>
                      );
                    })()}
                  </div>
                )}
              </div>

              {/* Commercials */}
              <div
                className={`dropdown-container ${commercialsOpen ? "expanded" : ""}`}
              >
                <div
                  className="dropdown-header"
                  onClick={(e) => {
                    e.stopPropagation();
                    setCommercialsOpen(!commercialsOpen);
                  }}
                >
                  <span className={`arrow ${commercialsOpen ? "down" : "up"}`}></span>
                  {commercialsOpen ? "بستن مجوزها" : "نمایش مجوزها"}
                </div>
                {commercialsOpen &&
                  data.commercials &&
                  data.commercials.length > 0 && (
                    <div className="dropdown-content">
                      <ul>
                        {data.commercials.map((commercial) => (
                          <li key={commercial.id}>
                            <strong>{commercial.condition} :</strong> {commercial.result} <br />
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
              </div>
            </div>

            {/* 3) Include the single-update component only for admin users */}
            {role === "admin" && (
              <div style={{ marginTop: "2rem" }}>
                <HSCodeUpdateSingle code={data.code} />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default HSCodeDetail;
