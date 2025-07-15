// src/actions/performaActions.js

import axiosInstance from "../utils/axiosInstance";
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
} from "./actionTypes";

export const fetchPerformas = (formData) => async (dispatch) => {
  dispatch({ type: FETCH_PERFORMAS_REQUEST });
  try {
    const response = await axiosInstance.post("guid/", formData);
    dispatch({
      type: FETCH_PERFORMAS_SUCCESS,
      payload: response.data.performas,
    });
  } catch (error) {
    dispatch({
      type: FETCH_PERFORMAS_FAILURE,
      payload: error.response
        ? error.response.data.error
        : "An error occurred.",
    });
  }
};
export const fetchOrders = () => async (dispatch) => {
  dispatch({ type: FETCH_REGED_ORDERS_REQUEST });
  try {
    const response = await axiosInstance.get("performas/");
    dispatch({
      type: FETCH_REGED_ORDERS_SUCCESS,
      payload: response.data,
    });
  } catch (error) {
    dispatch({
      type: FETCH_REGED_ORDERS_FAILURE,
      payload: error.response
        ? error.response.data.error
        : "An error occurred.",
    });
  }
};

export const saveSelectedPerformas =
  (performa, ssdsshGUID, urlVCodeInt) => async (dispatch) => {
    dispatch({ type: SAVE_SELECTED_PERFORMAS_REQUEST });
    try {
      const response = await axiosInstance.post("save-selected-performas/", {
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
        payload: error.response
          ? error.response.data.error
          : "An error occurred.",
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
        error: error.response
          ? error.response.data.error
          : "An error occurred.",
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
      payload: error.response
        ? error.response.data.error
        : "An error occurred.",
    });
  }
};

export const deletePerformas = (prfVCodeIntList) => async (dispatch) => {
  dispatch({ type: DELETE_PERFORMAS_REQUEST });
  try {
    await axiosInstance.delete("performas/delete/", {
      data: { prfVCodeInt_list: prfVCodeIntList },
    });
    dispatch({
      type: DELETE_PERFORMAS_SUCCESS,
      payload: prfVCodeIntList, // Return the deleted order numbers
    });
  } catch (error) {
    dispatch({
      type: DELETE_PERFORMAS_FAILURE,
      payload: error.response
        ? error.response.data.error
        : "An error occurred.",
    });
  }
};

export const createOrder = (cottageData) => async (dispatch) => {
  dispatch({ type: ADD_PERFORMA_REQUEST });
  try {
    const response = await axiosInstance.post("new-performa/", cottageData);
    dispatch({
      type: ADD_PERFORMA_SUCCESS,
      payload: response.data,
    });
  } catch (error) {
    dispatch({
      type: ADD_PERFORMA_FAILURE,
      payload: error.response.data,
    });
  }
};

export const importPerforma = (file) => async (dispatch) => {
  dispatch({ type: IMPORT_PERFORMA_REQUEST });

  const formData = new FormData();
  formData.append("file", file);

  try {
    const response = await axiosInstance.post("/import-performa/", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    dispatch({
      type: IMPORT_PERFORMA_SUCCESS,
      payload: response.data,
    });
  } catch (error) {
    dispatch({
      type: IMPORT_PERFORMA_FAILURE,
      payload:
        error.response?.data?.error || "An error occurred during import.",
    });
  }
};
