// src/actions/cottageActions.js

import axios from 'axios';
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
  UPDATE_MULTIPLE_COTTAGES_CURRENCY_PRICE_REQUEST,
  UPDATE_MULTIPLE_COTTAGES_CURRENCY_PRICE_SUCCESS,
  UPDATE_MULTIPLE_COTTAGES_CURRENCY_PRICE_FAILURE,
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
export const fetchCottages = () => {
  return async (dispatch) => {
    dispatch(fetchCottagesRequest());
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/cottages/');
      dispatch(fetchCottagesSuccess(response.data));
    } catch (error) {
      const errorMsg =
        error.response && error.response.data
          ? error.response.data
          : error.message;
      dispatch(fetchCottagesFailure(errorMsg));
    }
  };
};
export const fetchCottageDetails = (cottageNumber) => async (dispatch) => {
  dispatch({ type: FETCH_COTTAGE_DETAILS_REQUEST });

  try {
      const response = await axios.get(`http://127.0.0.1:8000/api/cottages/by-number/${cottageNumber}/`);
      dispatch({ type: FETCH_COTTAGE_DETAILS_SUCCESS, payload: response.data });
  } catch (error) {
      dispatch({ type: FETCH_COTTAGE_DETAILS_FAILURE, payload: error.message });
  }
};

export const updateCottageCurrencyPrice = (cottageId, currencyPrice) => async (dispatch) => {
  dispatch({ type: UPDATE_COTTAGE_CURRENCY_PRICE_REQUEST });

  try {
      // PATCH request to update the currency_price of the cottage
      const response = await axios.patch(
          `http://127.0.0.1:8000/api/cottages/${cottageId}/`,
          { currency_price: currencyPrice },
          { headers: { 'Content-Type': 'application/json' } }
      );

      dispatch({ type: UPDATE_COTTAGE_CURRENCY_PRICE_SUCCESS, payload: response.data });
  } catch (error) {
      const errorMsg =
          error.response && error.response.data
              ? error.response.data
              : error.message;
      dispatch({ type: UPDATE_COTTAGE_CURRENCY_PRICE_FAILURE, payload: errorMsg });
  }
};
