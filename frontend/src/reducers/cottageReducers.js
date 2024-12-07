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
  CREATE_COTTAGE_REQUEST,
  CREATE_COTTAGE_SUCCESS,
  CREATE_COTTAGE_FAILURE,
  RESET_COTTAGE_CREATION,
  
} from '../actions/actionTypes';

const initialCottagesState = {
  loading: false,
  cottages: [],
  error: '',
  cottageCreation: {
    loading: false,
    success: false,
    error: '',
},
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
      case CREATE_COTTAGE_REQUEST:
        return {
            ...state,
            cottageCreation: {
                loading: true,
                success: false,
                error: '',
            },
        };
    case CREATE_COTTAGE_SUCCESS:
        return {
            ...state,
            cottageCreation: {
                loading: false,
                success: true,
                error: '',
            },
            // Optionally, add the new cottage to performas
            // performas: [...state.performas, action.payload],
        };
    case CREATE_COTTAGE_FAILURE:
        return {
            ...state,
            cottageCreation: {
                loading: false,
                success: false,
                error: action.payload,
            },
        };
    case RESET_COTTAGE_CREATION:
        return {
            ...state,
            cottageCreation: {
                loading: false,
                success: false,
                error: '',
            },
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
