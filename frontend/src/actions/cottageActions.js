// src/actions/cottageActions.js

import axios from 'axios';
import {
  FETCH_COTTAGES_REQUEST,
  FETCH_COTTAGES_SUCCESS,
  FETCH_COTTAGES_FAILURE,
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
