// src/components/NotificationsDropdown.js

import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchNotifications,
  markNotificationAsRead,
  markAllNotificationAsRead,
} from '../actions/notificationActions';
import './NotificationsDropdown.css'; // We'll define CSS here

const MAX_DISPLAY = 4; // Maximum number of notifications to display

const NotificationsDropdown = () => {
  const dispatch = useDispatch();
  const { items: notifications, loading, error, hasFetched } = useSelector(
    (state) => state.notifications
  );

  // Helper function to truncate messages
  const truncateMessage = (text, maxLength = 15) => {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  useEffect(() => {
    // Only fetch if we haven't fetched them yet
    if (!hasFetched) {
      dispatch(fetchNotifications());
    }
  }, [dispatch, hasFetched]);

  // Handler to mark a notification as read
  const handleMarkAsRead = (id) => {
    dispatch(markNotificationAsRead(id));
  };
  const handleMarkAllAsRead = () => {
    dispatch(markAllNotificationAsRead());
  };

  // Filter UNREAD notifications
  const unreadNotifications = notifications.filter((notif) => !notif.is_read);

  // Determine displayed and hidden notifications
  const displayedNotifications = unreadNotifications.slice(0, MAX_DISPLAY);
  const hiddenNotificationsCount =
    unreadNotifications.length > MAX_DISPLAY
      ? unreadNotifications.length - MAX_DISPLAY
      : 0;

  if (loading) {
    return (
      <div className="notifications-dropdown">
        در حال بارگیری اعلان‌ها...
      </div>
    );
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
        <div className="hidden-notifications">
          هیچ اعلان خوانده‌ نشده ای وجود ندارد
        </div>
      ) : (
        <>
          {displayedNotifications.map((notif) => (
            <div
              key={notif.id}
              className={`notification-item unread notification-${notif.type}`}
            >
              {/* Optional icon based on notification type */}
              <span className="notification-icon">
                {notif.type === 'success' && <span>✔️</span>}
                {notif.type === 'warning' && <span>⚠️</span>}
                {notif.type === 'error' && <span>❌</span>}
                {notif.type === 'info' && <span>ℹ️</span>}
              </span>

              <p className="notification-message">
                {truncateMessage(notif.message, 15)}
              </p>

              <button
                className="mark-as-read-button"
                onClick={() => handleMarkAsRead(notif.id)}
                aria-label="Mark as read"
              >
                خوانده شد
              </button>
            </div>
          ))}

          {hiddenNotificationsCount > 0 && (
            <div className="hidden-notifications">
              و {hiddenNotificationsCount} اعلان خوانده‌نشده دیگر
            </div>
          )}
                    <button
                className="mark-as-read-button"
                onClick={() => handleMarkAllAsRead()}
                aria-label="Mark as read"
              >
                خواندن همه
              </button>
        </>
      )}


      <Link to="/notifications/all" className="view-all-link">
        مشاهده همه اعلانات
      </Link>
    </div>
  );
};

export default NotificationsDropdown;
