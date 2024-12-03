import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchOrders, updateOrderStatus } from '../actions/performaActions';
import '../components/CottageList.css'; // Using the same styles as CottageList
import { Link, useNavigate } from 'react-router-dom';

const RegedOrderList = () => {
  const navigate = useNavigate();
  const auth = useSelector((state) => state.auth);
  
  useEffect(() => {
    if (auth.isAuthenticated === false) {
      navigate('/');
    }
  }, [auth.isAuthenticated, navigate]);

  const dispatch = useDispatch();

  // Access orders state from Redux store
  const {
    orders,
    loading,
    error,
    updatingOrderStatus,
    updateOrderStatusError,
  } = useSelector((state) => state.order);

  const [selectedOrders, setSelectedOrders] = useState([]);
  const [areAllSelected, setAreAllSelected] = useState(false);
  const [orderStatus, setOrderStatus] = useState('');

  useEffect(() => {
    dispatch(fetchOrders());
  }, [dispatch]);

  useEffect(() => {
    if (Object.keys(updatingOrderStatus || {}).length === 0) {
      // Fetch updated orders when all updates are complete
      dispatch(fetchOrders());
    }
  }, [updatingOrderStatus, dispatch]);

  useEffect(() => {
    console.log('Error:', error);
    console.log('Update Order Status Error:', updateOrderStatusError);
  }, [error, updateOrderStatusError]);

  const handleSelectOrder = (event, order) => {
    const { checked } = event.target;
    let updatedSelections;

    if (checked) {
      updatedSelections = [...selectedOrders, order];
    } else {
      updatedSelections = selectedOrders.filter(
        (selectedOrder) => selectedOrder.id !== order.id
      );
    }

    setSelectedOrders(updatedSelections);
    setAreAllSelected(updatedSelections.length === orders.length);
  };

  const handleSelectAll = (event) => {
    const { checked } = event.target;
    setAreAllSelected(checked);

    if (checked) {
      setSelectedOrders(orders);
    } else {
      setSelectedOrders([]);
    }
  };

  const handleApplyOrderStatus = () => {
    if (selectedOrders.length === 0 || !orderStatus) {
      alert('لطفاً حداقل یک سفارش را انتخاب کرده و وضعیت سفارش را وارد کنید.');
      return;
    }

    // Create an array of promises from dispatching the update actions
    const updatePromises = selectedOrders.map((order) =>
      dispatch(updateOrderStatus(order.id, orderStatus))
    );

    // Wait for all update actions to complete
    Promise.all(updatePromises)
      .then(() => {
        // After all updates, fetch the orders again
        dispatch(fetchOrders());
        alert('وضعیت برای سفارش‌های انتخاب شده به‌روزرسانی شد.');
      })
      .catch((error) => {
        console.error('Error updating order status:', error);
        alert('خطا در به‌روزرسانی وضعیت برای برخی از سفارش‌ها.');
      });
  };

  return (
    <div className="cottage-cont">
      <div className="cottage-list-container">
        <h2>لیست سفارش‌های ثبت‌شده</h2>

        {/* Order Status Section */}
        <div className="currency-price-section">
          <label htmlFor="orderStatus">وضعیت سفارش:</label>
          <input
            type="text"
            id="orderStatus"
            value={orderStatus}
            onChange={(e) => setOrderStatus(e.target.value)}
            placeholder="وضعیت سفارش را وارد کنید"
          />
        </div>
        <button
          onClick={handleApplyOrderStatus}
          disabled={selectedOrders.length === 0 || !orderStatus}
        >
          ثبت وضعیت برای سفارش‌های انتخاب شده
        </button>

        {loading && <p className="loading">در حال بارگذاری...</p>}
        {error && <p className="error">{error}</p>}
        {!loading && !error && (
          orders.length === 0 ? (
            <p className="no-data">هیچ سفارشی موجود نیست.</p>
          ) : (
            <table className="cottage-table">
              <thead>
                <tr>
                  <th>
                    <input
                      type="checkbox"
                      onChange={handleSelectAll}
                      checked={areAllSelected}
                    />
                  </th>
                  <th>ردیف</th>
                  <th>شماره سفارش</th>
                  <th>تاریخ اعتبار سفارش</th>
                  <th>فروشنده</th>
                  <th>مبلغ کل</th>
                  <th>وضعیت</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order, index) => {
                  const isChecked = selectedOrders.some(
                    (selectedOrder) => selectedOrder.id === order.id
                  );
                  const isUpdating =
                    updatingOrderStatus && updatingOrderStatus[order.id];
                  const updateError = updateOrderStatusError && updateOrderStatusError[order.id];

                  return (
                    <tr key={order.id}>
                      <td>
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={(e) => handleSelectOrder(e, order)}
                        />
                      </td>
                      <td>{index + 1}</td>
                      <td>{order.prf_order_no}</td>
                      <td>{order.prf_expire_date}</td>
                      <td>{order.prf_seller_name}</td>
                      <td>
                        {new Intl.NumberFormat('fa-IR').format(order.prf_total_price)}
                      </td>
                      <td>
                        {isUpdating ? (
                          <span className="loading">در حال به‌روزرسانی...</span>
                        ) : updateError ? (
                          <span className="error">
                            {typeof updateError === 'string' ? updateError : JSON.stringify(updateError)}
                          </span>
                        ) : order.prf_status ? (
                          order.prf_status
                        ) : (
                          '—'
                        )}
                      </td>
                      <td>
                        <Link to={`/proformas/${order.prf_order_no}`}>جزئیات</Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )
        )}
      </div>
    </div>
  );
};

export default RegedOrderList;
