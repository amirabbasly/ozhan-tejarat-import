// hscodeActions.js
import {
    FETCH_HSCODE_REQUEST,
    FETCH_HSCODE_SUCCESS,
    FETCH_HSCODE_FAILURE,
    FETCH_HSCODE_LIST_REQUEST,
    FETCH_HSCODE_LIST_SUCCESS,
    FETCH_HSCODE_LIST_FAILURE,
    FETCH_ALL_HSCODE_REQUEST,
    FETCH_ALL_HSCODE_SUCCESS,
    FETCH_ALL_HSCODE_FAILURE,
    IMPORT_REQUEST,
    IMPORT_SUCCESS,
    IMPORT_FAILURE,
    FETCH_HSCODE_DETAIL_REQUEST,
    FETCH_HSCODE_DETAIL_SUCCESS,
    FETCH_HSCODE_DETAIL_FAILURE
  } from "./actionTypes";
  import axiosInstance from "../utils/axiosInstance";
  
  // Fetch HSCode data
  export const fetchHSCode = (data) => async (dispatch) => {
    dispatch({ type: FETCH_HSCODE_REQUEST });
  
    try {
      const response = await axiosInstance.post("/customs/fetch-update-hscode/", data);
      dispatch({
        type: FETCH_HSCODE_SUCCESS,
        payload: response.data,
      });
    } catch (error) {
      dispatch({
        type: FETCH_HSCODE_FAILURE,
        payload: error.response?.data || "An error occurred",
      });
    }
  };
  export const importData = (endpoint, file) => async (dispatch) => {
    dispatch({ type: IMPORT_REQUEST });

    try {
        const formData = new FormData();
        formData.append("file", file);

        const response = await axiosInstance.post(endpoint, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });

        dispatch({
            type: IMPORT_SUCCESS,
            payload: response.data.message,
        });
    } catch (error) {
        dispatch({
            type: IMPORT_FAILURE,
            payload: error.response?.data?.error || "An error occurred during import.",
        });
    }
};

// actions/hscodeActions.js

export const HSCodeList = (page = 1, pageSize = 50, filters = {}) => async (dispatch) => {
  dispatch({ type: FETCH_HSCODE_LIST_REQUEST });

  try {
    const params = new URLSearchParams();
    params.append("page", page);
    params.append("page_size", pageSize);

    if (filters.profit) params.append("profit", filters.profit);
    if (filters.priority) params.append("priority", filters.priority);
    if (filters.customsDutyRate) params.append("customs_duty_rate", filters.customsDutyRate);
    if (filters.suq) params.append("suq", filters.suq);
    
    // NEW: add 'search' if it exists
    if (filters.search) params.append("search", filters.search);

    const response = await axiosInstance.get("/customs/hscodes/?" + params.toString());

    dispatch({
      type: FETCH_HSCODE_LIST_SUCCESS,
      payload: response.data,
    });
  } catch (error) {
    dispatch({
      type: FETCH_HSCODE_LIST_FAILURE,
      payload: error.response?.data || "An error occurred",
    });
  }
};

export const fetchAllCodes = (data) => async (dispatch) => {
  dispatch({ type: FETCH_ALL_HSCODE_REQUEST });

  try {
    const response = await axiosInstance.get("/customs/code-list/", data);
    dispatch({
      type: FETCH_ALL_HSCODE_SUCCESS,
      payload: response.data,
    });
  } catch (error) {
    dispatch({
      type: FETCH_ALL_HSCODE_FAILURE,
      payload: error.response?.data || "An error occurred",
    });
  }
};
// Action Creators
export const fetchHSCodeRequest = () => ({
  type: FETCH_HSCODE_DETAIL_REQUEST,
});

export const fetchHSCodeSuccess = (data) => ({
  type: FETCH_HSCODE_DETAIL_SUCCESS,
  payload: data,
});

export const fetchHSCodeFailure = (error) => ({
  type: FETCH_HSCODE_DETAIL_FAILURE,
  payload: error,
});

// Async Action using thunk middleware
export const fetchHSCodeDetail = (code) => {
  return async (dispatch) => {
    dispatch(fetchHSCodeRequest());
    try {
      const response = await axiosInstance.get(`/customs/hscode-detail/?code=${code}`);
      // Axios automatically parses the response data
      const data = response.data;
      dispatch(fetchHSCodeSuccess(data));
    } catch (error) {
      // Error handling: use error.response.data if available
      const message = error.response && error.response.data.detail
        ? error.response.data.detail
        : error.message;
      dispatch(fetchHSCodeFailure(message));
    }
  };
};