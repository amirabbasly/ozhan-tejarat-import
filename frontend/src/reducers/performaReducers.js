// src/reducers/performaReducer.js

import {
    FETCH_PERFORMAS_REQUEST,
    FETCH_PERFORMAS_SUCCESS,
    FETCH_PERFORMAS_FAILURE,
    SAVE_SELECTED_PERFORMAS_REQUEST,
    SAVE_SELECTED_PERFORMAS_SUCCESS,
    SAVE_SELECTED_PERFORMAS_FAILURE,
  } from '../actions/actionTypes';
  
  const initialState = {
    loading: false,
    performas: [],
    error: '',
    message: '',
  };
  
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
  
  export default performaReducer;
  