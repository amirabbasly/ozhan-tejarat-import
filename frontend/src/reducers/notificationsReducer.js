// frontend/src/reducers/notificationsReducer.js

import {
    FETCH_NOTIFICATIONS_REQUEST,
    FETCH_NOTIFICATIONS_SUCCESS,
    FETCH_NOTIFICATIONS_FAILURE,
    MARK_NOTIFICATION_READ_REQUEST,
    MARK_NOTIFICATION_READ_SUCCESS,
    MARK_NOTIFICATION_READ_FAILURE,
    MARK_ALL_NOTIFICATION_READ_REQUEST,
    MARK_ALL_NOTIFICATION_READ_SUCCESS,
    MARK_ALL_NOTIFICATION_READ_FAILURE,
  } from '../actions/notificationActions';
  
  const initialState = {
    items: [],
    loading: false,
    error: null,
    hasFetched: false,
  };
  
  export const notificationsReducer = (state = initialState, action) => {
    switch (action.type) {
      case FETCH_NOTIFICATIONS_REQUEST:
        return {
          ...state,
          loading: true,
          error: null,
        };
      case FETCH_NOTIFICATIONS_SUCCESS:
        return {
          ...state,
          loading: false,
          items: action.payload, // the list of notifications from the server
          hasFetched: true,
        };
      case FETCH_NOTIFICATIONS_FAILURE:
        return {
          ...state,
          loading: false,
          error: action.payload,
        };
      case MARK_NOTIFICATION_READ_REQUEST:
        // Optionally, you could mark a local `is_read` property as true here (optimistic update)
        return {
          ...state,
        };
      case MARK_NOTIFICATION_READ_SUCCESS:
        // action.payload is notificationId
        return {
          ...state,
          items: state.items.map((notification) =>
            notification.id === action.payload
              ? { ...notification, is_read: true }
              : notification
          ),
        };
        case MARK_ALL_NOTIFICATION_READ_SUCCESS:
          return {
            ...state,
            items: state.items.map((notif) => ({ ...notif, is_read: true })),
          };
      case MARK_NOTIFICATION_READ_FAILURE:
        return {
          ...state,
          // Optionally, store an error
          error: action.payload,
        };
      default:
        return state;
    }
  };
  