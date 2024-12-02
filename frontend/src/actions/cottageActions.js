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
        error.response && error.response.data.detail
          ? error.response.data.detail
          : error.message;
  
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
  export const createCottage = (cottageData) => async (dispatch) => {
    dispatch({ type: CREATE_COTTAGE_REQUEST });
    try {
        const response = await axiosInstance.post('cottages/', cottageData);
        dispatch({
            type: CREATE_COTTAGE_SUCCESS,
            payload: response.data,
        });
    } catch (error) {
        dispatch({
            type: CREATE_COTTAGE_FAILURE,
            payload: error.response ? error.response.data.error : 'An error occurred.',
        });
    }
};