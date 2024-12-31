// src/components/NotificationsDropdown.js

import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchNotifications,
  markNotificationAsRead,
} from '../actions/notificationActions';
import './NotificationsDropdown.css'; // We'll define CSS here

const NotificationsDropdown = () => {
  const dispatch = useDispatch();
  const { items: notifications, loading, error, hasFetched } = useSelector(
    (state) => state.notifications
  );

  function truncateMessage(text, maxLength = 10) {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  }
  useEffect(() => {
    // Only fetch if we haven't fetched them yet
    if (!hasFetched) {
      dispatch(fetchNotifications());
    }
  }, [dispatch, hasFetched]);
  // Mark as read handler
  const handleMarkAsRead = (id) => {
    dispatch(markNotificationAsRead(id));
  };

  // Show only UNREAD notifications
  const unreadNotifications = notifications.filter((notif) => !notif.is_read);

  if (loading) {
    return <div className="notifications-dropdown">در حال بارگیری اعلان‌ها...</div>;
  }

  if (error) {
    return (
      <div className="notifications-dropdown error">
        خطا در دریافت اعلان‌ها: {error}
      </div>
    );
  }

  return (
    <div className="notifications-dropdown">
      {unreadNotifications.length === 0 ? (
        <div className="no-notifications">هیچ اعلانی خوانده‌نشده وجود ندارد</div>
      ) : (
        unreadNotifications.map((notif) => (
          <div
            key={notif.id}
            // Dynamically assign a class based on the notification type
            className={`notification-item unread notification-${notif.type}`}
          >
            {/* Optionally display an icon depending on type */}
            <span className="notification-icon">
              {notif.type === 'success' && <span>✔️</span>}
              {notif.type === 'warning' && <span>⚠️</span>}
              {notif.type === 'error' && <span>❌</span>}
              {notif.type === 'info' && <span>ℹ️</span>}
            </span>

            <p className="notification-message">
              {truncateMessage(notif.message, 15)}
            </p>

            <button onClick={() => handleMarkAsRead(notif.id)}>خوانده شد</button>
          </div>
        ))
      )}
      <Link to="/notifications/all" className="view-all-link">
        مشاهده همه اعلانات
      </Link>
    </div>
  );
};

export default NotificationsDropdown;
