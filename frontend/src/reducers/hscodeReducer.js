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
  } from "../actions/actionTypes";
  
  const initialState = {
    loading: false,
    codeList: [],
    hscodeData: null,
    error: null,
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