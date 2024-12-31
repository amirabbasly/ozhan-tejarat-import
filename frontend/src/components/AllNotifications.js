// src/components/AllNotifications.js

import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  fetchNotifications,
  markNotificationAsRead,
} from '../actions/notificationActions';
import './AllNotifications.css'; // We'll define CSS for styling

const AllNotifications = () => {
  const dispatch = useDispatch();
  const { items: notifications, loading, error } = useSelector(
    (state) => state.notifications
  );

  // Fetch all notifications on mount
  useEffect(() => {
    dispatch(fetchNotifications());
  }, [dispatch]);

  const handleMarkAsRead = (id) => {
    dispatch(markNotificationAsRead(id));
  };

  if (loading) {
    return <div className="all-notifications-container">در حال بارگیری اعلان‌ها...</div>;
  }

  if (error) {
    return (
      <div className="all-notifications-container error">
        خطا در دریافت اعلان‌ها: {error}
      </div>
    );
  }

  return (
    <div className="all-notifications-container">
      <h1>تمام اعلان‌ها</h1>
      {notifications.length === 0 ? (
        <p>هیچ اعلانی یافت نشد.</p>
      ) : (
        <ul className="notifications-list">
          {notifications.map((notif) => (
            <li
              key={notif.id}
              className={`notification-item notification-${notif.type} ${
                notif.is_read ? 'read' : 'unread'
              }`}
            >
              {/* Optional icon/emoji for each type */}
              <span className="notification-icon">
                {notif.type === 'success' && <span>✔️</span>}
                {notif.type === 'warning' && <span>⚠️</span>}
                {notif.type === 'error' && <span>❌</span>}
                {notif.type === 'info' && <span>ℹ️</span>}
              </span>

              <div className="notification-message">{notif.message}</div>

              {/* If unread, show a 'Mark as Read' button */}
              {!notif.is_read && (
                <button onClick={() => handleMarkAsRead(notif.id)}>
                  خوانده شد
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AllNotifications;
