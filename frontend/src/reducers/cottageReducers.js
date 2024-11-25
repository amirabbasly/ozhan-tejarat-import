// src/reducers/cottageReducers.js

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
  
} from '../actions/actionTypes';

const initialCottagesState = {
  loading: false,
  cottages: [],
  error: '',
};

const initialCottageDetailsState = {
  loading: false,
  cottage: null,
  error: '',
};


// Cottage List Reducer
export const cottageReducer = (state = initialCottagesState, action) => {
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

export const cottageDetailsReducer = (state = initialCottageDetailsState, action) => {
  switch (action.type) {
      case FETCH_COTTAGE_DETAILS_REQUEST:
      case UPDATE_COTTAGE_CURRENCY_PRICE_REQUEST:
          return { ...state, loading: true, error: '' };
      case FETCH_COTTAGE_DETAILS_SUCCESS:
      case UPDATE_COTTAGE_CURRENCY_PRICE_SUCCESS:
          return { ...state, loading: false, cottage: action.payload, error: '' };
      case FETCH_COTTAGE_DETAILS_FAILURE:
      case UPDATE_COTTAGE_CURRENCY_PRICE_FAILURE:
          return { ...state, loading: false, error: action.payload };
      default:
          return state;
  }
};