// src/components/InvoiceDetails.jsx
import React from "react";
import Select from "react-select";
import { iranCustoms } from "../data/iranCustoms";

const InvoiceDetails = ({
  invoice,
  onFieldChange,
  sellerOptions,
  buyerOptions,
  currencyOptions,
  termsOfDeliveryOptions,
  meansOfTransportOptions,
  termsOfPaymentOptions,
  standardOptions,
  countryOptions,
}) => {
  const iranCustomsOptions = iranCustoms.map((custom) => ({
    value: custom.ctmNameStr, // or combine with ctmNameStr if needed
    label: `${custom.ctmNameStr} (${custom.ctmVCodeInt})`,
  }));
  return (
    <div>
      {/* Seller */}
      <div className="form-group">
        <label htmlFor="seller">فروشنده:</label>
        <Select
          className="selectPrf"
          id="seller"
          name="seller"
          options={sellerOptions}
          value={
            sellerOptions.find((option) => option.value === invoice.seller) ||
            null
          }
          onChange={(selectedOption) =>
            onFieldChange("seller", selectedOption ? selectedOption.value : "")
          }
          placeholder="-- انتخاب فروشنده --"
        />
      </div>

      {/* Buyer */}
      <div className="form-group">
        <label htmlFor="buyer">خریدار:</label>
        <Select
          className="selectPrf"
          id="buyer"
          name="buyer"
          options={buyerOptions}
          value={
            buyerOptions.find((option) => option.value === invoice.buyer) ||
            null
          }
          onChange={(selectedOption) =>
            onFieldChange("buyer", selectedOption ? selectedOption.value : "")
          }
          placeholder="-- انتخاب خریدار --"
        />
      </div>

      {/* Invoice Number */}
      <div className="form-group">
        <label htmlFor="proforma_invoice_number">شماره فاکتور:</label>
        <input
          type="text"
          id="proforma_invoice_number"
          name="proforma_invoice_number"
          value={invoice.proforma_invoice_number || ""}
          onChange={(e) =>
            onFieldChange("proforma_invoice_number", e.target.value)
          }
          placeholder="شماره فاکتور را وارد کنید"
          required
          className="editable-input"
        />
      </div>

      {/* Invoice Date */}
      <div className="form-group">
        <label htmlFor="proforma_invoice_date">تاریخ فاکتور:</label>
        <input
          type="date"
          id="proforma_invoice_date"
          name="proforma_invoice_date"
          value={invoice.proforma_invoice_date || ""}
          onChange={(e) => onFieldChange("proforma_invoice_date", e.target.value)}
          required
          className="editable-datepicker"
        />
      </div>
            {/* Invoice exp Date */}
            <div className="form-group">
        <label htmlFor="proforma_invoice_date">تاریخ اعتبار فاکتور:</label>
        <input
          type="date"
          id="proforma_exp_invoice_date"
          name="proforma_exp_invoice_date"
          value={invoice.proforma_invoice_exp_date || ""}
          onChange={(e) => onFieldChange("proforma_invoice_exp_date", e.target.value)}
          required
          className="editable-datepicker"
        />
      </div>

      {/* Invoice Currency */}
      <div className="form-group">
        <label htmlFor="proforma_invoice_currency">ارز:</label>
        <Select
          className="selectPrf"
          id="proforma_invoice_currency"
          name="proforma_invoice_currency"
          options={currencyOptions}
          value={
            currencyOptions.find(
              (option) => option.value === invoice.proforma_invoice_currency
            ) || null
          }
          onChange={(selectedOption) =>
            onFieldChange(
              "proforma_invoice_currency",
              selectedOption ? selectedOption.value : ""
            )
          }
          placeholder="انتخاب ارز"
        />
      </div>

      {/* Freight Charges */}
      <div className="form-group">
        <label htmlFor="proforma_freight_charges">هزینه حمل:</label>
        <input
          type="number"
          id="proforma_freight_charges"
          name="proforma_freight_charges"
          value={invoice.proforma_freight_charges}
          onChange={(e) =>
            onFieldChange("proforma_freight_charges", e.target.value)
          }
          placeholder="هزینه حمل"
          onWheel={(e) => e.target.blur()}  // <-- add this line
          className="editable-input"
        />
      </div>

      {/* Country of Origin */}
      <div className="form-group">
        <label htmlFor="country_of_origin">کشور مبدأ:</label>
        <Select
          className="selectPrf"
          id="country_of_origin"
          name="country_of_origin"
          options={countryOptions}
          isMulti
          value={
            invoice.country_of_origin
              ? invoice.country_of_origin
                  .split("-")
                  .map((val) =>
                    countryOptions.find(
                      (option) => option.value === val.trim()
                    )
                  )
              : []
          }
          onChange={(selectedOptions) => {
            const selectedValues = selectedOptions
              ? selectedOptions.map((option) => option.value)
              : [];
            onFieldChange("country_of_origin", selectedValues.join("-"));
          }}
          placeholder="انتخاب کشور مبدأ"
        />
      </div>
      {/* Port of Loading */}
      <div className="form-group">
        <label htmlFor="port_of_loading">بندر بارگیری:</label>
        <Select
          className="selectPrf"
          id="port_of_loading"
          name="port_of_loading"
          options={countryOptions}
          isMulti
          value={
            invoice.port_of_loading
              ? invoice.port_of_loading
                  .split("-")
                  .map((val) =>
                    countryOptions.find(
                      (option) => option.value === val.trim()
                    )
                  )
              : []
          }
          onChange={(selectedOptions) => {
            const selectedValues = selectedOptions
              ? selectedOptions.map((option) => option.value)
              : [];
            onFieldChange("port_of_loading", selectedValues.join("-"));
          }}
          placeholder="انتخاب بندر بارگیری"
        />
      </div>

      {/* Terms of Delivery */}
      <div className="form-group">
        <label htmlFor="terms_of_delivery">شرایط تحویل:</label>
        <Select
          className="selectPrf"
          id="terms_of_delivery"
          name="terms_of_delivery"
          options={termsOfDeliveryOptions}
          value={
            termsOfDeliveryOptions.find(
              (option) => option.value === invoice.terms_of_delivery
            ) || null
          }
          onChange={(selectedOption) =>
            onFieldChange(
              "terms_of_delivery",
              selectedOption ? selectedOption.value : ""
            )
          }
          placeholder="انتخاب شرایط تحویل"
        />
      </div>
      {/* Terms of Payment */}
      <div className="form-group">
        <label htmlFor="terms_of_payment">شرایط پرداخت:</label>
        <Select
          className="selectPrf"
          id="terms_of_payment"
          name="terms_of_payment"
          options={termsOfPaymentOptions}
          value={
            termsOfPaymentOptions.find(
              (option) => option.value === invoice.terms_of_payment
            ) || null
          }
          onChange={(selectedOption) =>
            onFieldChange(
              "terms_of_payment",
              selectedOption ? selectedOption.value : ""
            )
          }
          placeholder="انتخاب استاندارد"
        />
      </div>
      {/* Standard */}
      <div className="form-group">
        <label htmlFor="standard">standard:</label>
        <Select
          className="selectPrf"
          id="standard"
          name="standard"
          options={standardOptions}
          value={
            standardOptions.find(
              (option) => option.value === invoice.standard
            ) || null
          }
          onChange={(selectedOption) =>
            onFieldChange(
              "standard",
              selectedOption ? selectedOption.value : ""
            )
          }
          placeholder="انتخاب استاندارد"
        />
      </div>

      {/* Means of Transport */}
      <div className="form-group">
        <label htmlFor="means_of_transport">وسیله حمل:</label>
        <Select
          className="selectPrf"
          id="means_of_transport"
          name="means_of_transport"
          options={meansOfTransportOptions}
          isMulti
          value={
            invoice.means_of_transport
              ? invoice.means_of_transport
                  .split("-")
                  .map((val) =>
                    meansOfTransportOptions.find(
                      (option) => option.value === val.trim()
                    )
                  )
              : []
          }
          onChange={(selectedOptions) => {
            const selectedValues = selectedOptions
              ? selectedOptions.map((option) => option.value)
              : [];
            onFieldChange("means_of_transport", selectedValues.join("-"));
          }}
          placeholder="انتخاب وسیله حمل"
        />
      </div>
      <div className="form-group">
        <label htmlFor="partial_shipment">حمل به دفعات :</label>
        <input
          type="checkbox"
          id="partial_shipment"
          name="partial_shipment"
          checked={invoice.partial_shipment || false}
          onChange={(e) => onFieldChange("partial_shipment", e.target.checked)}
        />
      </div>

      {/* Customs Destination */}
      <div className="form-group">
        <label htmlFor="relevant_location">گمرک مقصد:</label>
        <Select
          className="selectPrf"
          id="relevant_location"
          name="relevant_location"
          options={iranCustomsOptions}
          isMulti
          value={
            invoice.relevant_location
              ? invoice.relevant_location
                  .split("-")
                  .map((val) =>
                    iranCustomsOptions.find(
                      (option) => option.value === val.trim()
                    )
                  )
              : []
          }
          onChange={(selectedOptions) => {
            const selectedValues = selectedOptions
              ? selectedOptions.map((option) => option.value)
              : [];
            onFieldChange("relevant_location", selectedValues.join("-"));
          }}
          placeholder="انتخاب گمرک مقصد"
        />
      </div>
    </div>
  );
};

export default InvoiceDetails;
