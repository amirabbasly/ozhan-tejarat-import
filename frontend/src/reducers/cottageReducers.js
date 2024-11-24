// src/reducers/cottageReducers.js

import {
    FETCH_COTTAGES_REQUEST,
    FETCH_COTTAGES_SUCCESS,
    FETCH_COTTAGES_FAILURE,
  } from '../actions/actionTypes';
  
  const initialState = {
    loading: false,
    cottages: [],
    error: '',
  };
  
  export const cottageReducer = (state = initialState, action) => {
    switch (action.type) {
      case FETCH_COTTAGES_REQUEST:
        return {
          ...state,
          loading: true,
          error: '',
        };
      case FETCH_COTTAGES_SUCCESS:
        return {
          ...state,
          loading: false,
          cottages: action.payload,
          error: '',
        };
      case FETCH_COTTAGES_FAILURE:
        return {
          ...state,
          loading: false,
          cottages: [],
          error: action.payload,
        };
      default:
        return state;
    }
  };
  