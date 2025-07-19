// src/actions/performaActions.js
import DateObject from "react-date-object";
import axiosInstance from '../utils/axiosInstance';
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
    UPDATE_ORDER_STATUS_REQUEST,
    UPDATE_ORDER_STATUS_SUCCESS,
    UPDATE_ORDER_STATUS_FAILURE,    
    FETCH_PERFORMA_REQUEST,
    FETCH_PERFORMA_SUCCESS,
    FETCH_PERFORMA_FAILURE,
    DELETE_PERFORMAS_REQUEST,
    DELETE_PERFORMAS_SUCCESS,
    DELETE_PERFORMAS_FAILURE,
    ADD_PERFORMA_REQUEST,
    ADD_PERFORMA_SUCCESS,
    ADD_PERFORMA_FAILURE,
    IMPORT_PERFORMA_REQUEST,
    IMPORT_PERFORMA_SUCCESS,
    IMPORT_PERFORMA_FAILURE,

} from './actionTypes';

export const fetchPerformas = (formData) => async (dispatch) => {
    dispatch({ type: FETCH_PERFORMAS_REQUEST });
    try {
        const response = await axiosInstance.post('guid/', formData);
        dispatch({
            type: FETCH_PERFORMAS_SUCCESS,
            payload: response.data.performas,
        });
    } catch (error) {
        dispatch({
            type: FETCH_PERFORMAS_FAILURE,
            payload: error.response ? error.response.data.error : 'An error occurred.',
        });
    }
};
export const fetchOrders = (page = 1, pageSize = 50, filters = {}) => async (dispatch) => {
    dispatch({ type: FETCH_REGED_ORDERS_REQUEST });
const latinDigits = ["0","1","2","3","4","5","6","7","8","9"];

const persianToLatinDigits = (str = "") =>
  str.replace(/[۰-۹]/g, (d) => "۰۱۲۳۴۵۶۷۸۹".indexOf(d).toString());

const toJalaliWithSlash = (dateStr) => {
  if (!dateStr) return undefined;
  try {
    const latinDateStr = persianToLatinDigits(dateStr);
    const dateObj = new DateObject({
      date: latinDateStr,
      calendar: "persian",
      format: "YYYY-MM-DD",
    });
    return dateObj.format("YYYY-MM-DD", latinDigits);  // ← خط تیره به جای اسلش
  } catch (err) {
    console.error("تبدیل تاریخ ناموفق بود:", err);
    return undefined;
  }
};


try {
  const { search, status, startDate, endDate , currency } = filters;

  console.log("Raw startDate:", startDate);
  console.log("Raw endDate:", endDate);

  const start = toJalaliWithSlash(startDate);
  const end = toJalaliWithSlash(endDate);

  console.log("Formatted start:", start);
  console.log("Formatted end:", end);

  const params = new URLSearchParams({
    page: 1,
    page_size: 50,
    ...(search && { search }),
    ...(currency && { currency }),
    ...(status && { status }),
    ...(start && { prf_date_after: start }),
    ...(end && { prf_date_before: end }),
  });

  console.log("Final query params:", params.toString());

  const response = await axiosInstance.get(`performas/?${params.toString()}`);

  dispatch({
    type: FETCH_REGED_ORDERS_SUCCESS,
    payload: {
      orders: response.data.results,
      count: response.data.count,
      next: response.data.next,
      previous: response.data.previous,
    },
  });

} catch (error) {
        dispatch({
            type: FETCH_REGED_ORDERS_FAILURE,
            payload: error.response ? error.response.data.error : 'An error occurred.',
        });
    }
};

export const saveSelectedPerformas = (performa, ssdsshGUID, urlVCodeInt) => async (dispatch) => {
    dispatch({ type: SAVE_SELECTED_PERFORMAS_REQUEST });
    try {
      const response = await axiosInstance.post('save-selected-performas/', {
        ...performa,
        ssdsshGUID,
        urlVCodeInt,
      });
      dispatch({
        type: SAVE_SELECTED_PERFORMAS_SUCCESS,
        payload: response.data.message,
      });
    } catch (error) {
      dispatch({
        type: SAVE_SELECTED_PERFORMAS_FAILURE,
        payload: error.response ? error.response.data.error : 'An error occurred.',
      });
    }
  };
  
export const updateOrderStatus = (orderId, formData) => async (dispatch) => {
    dispatch({ type: UPDATE_ORDER_STATUS_REQUEST, payload: { orderId } });
    try {
      const response = await axiosInstance.patch(`orders/${orderId}/`, formData);
      dispatch({
        type: UPDATE_ORDER_STATUS_SUCCESS,
        payload: response.data,
      });
    } catch (error) {
      dispatch({
        type: UPDATE_ORDER_STATUS_FAILURE,
        payload: {
          orderId,
          error: error.response ? error.response.data.error : 'An error occurred.',
        },
      });
    }
};

  export const fetchOrderById = (prfVCodeInt) => async (dispatch) => {
    dispatch({ type: FETCH_PERFORMA_REQUEST });
    try {
        const response = await axiosInstance.get(`performas/${prfVCodeInt}/`);
        dispatch({
            type: FETCH_PERFORMA_SUCCESS,
            payload: response.data.performa,
        });
    } catch (error) {
        dispatch({
            type: FETCH_PERFORMA_FAILURE,
            payload: error.response ? error.response.data.error : 'An error occurred.',
        });
    }
};

export const deletePerformas = (prfVCodeIntList) => async (dispatch) => {
    dispatch({ type: DELETE_PERFORMAS_REQUEST });
    try {
        await axiosInstance.delete('performas/delete/', {
            data: { prfVCodeInt_list: prfVCodeIntList },
        });
        dispatch({
            type: DELETE_PERFORMAS_SUCCESS,
            payload: prfVCodeIntList, // Return the deleted order numbers
        });
    } catch (error) {
        dispatch({
            type: DELETE_PERFORMAS_FAILURE,
            payload: error.response ? error.response.data.error : 'An error occurred.',
        });
    }
};

export const createOrder = (cottageData) => async (dispatch) => {
    dispatch({ type: ADD_PERFORMA_REQUEST });
    try {
        const response = await axiosInstance.post('new-performa/', cottageData);
        dispatch({
            type: ADD_PERFORMA_SUCCESS,
            payload: response.data,
        });
    } catch (error) {
        dispatch({
            type: ADD_PERFORMA_FAILURE,
            payload: error.response.data ,
        });
    }
};

export const importPerforma = (file) => async (dispatch) => {
    dispatch({ type: IMPORT_PERFORMA_REQUEST });
  
    const formData = new FormData();
    formData.append('file', file);
  
    try {
      const response = await axiosInstance.post('/import-performa/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      dispatch({
        type: IMPORT_PERFORMA_SUCCESS,
        payload: response.data,
      });
    } catch (error) {
      dispatch({
        type: IMPORT_PERFORMA_FAILURE,
        payload: error.response?.data?.error || 'An error occurred during import.',
      });
    }
  };
  