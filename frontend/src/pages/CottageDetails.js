// src/components/CottageDetails.js
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchCottageDetails,
  updateCottageDetails,
  deleteCottages,
  uploadFile,
} from "../actions/cottageActions";
import { useParams } from "react-router-dom";
import "./CottageDetails.css";
import DatePicker from "react-multi-date-picker";
import DateObject from "react-date-object";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import CottageGoodsList from "../components/CottageGoodsList";
import Select from "react-select";
import { fetchCostumers } from "../actions/authActions";

const CottageDetails = () => {
  const [cottageId, setCottageId] = useState("");
  const dispatch = useDispatch();
  const { cottageNumber } = useParams();
  const cottageDetails = useSelector((state) => state.cottageDetails);
  const { loading, cottage, error } = cottageDetails;
  const [isEditing, setIsEditing] = useState(false); // Tracks if in edit mode

  // State variables for each cottage field
  const [currencyPrice, setCurrencyPrice] = useState("");
  const [rafeeTaahod, setRafeeTaahod] = useState("");
  const [docsRecieved, setDocsRecieved] = useState("");
  const [rewatch, setRewatch] = useState("");
  const [booked, setBooked] = useState("");
  const [cottageNum, setCottageNum] = useState("");
  const [cottageDate, setCottageDate] = useState(null);
  const [totalValue, setTotalValue] = useState("");
  const [addedValue, setAddedValue] = useState("");
  const [customsValue, setCustomsValue] = useState("");
  const [quantity, setQuantity] = useState("");
  const [proforma, setProforma] = useState("");
  const [status, setStatus] = useState("");
  const [documents, setDocuments] = useState("");
  const [customer, setCustomer] = useState("");
  const [refrenceNumber, setRefrenceNumber] = useState("");
  const navigate = useNavigate();
  const [intermediary, setIntermediary] = useState("");
  
  const costumerstate = useSelector((state) => state.costumers);
  const { costumerList, costumersLoading, costumersError } = costumerstate || {
    costumerList: [],
    costumersLoading: false,
    costumersError: null,
  };

  const handleDeleteCottage = () => {
    if (!window.confirm("آیا از حذف این اظهارنامه اطمینان دارید؟")) {
      return;
    }

    if (cottageId) {
      dispatch(deleteCottages([cottageId]))
        .then(() => {
          alert("اظهارنامه با موفقیت حذف شد.");
          navigate("/cottages"); // Redirect to the cottage list page
        })
        .catch((error) => {
          console.error("Error deleting cottage:", error);
          alert("خطا در حذف اظهارنامه.");
        });
    }
  };

  useEffect(() => {
    if (cottageNumber) {
      dispatch(fetchCottageDetails(cottageNumber));
    }
  }, [dispatch, cottageNumber]);

  useEffect(() => {
    dispatch(fetchCostumers());
  }, [dispatch]);

  useEffect(() => {
    if (cottage) {
      setCottageId(cottage.id || "");
      setCurrencyPrice(cottage.currency_price || "");
      setCottageNum(cottage.cottage_number || "");
      setRefrenceNumber(cottage.refrence_number || "");
      setTotalValue(cottage.total_value || "");
      setAddedValue(cottage.added_value || "");
      setCustomsValue(cottage.customs_value || "");
      setQuantity(cottage.quantity || "");
      setProforma(cottage.proforma.prfVCodeInt || "");
      setDocuments(cottage.documents || "");
      setStatus(cottage.cottage_status || "");
      setCustomer(cottage.cottage_customer?.toString() || "");
      setRafeeTaahod(cottage.rafee_taahod === true ? "true" : "false"); // Ensure proper boolean handling
      setDocsRecieved(cottage.docs_recieved === true ? "true" : "false");
      setRewatch(cottage.rewatch === true ? "true" : "false");
      setBooked(cottage.booked === true ? "true" : "false");
      setIntermediary(cottage.Intermediary || "")

      if (cottage.cottage_date) {
        const dateObject = new DateObject({
          date: cottage.cottage_date,
          format: "YYYY-MM-DD",
          calendar: persian,
          locale: persian_fa,
        });
        setCottageDate(dateObject);
      } else {
        setCottageDate(null);
      }
    }
  }, [cottage]);
  const costumerOptions = costumerList.map((cust) => ({
    value: cust.id,
    label: cust.full_name, // or however you display the customer
  }));
  // Find the matching customer object in the costumers array
  const selectedCustomer = costumerList.find(
    (c) => c.id === parseInt(customer, 10)
  );

  // Show selectedCustomer.full_name in read-only mode
  <span className="readonly-text">
    {selectedCustomer ? selectedCustomer.full_name : "نام مشتری را وارد کنید"}
  </span>;

  const handleDetailsSubmit = () => {
    if (isEditing) {
      if (cottageId) {
        const updatedCottage = {
          cottage_number: cottageNum,
          cottage_date: cottageDate ? cottageDate.format("YYYY-MM-DD") : null,
          total_value: totalValue,
          customs_value: customsValue,
          addedValue: addedValue,
          quantity: quantity,
          cottage_status: status,
          cottage_customer: customer,
          Intermediary: intermediary,
          proforma: proforma,
          currency_price: currencyPrice,
          rafee_taahod: rafeeTaahod,
          docs_recieved: docsRecieved,
          rewatch: rewatch,
          booked: booked,
          refrence_number: refrenceNumber,
        };
        dispatch(
          updateCottageDetails(cottageId, updatedCottage, cottageNumber)
        );
        dispatch(uploadFile(documents, cottageId));
      }
    }
    setIsEditing((prev) => !prev); // Toggle edit mode
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (error) {
    const errorMessage =
      typeof error === "object"
        ? (error.detail && error.detail.total_value) || JSON.stringify(error)
        : error;

    return (
      <div className="error-message">
        <p>خطا:</p>
        <p>{errorMessage}</p>
        <button onClick={() => dispatch(fetchCottageDetails(cottageNumber))}>
          تلاش دوباره
        </button>
      </div>
    );
  }
  if (!cottage) {
    return <div className="no-details">No cottage details found.</div>;
  }

  return (
    <div className="cottage-details-container">
      <h1 className="header">جزئیات اظهارنامه</h1>
      <div className="cottage-info">
        <div className="input-group">
          <label htmlFor="cottageNum">
            <strong>شماره کوتاژ :</strong>
          </label>

          <span className="readonly-text">{cottageNum}</span>
        </div>

        <div className="input-group">
          <label htmlFor="cottageDate">
            <strong>تاریخ :</strong>
          </label>
          {isEditing ? (
            <DatePicker
              id="cottageDate"
              value={cottageDate}
              onChange={setCottageDate}
              calendar={persian}
              locale={persian_fa}
              format="YYYY/MM/DD"
              className="editable-datepicker"
            />
          ) : (
            <span className="readonly-text">
              {cottageDate ? cottageDate.format("YYYY/MM/DD") : "N/A"}
            </span>
          )}
        </div>
        {/* شماره ساتا - now editable */}
        <div className="input-group">
          <label htmlFor="refrenceNumber">
            <strong>شماره ساتا :</strong>
          </label>
          {isEditing ? (
            <input
              type="text"
              id="refrenceNumber"
              placeholder="شماره ساتا را وارد کنید"
              value={refrenceNumber}
              onChange={(e) => setRefrenceNumber(e.target.value)}
              className="editable-input"
            />
          ) : (
            <span className="readonly-text">
              {refrenceNumber || "شماره ساتا ثبت نشده"}
            </span>
          )}
        </div>

        <div className="input-group">
          <label htmlFor="totalValue">
            <strong>ارزش کل :</strong>
          </label>
          {isEditing ? (
            <input
              type="number"
              id="totalValue"
              value={totalValue}
              onChange={(e) => setTotalValue(e.target.value)}
              className="editable-input"
            />
          ) : (
            <span className="readonly-text">{totalValue}</span>
          )}
        </div>
        <div className="input-group">
          <label htmlFor="customsValue">
            <strong>ارزش گمرکی :</strong>
          </label>

          <span className="readonly-text">{customsValue}</span>
        </div>
          <div className="input-group">
          <label htmlFor="addedValue">
            <strong>ارزش افزوده :</strong>
          </label>

          <span className="readonly-text">{addedValue}</span>
        </div>

        <div className="input-group">
          <label htmlFor="quantity">
            <strong>تعداد کالا ها :</strong>
          </label>
          {isEditing ? (
            <input
              type="number"
              id="quantity"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className="editable-input"
            />
          ) : (
            <span className="readonly-text">{quantity}</span>
          )}
        </div>
        <div className="input-group">
          <label htmlFor="customer">
            <strong>نام مشتری :</strong>
          </label>
          {isEditing ? (
            <Select
              name="cottage_customer"
              className=""
              // If your stored value is a string, parse it to int for comparison
              value={
                costumerOptions.find(
                  (option) => option.value === parseInt(customer, 10)
                ) || null
              }
              onChange={(selectedOption) =>
                setCustomer(
                  selectedOption ? selectedOption.value.toString() : ""
                )
              }
              options={costumerOptions}
              isLoading={costumersLoading}
              isClearable
              placeholder={
                costumersLoading
                  ? "در حال بارگذاری..."
                  : costumersError
                  ? "خطا در بارگذاری"
                  : "انتخاب مشتری"
              }
              noOptionsMessage={() =>
                !costumersLoading && !costumersError
                  ? "مشتری موجود نیست"
                  : "در حال بارگذاری..."
              }
            />
          ) : (
            <span className="readonly-text">
              {selectedCustomer
                ? selectedCustomer.full_name
                : " مشتری را انتخاب کنید"}
            </span>
          )}
        </div>
        <div className="input-group">
          <label htmlFor="intermediary">
            <strong>واسط :</strong>
          </label>
          {isEditing ? (
            <input
              type="text"
              id="intermediary"
              value={intermediary}
              onChange={(e) => setIntermediary(e.target.value)}
              className="editable-input"
              placeholder="نام واسط را وارد کنید"
            />
          ) : (
            <span className="readonly-text">{intermediary ||"نام واسط را وارد کنید" }</span>
          )}
        </div>
        <div className="input-group">
          <label htmlFor="status">
            <strong>وضعیت :</strong>
          </label>
          {isEditing ? (
            <input
              type="text"
              id="status"
              placeholder=" وضعیت را وارد کنید"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="editable-input"
            />
          ) : (
            <span className="readonly-text">
              {status || " وضعیت را وارد کنید"}
            </span>
          )}
        </div>

        <div className="input-group">
          <label htmlFor="proforma">
            <strong>شماره پرونده ثبت سفارش :</strong>
          </label>

          <span className="readonly-text">
            <Link to={`/order-details/${proforma}`}>{proforma}</Link>
          </span>
        </div>

        <div className="input-group">
          <label htmlFor="currencyPrice">
            <strong>نرخ ارز :</strong>
          </label>
          {isEditing ? (
            <input
              type="number"
              id="currencyPrice"
              placeholder="نرخ ارز را وارد کنید"
              value={currencyPrice}
              onChange={(e) => setCurrencyPrice(e.target.value)}
              className="editable-input"
            />
          ) : (
            <span className="readonly-text">
              {currencyPrice || "نرخ ارز را وارد کنید"}
            </span>
          )}
        </div>

        

        <div className="input-group">
          <label htmlFor="rafeeTaahod">
            <strong>رفع تعهد :</strong>
          </label>
          {isEditing ? (
            <input
              type="checkbox"
              id="rafeeTaahod"
              checked={rafeeTaahod === "true"} // Ensure proper boolean handling
              onChange={(e) =>
                setRafeeTaahod(e.target.checked ? "true" : "false")
              }
              className="editable-checkbox"
            />
          ) : (
            <span className="readonly-text">
              {rafeeTaahod === "true" ? "بله" : "خیر"}{" "}
              {/* Display in Persian */}
            </span>
          )}
        </div>
        <div className="input-group">
          <label htmlFor="docsRecieved">
            <strong>اخذ مدارک :</strong>
          </label>
          {isEditing ? (
            <input
              type="checkbox"
              id="docsRecieved"
              checked={docsRecieved === "true"} // Ensure proper boolean handling
              onChange={(e) =>
                setDocsRecieved(e.target.checked ? "true" : "false")
              }
              className="editable-checkbox"
            />
          ) : (
            <span className="readonly-text">
              {docsRecieved === "true" ? "بله" : "خیر"}{" "}
              {/* Display in Persian */}
            </span>
          )}
        </div>
        <div className="input-group">
          <label htmlFor="rewatch">
            <strong>بازبینی :</strong>
          </label>
          {isEditing ? (
            <input
              type="checkbox"
              id="docsRecieved"
              checked={rewatch === "true"} // Ensure proper boolean handling
              onChange={(e) => setRewatch(e.target.checked ? "true" : "false")}
              className="editable-checkbox"
            />
          ) : (
            <span className="readonly-text">
              {rewatch === "true" ? "بله" : "خیر"} {/* Display in Persian */}
            </span>
          )}
        </div>
                <div className="input-group">
          <label htmlFor="booked">
            <strong>بوک شده :</strong>
          </label>
          {isEditing ? (
            <input
              type="checkbox"
              id="docsRecieved"
              checked={booked === "true"} // Ensure proper boolean handling
              onChange={(e) => setBooked(e.target.checked ? "true" : "false")}
              className="editable-checkbox"
            />
          ) : (
            <span className="readonly-text">
              {booked === "true" ? "بله" : "خیر"} {/* Display in Persian */}
            </span>
          )}
        </div>
        <div className="input-group">
          <label htmlFor="documents">
            <strong>مدارک :</strong>
          </label>
          {isEditing ? (
            <input
              type="file"
              id="documents"
              placeholder=" مدارک را اضافه کنید"
              onChange={(e) => setDocuments(e.target.files[0])}
              className="editable-input"
            />
          ) : (
            <span className="readonly-text">
              <Link to={documents}>{"دانلود" || " مدارک را اضافه کنید"}</Link>
            </span>
          )}
        </div>

        <button onClick={handleDetailsSubmit} className="primary-button">
          {isEditing ? "ذخیره" : "ویرایش"}
        </button>

        <button onClick={handleDeleteCottage} className="delete-button">
          حذف اظهارنامه
        </button>
      </div>

      <h2 className="goods-header">کالا ها</h2>
      {cottage.cottage_goods && cottage.cottage_goods.length > 0 ? (
        <CottageGoodsList goods={cottage.cottage_goods} />
      ) : (
        <p className="no-goods">کالایی یافت نشد</p>
      )}
    </div>
  );
};

export default CottageDetails;
