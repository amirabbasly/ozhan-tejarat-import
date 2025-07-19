// src/components/CottageGoodsList.js
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { updateCottageGoods } from '../actions/cottageActions';
import EditGoodModal from './EditGoodModal';

const CottageGoodsList = ({ goods }) => {
    const dispatch = useDispatch();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedGood, setSelectedGood] = useState(null);

    const handleEditClick = (good) => {
        setSelectedGood(good);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedGood(null);
    };

    const handleSaveGood = (updatedGood) => {
        dispatch(updateCottageGoods(updatedGood));
        handleCloseModal();
    };

    return (
        <div className='goods-table-container'>
            <table className="goods-table">
                <thead>
                    <tr>
                        <th>ردیف</th>
                        <th>مبنای محاسبه</th>
                        <th>حقوق ورودی</th>
                        <th>ارزش کل ارزی</th>
                        <th>ارزش افزوده</th>
                        <th>حلال احمر</th>
                        <th>حواله ریالی</th>
                        <th>حواله + حقوق</th>
                        <th>سایر هزینه ها</th>
                        <th>بهای تمام شده</th>
                        <th>تعداد</th>
                        <th>شرح کالا</th>
                        <th>عملیات</th>
                    </tr>
                </thead>
                <tbody>
                    {goods.map((good, index) => (
                        <tr key={good.id}>
                            <td>{index + 1}</td>
                            <td>{new Intl.NumberFormat('fa-IR').format(good.customs_value)}</td>
                            <td>{new Intl.NumberFormat('fa-IR').format(good.import_rights)}</td>
                            <td>{new Intl.NumberFormat('fa-IR').format(good.total_value)}</td>
                            <td>{new Intl.NumberFormat('fa-IR').format(good.added_value)}</td>
                            <td>{new Intl.NumberFormat('fa-IR').format(good.red_cersent)}</td>
                            <td>{new Intl.NumberFormat('fa-IR').format(good.riali)}</td>
                            <td>{new Intl.NumberFormat('fa-IR').format(good.hhhg)}</td>
                            <td>{new Intl.NumberFormat('fa-IR').format(good.other_expense)}</td>
                            <td>{new Intl.NumberFormat('fa-IR').format(good.final_price)}</td>
                            <td>{new Intl.NumberFormat('fa-IR').format(good.quantity)}</td>
                            <td>{good.goods_description}</td>
                            <td>
                                <button onClick={() => handleEditClick(good)} className="edit-button">
                                    ویرایش
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {isModalOpen && selectedGood && (
                <EditGoodModal
                    good={selectedGood}
                    onClose={handleCloseModal}
                    onSave={handleSaveGood}
                />
            )}
        </div>
    );
};

export default CottageGoodsList;