// src/actions/cottageActions.js

import axiosInstance from '../utils/axiosInstance';

import {
    FETCH_PRF_DASHBOARD_REQUEST,
    FETCH_PRF_DASHBOARD_SUCCESS,
    FETCH_PRF_DASHBOARD_FAILURE,
    FETCH_COT_DASHBOARD_REQUEST,
    FETCH_COT_DASHBOARD_SUCCESS,
    FETCH_COT_DASHBOARD_FAILURE,

} from './actionTypes';

export const fetchPrfDashboard = (year = 'all') => async (dispatch) => {
    dispatch({ type: FETCH_PRF_DASHBOARD_REQUEST });
  
    try {
      // Construct the request
      const config = {};
      // If year != 'all', add query params
      if (year !== 'all') {
        config.params = { year };
      }
  
      const response = await axiosInstance.get('prf-summary/', config);
      dispatch({
        type: FETCH_PRF_DASHBOARD_SUCCESS,
        payload: response.data, // e.g. { yearly_data, monthly_data, etc. }
      });
    } catch (error) {
      dispatch({
        type: FETCH_PRF_DASHBOARD_FAILURE,
        payload: error.response
          ? error.response.data.error
          : 'An error occurred.',
      });
    }
  };
  export const fetchCotDashboard = (year = 'all') => async (dispatch) => {
    dispatch({ type: FETCH_COT_DASHBOARD_REQUEST });
  
    try {
      // Construct the request
      const config = {};
      // If year != 'all', add query params
      if (year !== 'all') {
        config.params = { year };
      }
  
      const response = await axiosInstance.get('cot-summary/', config);
      dispatch({
        type: FETCH_COT_DASHBOARD_SUCCESS,
        payload: response.data, // e.g. { yearly_data, monthly_data, etc. }
      });
    } catch (error) {
      dispatch({
        type: FETCH_COT_DASHBOARD_FAILURE,
        payload: error.response
          ? error.response.data.error
          : 'An error occurred.',
      });
    }
  };