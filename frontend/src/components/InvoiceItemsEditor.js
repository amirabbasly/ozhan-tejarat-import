// src/components/InvoiceItemsEditor.jsx
import React, { useState } from "react";
import Select from "react-select";

const InvoiceItemsEditor = ({ items, onItemsChange, unitOptions }) => {
  // Local state for modal editing
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItemIndex, setEditingItemIndex] = useState(null);
  const [modalItemData, setModalItemData] = useState({});

  // Open modal for editing an item
  const openEditModal = (index) => {
    setEditingItemIndex(index);
    setModalItemData({ ...items[index] });
    setModalOpen(true);
  };

  // Close modal
  const closeModal = () => {
    setModalOpen(false);
    setEditingItemIndex(null);
    setModalItemData({});
  };

  // Handle modal input changes
  const handleModalChange = (e) => {
    const { name, value, type, checked } = e.target;
    setModalItemData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Handle React Select change inside modal (for unit)
  const handleModalUnitSelect = (selectedOption) => {
    setModalItemData((prev) => ({
      ...prev,
      unit: selectedOption ? selectedOption.value : "",
    }));
  };

  // Save changes from the modal back into the items array
  const handleModalSave = () => {
    const updatedItems = [...items];
    updatedItems[editingItemIndex] = { ...modalItemData };
    onItemsChange(updatedItems);
    closeModal();
  };

  // Add a new item
  const addNewItem = () => {
    const newItem = {
      description: "",
      quantity: 1,
      unit_price: 0,
      nw_kg: 0,
      gw_kg: 0,
      unit: "U",
      commodity_code: "",
      pack: 1,
      origin: "",
    };
    onItemsChange([...items, newItem]);
  };

  // Remove an item
  const removeItem = (index) => {
    const updatedItems = [...items];
    updatedItems.splice(index, 1);
    onItemsChange(updatedItems);
  };

  // Calculate totals from the items list
  const calculateTotals = () => {
    const sub_total = items.reduce(
      (acc, item) => acc + item.quantity * item.unit_price,
      0
    );
    const total_gw = items.reduce((acc, item) => acc + Number(item.gw_kg), 0);
    const total_nw = items.reduce((acc, item) => acc + Number(item.nw_kg), 0);
    const total_qty = items.reduce(
      (acc, item) => acc + Number(item.quantity),
      0
    );
    const total_pack = items.reduce((acc, item) => acc + Number(item.pack), 0);
    return { sub_total, total_gw, total_nw, total_qty, total_pack };
  };

  const totals = calculateTotals();

  return (
    <div>
      <div className="goods-table-container">
        <div className="goods-header">اقلام فاکتور</div>
        {items && items.length > 0 ? (
          <table className="goods-table">
            <thead>
              <tr>
                <th>شرح کالا</th>
                <th>تعداد</th>
                <th>کد کالا</th>
                <th>قیمت واحد</th>
                <th>واحد</th>
                <th>بسته‌بندی</th>
                <th>وزن ناخالص (کیلوگرم)</th>
                <th>وزن خالص (کیلوگرم)</th>
                <th>مبدأ</th>
                <th>جمع خطی</th>
                <th>عملیات</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, index) => (
                <tr key={index}>
                  <td>{item.description}</td>
                  <td>{item.quantity}</td>
                  <td>{item.commodity_code}</td>
                  <td>{item.unit_price}</td>
                  <td>{item.unit}</td>
                  <td>{item.pack}</td>
                  <td>{item.gw_kg}</td>
                  <td>{item.nw_kg}</td>
                  <td>{item.origin}</td>
                  <td>{(item.quantity * item.unit_price).toFixed(2)}</td>
                  <td>
                    <button
                      type="button"
                      onClick={() => openEditModal(index)}
                      className="btn-grad1"
                    >
                      ویرایش
                    </button>
                    <button
                      type="button"
                      onClick={() => removeItem(index)}
                      className="delete-button"
                      style={{ marginRight: "0.5rem" }}
                    >
                      حذف
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="no-details">اقلامی برای نمایش وجود ندارد</div>
        )}
        <button
          type="button"
          onClick={addNewItem}
          className="btn-grad1"
          style={{ marginTop: "1rem" }}
        >
          افزودن کالا
        </button>
      </div>

      {/* Totals Section (read-only) */}
      <div className="totals-section">
        <h3>مجموعات</h3>
        <div className="form-group">
          <label>جمع فرعی:</label>
          <input
            type="text"
            value={totals.sub_total || 0}
            readOnly
            className="readonly-text"
          />
        </div>
        <div className="form-group">
          <label>وزن ناخالص کل (کیلوگرم):</label>
          <input
            type="text"
            value={totals.total_gw || 0}
            readOnly
            className="readonly-text"
          />
        </div>
        <div className="form-group">
          <label>وزن خالص کل (کیلوگرم):</label>
          <input
            type="text"
            value={totals.total_nw || 0}
            readOnly
            className="readonly-text"
          />
        </div>
        <div className="form-group">
          <label>تعداد کل:</label>
          <input
            type="text"
            value={totals.total_qty || 0}
            readOnly
            className="readonly-text"
          />
        </div>
        <div className="form-group">
          <label>تعداد بسته‌بندی:</label>
          <input
            type="text"
            value={totals.total_pack || 0}
            readOnly
            className="readonly-text"
          />
        </div>
      </div>

      {/* Modal Overlay for Editing an Item */}
      {modalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>ویرایش کالا</h3>
            <div className="form-group">
              <label htmlFor="modal_description">شرح کالا:</label>
              <textarea
                id="modal_description"
                name="description"
                value={modalItemData.description || ""}
                onChange={handleModalChange}
                placeholder="شرح کالا"
              />
            </div>
            <div className="form-group">
              <label htmlFor="modal_quantity">تعداد:</label>
              <input
                type="number"
                id="modal_quantity"
                name="quantity"
                value={modalItemData.quantity || ""}
                onChange={handleModalChange}
                placeholder="تعداد"
              />
            </div>
            <div className="form-group">
              <label htmlFor="modal_unit_price">قیمت واحد:</label>
              <input
                type="number"
                id="modal_unit_price"
                name="unit_price"
                step="0.01"
                value={modalItemData.unit_price || ""}
                onChange={handleModalChange}
                placeholder="قیمت واحد"
              />
            </div>
            <div className="form-group">
              <label htmlFor="modal_commodity_code">کد کالا (HS):</label>
              <input
                type="text"
                id="modal_commodity_code"
                name="commodity_code"
                value={modalItemData.commodity_code || ""}
                onChange={handleModalChange}
                placeholder="کد کالا"
              />
            </div>
            <div className="form-group">
              <label htmlFor="modal_unit">واحد:</label>
              <Select
                id="modal_unit"
                name="unit"
                options={unitOptions}
                value={
                  unitOptions.find(
                    (option) => option.value === modalItemData.unit
                  ) || null
                }
                onChange={handleModalUnitSelect}
                placeholder="انتخاب واحد"
              />
            </div>
            <div className="form-group">
              <label htmlFor="modal_nw_kg">وزن خالص (کیلوگرم):</label>
              <input
                type="number"
                id="modal_nw_kg"
                name="nw_kg"
                step="0.01"
                value={modalItemData.nw_kg || ""}
                onChange={handleModalChange}
                placeholder="وزن خالص"
              />
            </div>
            <div className="form-group">
              <label htmlFor="modal_gw_kg">وزن ناخالص (کیلوگرم):</label>
              <input
                type="number"
                id="modal_gw_kg"
                name="gw_kg"
                step="0.01"
                value={modalItemData.gw_kg || ""}
                onChange={handleModalChange}
                placeholder="وزن ناخالص"
              />
            </div>
            <div className="form-group">
              <label htmlFor="modal_pack">تعداد بسته بندی:</label>
              <input
                type="number"
                id="modal_pack"
                name="pack"
                value={modalItemData.pack || ""}
                onChange={handleModalChange}
                placeholder="تعداد بسته بندی"
              />
            </div>
            <div className="form-group">
              <label htmlFor="modal_origin">مبدأ:</label>
              <input
                type="text"
                id="modal_origin"
                name="origin"
                value={modalItemData.origin || ""}
                onChange={handleModalChange}
                placeholder="مبدأ کالا"
              />
            </div>
            <div style={{ marginTop: "1rem" }}>
              <button
                type="button"
                onClick={handleModalSave}
                className="primary-button"
                style={{ marginRight: "10px" }}
              >
                ذخیره
              </button>
              <button
                type="button"
                onClick={closeModal}
                className="delete-button"
              >
                انصراف
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Inline modal styling */}
      <style>{`
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }
        .modal-content {
          background: #fff;
          padding: 20px;
          border-radius: 8px;
          max-width: 600px;
          width: 100%;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
        }
      `}</style>
    </div>
  );
};

export default InvoiceItemsEditor;
