// src/reducers/performaReducer.js

import {
  FETCH_PERFORMAS_REQUEST,
  FETCH_PERFORMAS_SUCCESS,
  FETCH_PERFORMAS_FAILURE,
  SAVE_SELECTED_PERFORMAS_REQUEST,
  SAVE_SELECTED_PERFORMAS_SUCCESS,
  SAVE_SELECTED_PERFORMAS_FAILURE,
  FETCH_REGED_ORDERS_REQUEST,
  FETCH_REGED_ORDERS_SUCCESS,
  FETCH_REGED_ORDERS_FAILURE,
} from '../actions/actionTypes';

// Initial state for performaReducer
const initialState = {
  loading: false,
  performas: [],
  error: '',
  message: '',
};

// Initial state for orderReducer
const orderInitialState = {
  loading: false,
  orders: [],
  error: '',
  message: '',
};

// Reducer for registered orders
const orderReducer = (state = orderInitialState, action) => {
  switch (action.type) {
    case FETCH_REGED_ORDERS_REQUEST:
      return {
        ...state,
        loading: true,
        error: '',
        message: '',
      };
    case FETCH_REGED_ORDERS_SUCCESS:
      return {
        ...state,
        loading: false,
        orders: action.payload, // Update orders with fetched data
        error: '',
        message: '',
      };
    case FETCH_REGED_ORDERS_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    default:
      return state;
  }
};

// Reducer for performas
const performaReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_PERFORMAS_REQUEST:
    case SAVE_SELECTED_PERFORMAS_REQUEST:
      return {
        ...state,
        loading: true,
        error: '',
        message: '',
      };
    case FETCH_PERFORMAS_SUCCESS:
      return {
        ...state,
        loading: false,
        performas: action.payload,
        error: '',
      };
    case FETCH_PERFORMAS_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case SAVE_SELECTED_PERFORMAS_SUCCESS:
      return {
        ...state,
        loading: false,
        message: action.payload,
        error: '',
      };
    case SAVE_SELECTED_PERFORMAS_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    default:
      return state;
  }
};

// Export reducers as named exports
export { orderReducer, performaReducer };
