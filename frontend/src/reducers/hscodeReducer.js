// hscodeReducer.js
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
  } from "../actions/actionTypes";
  
  const initialState = {
    loading: false,
    codeList: [],
    hscodeData: null,
    error: null,
    data: null,
  };
  const initialImportState = {
    loading: false,
    successMessage: null,
    errorMessage: null,
};
    
  const initialListState = {
    loading: false,
    error: null,
    hscodeList: [],
  };
  
  export const hscodeReducer = (state = initialState, action) => {
    switch (action.type) {
      case FETCH_HSCODE_REQUEST:
        return { ...state, loading: true, error: null };
      case FETCH_HSCODE_SUCCESS:
        return { ...state, loading: false, hscodeData: action.payload };
      case FETCH_HSCODE_FAILURE:
        return { ...state, loading: false, error: action.payload };
        case FETCH_HSCODE_LIST_FAILURE:
          return { ...state, loading: false, error: action.payload };
          case FETCH_ALL_HSCODE_REQUEST:
            return { ...state, loading: true, error: null };
          case FETCH_ALL_HSCODE_SUCCESS:
            return {
              ...state,
              loading: false,
              codeList: action.payload,
            };
          case FETCH_ALL_HSCODE_FAILURE:
            return { ...state, loading: false, error: action.payload };
      case FETCH_HSCODE_DETAIL_REQUEST:
        return {
          ...state,
          loading: true,
          error: null,
        };
      case FETCH_HSCODE_DETAIL_SUCCESS:
        return {
          ...state,
          loading: false,
          data: action.payload,
        };
      case FETCH_HSCODE_DETAIL_FAILURE:
        return {
          ...state,
          loading: false,
          error: action.payload,
        };
      default:
        return state;
    }
  };
  export const hscodeListReducer = (state = initialListState, action) => {
  switch (action.type) {
    case FETCH_HSCODE_LIST_REQUEST:
      return { ...state, loading: true, error: null };
    case FETCH_HSCODE_LIST_SUCCESS:
      return {
        ...state,
        loading: false,
        hscodeList: action.payload.results,
        count: action.payload.count,
        next: action.payload.next,
        previous: action.payload.previous,
      };

    default:
      return state;
  }
};
export const importHSReducer = (state = initialImportState, action) => {
  switch (action.type) {
      case IMPORT_REQUEST:
          return { ...state, loading: true, successMessage: null, errorMessage: null };
      case IMPORT_SUCCESS:
          return { ...state, loading: false, successMessage: action.payload, errorMessage: null };
      case IMPORT_FAILURE:
          return { ...state, loading: false, successMessage: null, errorMessage: action.payload };
      default:
          return state;
  }
};