// frontend/src/actions/notificationActions.js

import axiosInstance from '../utils/axiosInstance'; 
// or use axios directly if you don't have a configured axiosInstance

export const FETCH_NOTIFICATIONS_REQUEST = 'FETCH_NOTIFICATIONS_REQUEST';
export const FETCH_NOTIFICATIONS_SUCCESS = 'FETCH_NOTIFICATIONS_SUCCESS';
export const FETCH_NOTIFICATIONS_FAILURE = 'FETCH_NOTIFICATIONS_FAILURE';

export const MARK_NOTIFICATION_READ_REQUEST = 'MARK_NOTIFICATION_READ_REQUEST';
export const MARK_NOTIFICATION_READ_SUCCESS = 'MARK_NOTIFICATION_READ_SUCCESS';
export const MARK_NOTIFICATION_READ_FAILURE = 'MARK_NOTIFICATION_READ_FAILURE';

export const MARK_ALL_NOTIFICATION_READ_REQUEST = 'MARK_ALL_NOTIFICATION_READ_REQUEST';
export const MARK_ALL_NOTIFICATION_READ_SUCCESS = 'MARK_ALL_NOTIFICATION_READ_SUCCESS';
export const MARK_ALL_NOTIFICATION_READ_FAILURE = 'MARK_ALL_NOTIFICATION_READ_FAILURE';

// Fetch notifications
export const fetchNotifications = () => {
  return async (dispatch) => {
    dispatch({ type: FETCH_NOTIFICATIONS_REQUEST });
    try {
      const { data } = await axiosInstance.get('/notifications/'); 
      // e.g. GET /notifications/ => returns [{id, message, is_read, ...}, ...]
      dispatch({ type: FETCH_NOTIFICATIONS_SUCCESS, payload: data });
    } catch (error) {
      dispatch({
        type: FETCH_NOTIFICATIONS_FAILURE,
        payload: error.message || 'Failed to fetch notifications',
      });
    }
  };
};

// Mark notification as read
export const markNotificationAsRead = (notificationId) => {
  return async (dispatch) => {
    dispatch({ type: MARK_NOTIFICATION_READ_REQUEST, payload: notificationId });
    try {
      await axiosInstance.post(`/notifications/${notificationId}/read/`);
      dispatch({ type: MARK_NOTIFICATION_READ_SUCCESS, payload: notificationId });
    } catch (error) {
      dispatch({
        type: MARK_NOTIFICATION_READ_FAILURE,
        payload: error.message || 'Failed to mark notification as read',
      });
    }
  };
};
// Mark notification as read
export const markAllNotificationAsRead = () => {
  return async (dispatch) => {
    dispatch({ type: MARK_ALL_NOTIFICATION_READ_REQUEST });
    try {
      await axiosInstance.post(`/notifications/read-all/`);
      dispatch({ type: MARK_ALL_NOTIFICATION_READ_SUCCESS });
    } catch (error) {
      dispatch({
        type: MARK_ALL_NOTIFICATION_READ_FAILURE,
        payload: error.message || 'Failed to mark notification as read',
      });
    }
  };
};
