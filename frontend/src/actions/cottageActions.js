// src/actions/cottageActions.js

import axiosInstance from '../utils/axiosInstance';


import {
    FETCH_COTTAGES_REQUEST,
    FETCH_COTTAGES_SUCCESS,
    FETCH_COTTAGES_FAILURE,
    FETCH_COTTAGE_DETAILS_REQUEST,
    FETCH_COTTAGE_DETAILS_SUCCESS,
    FETCH_COTTAGE_DETAILS_FAILURE,
    UPDATE_COTTAGE_CURRENCY_PRICE_REQUEST,
    UPDATE_COTTAGE_CURRENCY_PRICE_SUCCESS,
    UPDATE_COTTAGE_CURRENCY_PRICE_FAILURE,
    COTTAGE_UPDATE_REQUEST,
    COTTAGE_UPDATE_SUCCESS,
    COTTAGE_UPDATE_FAILURE,
    CREATE_COTTAGE_REQUEST,
    CREATE_COTTAGE_SUCCESS,
    CREATE_COTTAGE_FAILURE,
    DELETE_COTTAGES_REQUEST,
    DELETE_COTTAGES_SUCCESS,
    DELETE_COTTAGES_FAILURE,
    UPDATE_GOOD_REQUEST,
    UPDATE_GOOD_SUCCESS,
    UPDATE_GOOD_FAILURE,
} from './actionTypes';

// Synchronous Action Creators
export const fetchCottagesRequest = () => ({
    type: FETCH_COTTAGES_REQUEST,
});

export const fetchCottagesSuccess = (cottages) => ({
    type: FETCH_COTTAGES_SUCCESS,
    payload: cottages,
});

export const fetchCottagesFailure = (error) => ({
    type: FETCH_COTTAGES_FAILURE,
    payload: error,
});

// Asynchronous Action Creator (Thunk)
export const fetchCottages = () => async (dispatch) => {
    dispatch(fetchCottagesRequest());
    try {
        const response = await axiosInstance.get('cottages/');
        dispatch(fetchCottagesSuccess(response.data));
    } catch (error) {
        const errorMsg =
            error.response && error.response.data
                ? error.response.data
                : error.message;
        dispatch(fetchCottagesFailure(errorMsg));
    }
};


export const fetchCottageDetails = (cottageNumber) => async (dispatch) => {
    dispatch({ type: FETCH_COTTAGE_DETAILS_REQUEST });

    try {
        const response = await axiosInstance.get(`cottages/by-number/${cottageNumber}/`);
        dispatch({ type: FETCH_COTTAGE_DETAILS_SUCCESS, payload: response.data });
    } catch (error) {
        const errorMsg =
            error.response && error.response.data
                ? error.response.data
                : error.message;
        dispatch({ type: FETCH_COTTAGE_DETAILS_FAILURE, payload: errorMsg });
    }
};

export const updateCottageCurrencyPrice = (cottageId, currencyPrice) => async (dispatch) => {
    dispatch({ type: UPDATE_COTTAGE_CURRENCY_PRICE_REQUEST });

    try {
        const response = await axiosInstance.patch(`cottages/${cottageId}/`, {
            currency_price: currencyPrice,
        });

        dispatch({ type: UPDATE_COTTAGE_CURRENCY_PRICE_SUCCESS, payload: response.data });
    } catch (error) {
        const errorMsg =
            error.response && error.response.data
                ? JSON.stringify(error.response.data) // Convert object to string if necessary
                : error.message || 'Something went wrong';
        dispatch({ type: UPDATE_COTTAGE_CURRENCY_PRICE_FAILURE, payload: errorMsg });
    }
};

export const updateCottageDetails = (cottageId, updatedCottage, cottageNumber) => async (dispatch) => {
    try {
      dispatch({ type: COTTAGE_UPDATE_REQUEST });
  
      const { data } = await axiosInstance.patch(`/cottages/${cottageId}/`, updatedCottage);
  
      dispatch({
        type: COTTAGE_UPDATE_SUCCESS,
        payload: data,
      });
  
      // Fetch the updated cottage details
      const response = await axiosInstance.get(`cottages/by-number/${cottageNumber}/`);
      dispatch({ type: FETCH_COTTAGE_DETAILS_SUCCESS, payload: response.data });
  
    } catch (error) {
      const errorMsg =
            error.response && error.response.data
                ? JSON.stringify(error.response.data) // Convert object to string if necessary
                : error.message || 'Something went wrong';
  
      dispatch({
        type: COTTAGE_UPDATE_FAILURE,
        payload: errorMsg,
      });
      dispatch({
        type: FETCH_COTTAGE_DETAILS_FAILURE,
        payload: errorMsg,
      });
    }
  };
  // Function to upload files separately
// cottageActions.js

export const uploadFile = (fileData, cottageId) => async (dispatch) => {
  dispatch({ type: 'UPLOAD_FILE_REQUEST' });
  try {
      const formData = new FormData();
      formData.append('file', fileData); // Assuming `fileData` is a single file or you adjust for multiple files
      formData.append('cottage_id', cottageId);

      const response = await axiosInstance.post(`cottages/${cottageId}/upload/`, formData, {
          headers: {
              'Content-Type': 'multipart/form-data',
          },
      });

      dispatch({
          type: 'UPLOAD_FILE_SUCCESS',
          payload: response.data,
      });
  } catch (error) {
      dispatch({
          type: 'UPLOAD_FILE_FAILURE',
          payload: error.response.data,
      });
  }
};

export const createCottage = (cottageData) => async (dispatch) => {
  dispatch({ type: CREATE_COTTAGE_REQUEST });

  try {
      // Step 1: Create the cottage
      const response = await axiosInstance.post('cottages/', cottageData);

      // Dispatch success action for cottage creation
      dispatch({
          type: CREATE_COTTAGE_SUCCESS,
          payload: response.data,
      });

      // Step 2: Upload documents if provided
      if (cottageData.documents) {
          // Dispatch the uploadFile action
          await dispatch(uploadFile(cottageData.documents, response.data.id));
      }
  } catch (error) {
      // Handle failure
      dispatch({
          type: CREATE_COTTAGE_FAILURE,
          payload: error.response?.data || error.message,
      });
  }
};

export const deleteCottages = (ids) => async (dispatch) => {
    dispatch({ type: DELETE_COTTAGES_REQUEST });
  
    try {
      const response = await axiosInstance.post('cottages/delete-selected/', {
        ids: ids,
      });
  
      dispatch({
        type: DELETE_COTTAGES_SUCCESS,
        payload: response.data,
      });
  
      // Optionally, you can dispatch fetchCottages() here to refresh the list
      // dispatch(fetchCottages());
    } catch (error) {
      const errorMsg =
        error.response && error.response.data
          ? error.response.data.error || JSON.stringify(error.response.data)
          : error.message || 'An error occurred.';
      dispatch({
        type: DELETE_COTTAGES_FAILURE,
        payload: errorMsg,
      });
      throw error; // Re-throw the error so that the component can handle it
    }
  };

  export const updateCottageGoods = (good) => async (dispatch) => {
    dispatch({ type: UPDATE_GOOD_REQUEST });
    try {
        const response = await axiosInstance.put(`/cottage-goods/${good.id}/`, good);
        dispatch({ type: UPDATE_GOOD_SUCCESS, payload: response.data });
    } catch (error) {
        dispatch({
            type: UPDATE_GOOD_FAILURE,
            payload: error.response?.data?.error || 'Failed to update good.',
        });
    }
};

