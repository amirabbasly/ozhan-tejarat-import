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
  FETCH_PERFORMA_REQUEST,
  FETCH_PERFORMA_SUCCESS,
  FETCH_PERFORMA_FAILURE,
  UPDATE_ORDER_STATUS_REQUEST,
  UPDATE_ORDER_STATUS_SUCCESS,
  UPDATE_ORDER_STATUS_FAILURE,  
} from '../actions/actionTypes';

// Initial state for performaReducer
const initialState = {
  loading: false,
  performas: [],
  error: '',
  message: '',
};
const detailsInitialState = {
  order: null,
  loading: false,
  error: null,
};
// Initial state for orderReducer
const orderInitialState = {
  loading: false,
  orders: [],
  error: '',
  message: '',
};
export const regedOrderDetailsReducer = (state = detailsInitialState, action) => {
  switch (action.type) {
      case FETCH_PERFORMA_REQUEST:
      case UPDATE_ORDER_STATUS_REQUEST:
          return {
              ...state,
              loading: true,
              error: null,
          };
      case FETCH_PERFORMA_SUCCESS:
          return {
              ...state,
              order: action.payload,
              loading: false,
          };
      case UPDATE_ORDER_STATUS_SUCCESS:
          return {
              ...state,
              loading: false,
          };
      case FETCH_PERFORMA_FAILURE:
      case UPDATE_ORDER_STATUS_FAILURE:
          return {
              ...state,
              loading: false,
              error: action.payload,
          };
      default:
          return state;
  }
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
