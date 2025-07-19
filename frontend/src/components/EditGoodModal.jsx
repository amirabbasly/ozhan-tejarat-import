// src/components/EditGoodModal.js
import React, { useState, useEffect } from 'react';
import '../style/EditGoodModal.css'; // Create appropriate CSS for the modal

const EditGoodModal = ({ good, onClose, onSave }) => {
    const [customsValue, setCustomsValue] = useState('');
    const [importRights, setImportRights] = useState('');
    const [totalValue, setTotalValue] = useState('');
    const [addedValue, setAddedValue] = useState('');
    const [redCersent, setRedCersent] = useState('');
    const [otherExpense, setOtherExpense] = useState('');
    const [quantity, setQuantity] = useState('');
    const [goodsDescription, setGoodsDescription] = useState('');
    const [discount, setDiscount] = useState('');
    useEffect(() => {
        if (good) {
            setCustomsValue(good.customs_value || '');
            setImportRights(good.import_rights || '');
            setTotalValue(good.total_value || '');
            setAddedValue(good.added_value || '');
            setRedCersent(good.red_cersent || '');
            setQuantity(good.quantity || '');
            setGoodsDescription(good.goods_description || '');
            setOtherExpense(good.other_expense || '');
            setDiscount(good.discount || '');
        }
    }, [good]);

    const handleSubmit = (e) => {
        e.preventDefault();

        const updatedGood = {
            ...good,
            customs_value: parseFloat(customsValue),
            import_rights: parseFloat(importRights),
            total_value: parseFloat(totalValue),
            added_value: parseFloat(addedValue),
            red_cersent: parseFloat(redCersent),
            other_expense: parseFloat(otherExpense),
            quantity: parseInt(quantity, 10),
            goods_description: goodsDescription,
        };

        onSave(updatedGood);
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>ویرایش کالا</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>ارزش گمرکی:</label>
                        <input
                            type="number"
                            value={customsValue}
                            onChange={(e) => setCustomsValue(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>حقوق ورودی:</label>
                        <input
                            type="number"
                            value={importRights}
                            onChange={(e) => setImportRights(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>تخفیف:</label>
                        <input
                            type="number"
                            value={discount}
                            onChange={(e) => setDiscount(e.target.value)}
                            required
                        />
                    </div>                    
                    <div className="form-group">
                        <label>ارزش کل ارزی:</label>
                        <input
                            type="number"
                            value={totalValue}
                            onChange={(e) => setTotalValue(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>ارزش افزوده:</label>
                        <input
                            type="number"
                            value={addedValue}
                            onChange={(e) => setAddedValue(e.target.value)}
                            required
                        />
                    </div>                    <div className="form-group">
                        <label>سایر هزینه ها:</label>
                        <input
                            type="number"
                            value={otherExpense}
                            onChange={(e) => setOtherExpense(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>حلال احمر:</label>
                        <input
                            type="number"
                            value={redCersent}
                            onChange={(e) => setRedCersent(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>تعداد:</label>
                        <input
                            type="number"
                            value={quantity}
                            onChange={(e) => setQuantity(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>شرح کالا:</label>
                        <textarea
                            value={goodsDescription}
                            onChange={(e) => setGoodsDescription(e.target.value)}
                            required
                        />
                    </div>
                    {/* Add more fields as necessary */}
                    <div className="modal-buttons">
                        <button type="submit" className="save-button">ذخیره</button>
                        <button type="button" onClick={onClose} className="cancel-button">لغو</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditGoodModal;
