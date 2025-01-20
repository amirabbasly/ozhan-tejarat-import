import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import "./HSCodeDetail.css";
// You can optionally import an icon library for a nicer close icon
// import { FiX } from "react-icons/fi";

const HSCodeDetail = ({ onClose }) => {
  const [isClosing, setIsClosing] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(true);
  const [tagsOpen, setTagsOpen] = useState(false);
  const [commercialsOpen, setCommercialsOpen] = useState(false);

  const { loading, data, error } = useSelector(
    (state) => state.hscode || { loading: false, data: null, error: null }
  );

  const handleClose = () => {
    setIsClosing(true);
  };

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
          onClick={(e) => {
            e.stopPropagation(); // Prevent closing when clicking inside
          }}
        >
          {/* Overlay Header / Ribbon */}
          <div className="overlay-rib">
            <button className="close-btn" onClick={handleClose}>
              {/* <FiX size={20} />  If you prefer an icon from a library */}
              X
            </button>
            <p>{data.code}</p>
          </div>

          <div className="detail-container">
            {/* Details Section */}
            <div
              className={`dropdown-container ${detailsOpen ? "expanded" : ""}`}
            >
              <div
                className="dropdown-header"
                onClick={(e) => {
                  e.stopPropagation();
                  setDetailsOpen((prev) => !prev);
                }}
              >
                <span className={`arrow ${detailsOpen ? "down" : "up"}`}></span>
                {detailsOpen ? "بستن جزئیات" : "نمایش جزئیات"}
              </div>
              {detailsOpen && (
                <div className="dropdown-content">
                  <p>
                    <strong>کد تعرفه:</strong> {data.code}
                  </p>
                  <p>نام تجاری فارسی:{data.goods_name_fa}</p>
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
                    <strong>واحد شمارش:</strong> {data.SUQ}
                  </p>
                  <p>
                    <strong>فصل:</strong> {data.season.description}
                  </p>
                  <p>
                  {data.heading && (
  <p>
    <strong>قسمت:</strong> {data.heading.description}
  </p>
)}
                  </p>
                </div>
              )}
            </div>

            {/* Tags and Commercials side-by-side */}
            <div className="dropdown-row">
              {/* Tags Section */}
              <div
                className={`dropdown-container ${tagsOpen ? "expanded" : ""}`}
              >
                <div
                  className="dropdown-header"
                  onClick={(e) => {
                    e.stopPropagation();
                    setTagsOpen((prev) => !prev);
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

              {/* Commercials Section */}
              <div
                className={`dropdown-container ${
                  commercialsOpen ? "expanded" : ""
                }`}
              >
                <div
                  className="dropdown-header"
                  onClick={(e) => {
                    e.stopPropagation();
                    setCommercialsOpen((prev) => !prev);
                  }}
                >
                  <span
                    className={`arrow ${commercialsOpen ? "down" : "up"}`}
                  ></span>
                  {commercialsOpen ? "بستن مجوزها" : "نمایش مجوزها"}
                </div>
                {commercialsOpen &&
                  data.commercials &&
                  data.commercials.length > 0 && (
                    <div className="dropdown-content">
                      <ul>
                        {data.commercials.map((commercial) => (
                          <li key={commercial.id}>
                            <strong>عنوان:</strong> {commercial.title} <br />
                            <strong>شرایط:</strong> {commercial.condition} <br />
                            <strong>نتیجه:</strong> {commercial.result} <br />
                            <strong>شناسه قانون:</strong> {commercial.rule_id}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HSCodeDetail;
