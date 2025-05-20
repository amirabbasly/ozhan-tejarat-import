// src/components/InvoiceForm.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";
import Select from "react-select"; // Import ReactSelect
import "./CottageForm.css";
import { iranCustoms } from "../data/iranCustoms";
import { countries } from "../data/countryList";
import { fetchOrders } from "../actions/performaActions";
import { useSelector, useDispatch } from "react-redux";

function InvoiceForm() {
  const navigate = useNavigate(); 
  const dispatch = useDispatch();
  const orders = useSelector((state) => state.order?.orders) ?? [];
  // Fetch sellers & buyers to populate dropdowns
  const [sellers, setSellers] = useState([]);
  const [buyers, setBuyers] = useState([]);

  // Options for currency, delivery terms, payment terms, and standard types
  const currencyOptions = [
    { value: "USD", label: "دلار آمریکا" },
    { value: "EUR", label: "یورو" },
    { value: "CNY", label: "یوان چین" },

    { value: "GBP", label: "پوند استرلینگ" },
    { value: "IRR", label: "ریال" },
    { value: "AED", label: "درهم امارات" },
  ];
  const proformaOptions = orders.map((o) => ({
    value: o.prfVCodeInt,
    label: o.prf_order_no,
  }));
  const meansOfTransportOptions = [
    { value: "By Truck", label: "By Truck" },
    { value: "By AirPlane", label: "By AirPlane" },
    { value: "By Vessel", label: "By Vessel" },
    { value: "By Train", label: "By Train" },
  ];
   const countryOptions = countries.map((country) => ({
      value: country.name, // or combine with ctmNameStr if needed
      label: `${country.name} (${country.persianName})`,
    }));
  const [cottages, setCottages] = useState([]);

  const termsOfDeliveryOptions = [
    { value: "CFR", label: "CFR" },
    { value: "CIF", label: "CIF" },
    { value: "CIP", label: "CIP" },
    { value: "CPT", label: "CPT" },
    { value: "DAP", label: "DAP" },
    { value: "DDP", label: "DDP" },
    { value: "DPU", label: "DPU" },
    { value: "EXW", label: "EXW" },
    { value: "FAS", label: "FAS" },
    { value: "FCA", label: "FCA" },
    { value: "FOB", label: "FOB" },
  ];

  const unitOptions = [
    { value: "KGS", label: "KGS" },
    { value: "M3", label: "M3" },
    { value: "M2", label: "M2" },
    { value: "M", label: "M" },
    { value: "PCS", label: "PCS" },
  ];
  const iranCustomsOptions = iranCustoms.map((custom) => ({
    value: custom.ctmNameStr, // or combine with ctmNameStr if needed
    label: `${custom.ctmNameStr} (${custom.ctmVCodeInt})`,
  }));
  const [invoiceData, setInvoiceData] = useState({
    seller: "",
    buyer: "",
    cottage: "",
    proforma:"",    
    invoice_number: "",
    invoice_currency: "AED", // default value
    freight_charges: 0,
    terms_of_delivery: "CPT", // default value
    partial_shipment: false,
    relevant_location: "",
    means_of_transport: "By Ship",
    country_of_origin: "",
    port_of_loading: "",
    customer_tel:"",
    invoice_date: "",

    items: [
      {
        description: "",
        quantity: 1,
        unit_price: 0,
        nw_kg: 0,
        gw_kg: 0,
        unit: "PCS",
        commodity_code: "",
        pack: 1,
        origin: "",
      },
    ],
  });

  useEffect(() => {
    // Fetch sellers
        dispatch(fetchOrders());
    
    axiosInstance
    .get("cottages/numbers/")
    .then((res) => {
      // if you used @action(detail=False) you'll get a paginated payload:
      //    { count, next, previous, results: [ {id, cottage_number}, … ] }
      // so drill into .results
      const list = Array.isArray(res.data)
        ? res.data
        : Array.isArray(res.data.results)
          ? res.data.results
          : [];
      setCottages(list);
    })
    .catch((err) => console.error(err));
    axiosInstance
      .get("documents/sellers/")
      .then((res) => setSellers(res.data))
      .catch((err) => console.error(err));

    // Fetch buyers
    axiosInstance
      .get("documents/buyers/")
      .then((res) => setBuyers(res.data))
      .catch((err) => console.error(err));
  }, []);

  // Handle input changes (including checkboxes)
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setInvoiceData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleItemChange = (index, e) => {
    const { name, value, type, checked } = e.target;
    setInvoiceData((prev) => {
      const updatedItems = [...prev.items];
      updatedItems[index] = {
        ...updatedItems[index],
        [name]: type === "checkbox" ? checked : value,
      };
      return { ...prev, items: updatedItems };
    });
  };

  const addItemRow = () => {
    setInvoiceData((prev) => ({
      ...prev,
      items: [
        ...prev.items,
        {
          description: "",
          quantity: 1,
          unit_price: 0,
          nw_kg: 0,
          gw_kg: 0,
          unit: "U",
          commodity_code: "",
          pack: 1,
          origin: "",
        },
      ],
    }));
  };

  const removeItemRow = (index) => {
    setInvoiceData((prev) => {
      const updatedItems = [...prev.items];
      updatedItems.splice(index, 1);
      return { ...prev, items: updatedItems };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...invoiceData,
      freight_charges: parseFloat(invoiceData.freight_charges) || 0,
      items: invoiceData.items.map((item) => ({
        description: item.description,
        quantity: parseInt(item.quantity, 10) || 0,
        unit_price: parseFloat(item.unit_price) || 0,
        nw_kg: parseFloat(item.nw_kg) || 0,
        gw_kg: parseFloat(item.gw_kg) || 0,
        commodity_code: item.commodity_code,
        pack: parseInt(item.pack, 10) || 0,
        unit: item.unit,
        cottage: invoiceData.cottage,
        origin: item.origin,
      })),
    };

    try {
      await axiosInstance.post("documents/invoices/", payload);
      alert("فاکتور با موفقیت ایجاد شد!");
      navigate("/invoices/list");
    } catch (error) {
      console.error("خطا در ایجاد فاکتور:", error);
      alert("ایجاد فاکتور با خطا مواجه شد.");
    }
  };
  const cottageOptions = cottages.map((c) => ({
    value: c.cottage_number,
    label: c.cottage_number,
  }));

  // Create options for ReactSelect from fetched sellers and buyers
  const sellerOptions = sellers.map((sel) => ({
    value: sel.id,
    label: sel.seller_name,
  }));

  const buyerOptions = buyers.map((buyer) => ({
    value: buyer.id,
    label: buyer.buyer_name,
  }));

  return (
    <form className="cottage-form" dir="rtl" onSubmit={handleSubmit}>
      <h2>ایجاد فاکتور</h2>
      {/* 4. Cottage selector */}
            <div className="form-group">
        <label htmlFor="proforma">ثبت سفارش:</label>
        <Select
          id="proforma"
          className="selectPrf"

          name="proforma"
          options={proformaOptions}
          value={
            proformaOptions.find((opt) => opt.value === invoiceData.proforma) ||
            null
          }
          onChange={(opt) =>
            setInvoiceData((prev) => ({
              ...prev,
              proforma: opt ? opt.value : "",
            }))
          }
          placeholder="-- انتخاب اظهارنامه --"
        />
      </div>
      <div className="form-group">
        <label htmlFor="cottage">اظهارنامه:</label>
        <Select
          id="cottage"
          className="selectPrf"

          name="cottage"
          options={cottageOptions}
          value={
            cottageOptions.find((opt) => opt.value === invoiceData.cottage) ||
            null
          }
          onChange={(opt) =>
            setInvoiceData((prev) => ({
              ...prev,
              cottage: opt ? opt.value : "",
            }))
          }
          placeholder="-- انتخاب اظهارنامه --"
        />
      </div>
      <div className="form-group">
        <label htmlFor="seller">فروشنده:</label>
        <Select
          id="seller"
          name="seller"
          options={sellerOptions}
          className="selectPrf"
          value={
            sellerOptions.find(
              (option) => option.value === invoiceData.seller
            ) || null
          }
          onChange={(selectedOption) =>
            setInvoiceData((prev) => ({
              ...prev,
              seller: selectedOption ? selectedOption.value : "",
            }))
          }
          placeholder="-- انتخاب فروشنده --"
        />
      </div>

      <div className="form-group">
        <label htmlFor="buyer">خریدار:</label>
        <Select
          id="buyer"
          name="buyer"
          className="selectPrf"
          options={buyerOptions}
          value={
            buyerOptions.find((option) => option.value === invoiceData.buyer) ||
            null
          }
          onChange={(selectedOption) =>
            setInvoiceData((prev) => ({
              ...prev,
              buyer: selectedOption ? selectedOption.value : "",
            }))
          }
          placeholder="-- انتخاب خریدار --"
        />
      </div>

      <div className="form-group">
        <label htmlFor="invoice_number">شماره فاکتور:</label>
        <input
          type="text"
          id="invoice_number"
          name="invoice_number"
          value={invoiceData.invoice_number}
          onChange={handleChange}
          placeholder="شماره فاکتور را وارد کنید"
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="invoice_date">تاریخ فاکتور:</label>
        <input
          type="date"
          id="invoice_date"
          name="invoice_date"
          value={invoiceData.invoice_date}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="invoice_currency">ارز:</label>
        <Select
          className="selectPrf"
          id="invoice_currency"
          name="invoice_currency"
          options={currencyOptions}
          value={
            currencyOptions.find(
              (option) => option.value === invoiceData.invoice_currency
            ) || null
          }
          onChange={(selectedOption) =>
            setInvoiceData((prev) => ({
              ...prev,
              invoice_currency: selectedOption ? selectedOption.value : "",
            }))
          }
          placeholder="انتخاب ارز"
        />
      </div>

      <div className="form-group">
        <label htmlFor="freight_charges">هزینه حمل:</label>
        <input
          type="number"
          id="freight_charges"
          name="freight_charges"
          value={invoiceData.freight_charges}
          onChange={handleChange}
          placeholder="هزینه حمل"
          onWheel={(e) => e.target.blur()}  // <-- add this line

        />
      </div>
      <div className="form-group">
      <label htmlFor="country_of_origin"> کشور مبدأ</label>
      <Select
          className="selectPrf"
          id="country_of_origin"
          name="country_of_origin"
          options={countryOptions}
          isMulti
          value={
            invoiceData.country_of_origin
              ? invoiceData.country_of_origin
                  .split("-")
                  .map((val) =>
                    countryOptions.find(
                      (option) => option.value === val.trim()
                    )
                  )
              : []
          }
          onChange={(selectedOptions) => {
            // When user changes selection, join the option values with "-"
            const selectedValues = selectedOptions
              ? selectedOptions.map((option) => option.value)
              : [];
            setInvoiceData((prev) => ({
              ...prev,
              country_of_origin: selectedValues.join("-"),
            }));
          }}
          placeholder="انتخاب کشور مبدأ"
        />
      </div>
      <div className="form-group">
        <label htmlFor="customer_tel"> شماره مشتری:</label>
        <input
          type="text"
          id="customer_tel"
          name="customer_tel"
          value={invoiceData.customer_tel}
          onChange={handleChange}
          placeholder="شماره مشتری"
        />
      </div>

      <div className="form-group">
      <label htmlFor="port_of_loading"> بندر بارگیری:</label>
      <Select
          className="selectPrf"
          id="port_of_loading"
          name="port_of_loading"
          options={countryOptions}
          isMulti
          value={
            invoiceData.port_of_loading
              ? invoiceData.port_of_loading
                  .split("-")
                  .map((val) =>
                    countryOptions.find(
                      (option) => option.value === val.trim()
                    )
                  )
              : []
          }
          onChange={(selectedOptions) => {
            // When user changes selection, join the option values with "-"
            const selectedValues = selectedOptions
              ? selectedOptions.map((option) => option.value)
              : [];
            setInvoiceData((prev) => ({
              ...prev,
              port_of_loading: selectedValues.join("-"),
            }));
          }}
          placeholder="انتخاب بندر بارگیری"
        />
      </div>

      <div className="form-group">
        <label htmlFor="terms_of_delivery">شرایط تحویل:</label>
        <Select
          id="terms_of_delivery"
          name="terms_of_delivery"
          options={termsOfDeliveryOptions}
          className="selectPrf"
          value={
            termsOfDeliveryOptions.find(
              (option) => option.value === invoiceData.terms_of_delivery
            ) || null
          }
          onChange={(selectedOption) =>
            setInvoiceData((prev) => ({
              ...prev,
              terms_of_delivery: selectedOption ? selectedOption.value : "",
            }))
          }
          placeholder="انتخاب شرایط تحویل"
        />
      </div>
      <div className="form-group">
        <label htmlFor="means_of_transport">وسیله حمل:</label>
        <Select
          id="means_of_transport"
          name="means_of_transport"
          className="selectPrf"
          isMulti
          options={meansOfTransportOptions}
          value={
            invoiceData.means_of_transport
              ? invoiceData.means_of_transport
                  .split("-")
                  .map((val) =>
                    meansOfTransportOptions.find(
                      (option) => option.value === val.trim()
                    )
                  )
              : []
          }
          onChange={(selectedOptions) => {
            // When user changes selection, join the option values with "-"
            const selectedValues = selectedOptions
              ? selectedOptions.map((option) => option.value)
              : [];
            setInvoiceData((prev) => ({
              ...prev,
              means_of_transport: selectedValues.join("-"),
            }));
          }}
          placeholder="انتخاب وسیله حمل"
        />
      </div>

      <div className="form-group">
        <label htmlFor="relevant_location">گمرک مقصد:</label>
        <Select
          className="selectPrf"
          id="relevant_location"
          name="relevant_location"
          options={iranCustomsOptions}
          isMulti
          value={
            invoiceData.relevant_location
              ? invoiceData.relevant_location
                  .split("-")
                  .map((val) =>
                    iranCustomsOptions.find(
                      (option) => option.value === val.trim()
                    )
                  )
              : []
          }
          onChange={(selectedOptions) => {
            // When user changes selection, join the option values with "-"
            const selectedValues = selectedOptions
              ? selectedOptions.map((option) => option.value)
              : [];
            setInvoiceData((prev) => ({
              ...prev,
              relevant_location: selectedValues.join("-"),
            }));
          }}
          placeholder="انتخاب گمرک مقصد"
        />
      </div>

      <h3>کالاها</h3>
      {invoiceData.items.map((item, index) => (
        <div
          key={index}
          className="form-group"
          style={{
            border: "1px solid #ccc",
            padding: "0.5rem",
            marginBottom: "1rem",
          }}
        >
          <div className="form-group">
            <label htmlFor={`description-${index}`}>شرح کالا:</label>
            <textarea
              className="form-textarea"
              type="text"
              id={`description-${index}`}
              name="description"
              value={item.description}
              onChange={(e) => handleItemChange(index, e)}
              placeholder="شرح کالا"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor={`quantity-${index}`}>تعداد:</label>
            <input
              type="number"
              id={`quantity-${index}`}
              name="quantity"
              value={item.quantity}
              onChange={(e) => handleItemChange(index, e)}
              placeholder="تعداد"
              onWheel={(e) => e.target.blur()}  // <-- add this line

              required
            />
          </div>

          <div className="form-group">
            <label htmlFor={`unit_price-${index}`}>قیمت واحد:</label>
            <input
              type="number"
              id={`unit_price-${index}`}
              name="unit_price"
              step="0.01"
              value={item.unit_price}
              onChange={(e) => handleItemChange(index, e)}
              placeholder="قیمت واحد"
              onWheel={(e) => e.target.blur()}  // <-- add this line
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor={`commodity_code-${index}`}>کد کالا (HS):</label>
            <input
              type="number"
              id={`commodity_code-${index}`}
              name="commodity_code"
              min={0}
              value={item.commodity_code}
              onChange={(e) => handleItemChange(index, e)}
              placeholder="کد کالا"
              onWheel={(e) => e.target.blur()}  // <-- add this line

            />
          </div>
          <div className="form-group">
            <label htmlFor="unit">واحد:</label>
            <Select
              id={`unit-${index}`}
              name="unit"
              options={unitOptions}
              className="selectPrf"
              value={
                unitOptions.find((option) => option.value === item.unit) || null
              }
              onChange={(selectedOption) =>
                setInvoiceData((prev) => {
                  const updatedItems = [...prev.items];
                  updatedItems[index].unit = selectedOption
                    ? selectedOption.value
                    : "";
                  return { ...prev, items: updatedItems };
                })
              }
              placeholder="انتخاب واحد"
            />
          </div>

          <div className="form-group">
            <label htmlFor={`nw_kg-${index}`}>وزن خالص (کیلوگرم):</label>
            <input
              type="number"
              id={`nw_kg-${index}`}
              name="nw_kg"
              step="0.01"
              value={item.nw_kg}
              onChange={(e) => handleItemChange(index, e)}
              placeholder="وزن خالص"
              onWheel={(e) => e.target.blur()}  // <-- add this line

            />
          </div>

          <div className="form-group">
            <label htmlFor={`gw_kg-${index}`}>وزن ناخالص (کیلوگرم):</label>
            <input
              type="number"
              id={`gw_kg-${index}`}
              name="gw_kg"
              step="0.01"
              value={item.gw_kg}
              onChange={(e) => handleItemChange(index, e)}
              placeholder="وزن ناخالص"
              onWheel={(e) => e.target.blur()}  // <-- add this line


            />
          </div>
          <div className="form-group">
            <label htmlFor={`pack-${index}`}>تعداد بسته بندی :</label>
            <input
              type="number"
              id={`pack-${index}`}
              name="pack"
              value={item.pack}
              onChange={(e) => handleItemChange(index, e)}
              placeholder="تعداد بسته بندی"
              onWheel={(e) => e.target.blur()}  // <-- add this line

            />
          </div>
          <div className="form-group">
          <label htmlFor={`origin-${index}`}>مبدأ:</label>
          <Select
              id={`origin-${index}`}
              name="origin"
              options={countryOptions}
              className="selectPrf"
              value={
                countryOptions.find(
                  (option) => option.value === item.origin
                ) || null
              }
              onChange={(selectedOption) =>
                setInvoiceData((prev) => {
                  const updatedItems = [...prev.items];
                  updatedItems[index].origin = selectedOption
                    ? selectedOption.value
                    : "";
                  return { ...prev, items: updatedItems };
                })
              }
              placeholder="انتخاب مبدأ"
            />
          </div>

          <button
            type="button"
            onClick={() => removeItemRow(index)}
            className="btn-grad1"
          >
            حذف کالا
          </button>
        </div>
      ))}

      <button type="button" onClick={addItemRow} className="btn-grad1">
        افزودن کالا
      </button>

      <br />
      <br />
      <button type="submit" className="btn-grad1">
        ذخیره فاکتور
      </button>
    </form>
  );
}

export default InvoiceForm;
