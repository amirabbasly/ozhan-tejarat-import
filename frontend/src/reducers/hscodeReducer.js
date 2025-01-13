// hscodeReducer.js
import {
    FETCH_HSCODE_REQUEST,
    FETCH_HSCODE_SUCCESS,
    FETCH_HSCODE_FAILURE,
    FETCH_HSCODE_LIST_REQUEST,
    FETCH_HSCODE_LIST_SUCCESS,
    FETCH_HSCODE_LIST_FAILURE
  } from "../actions/actionTypes";
  
  const initialState = {
    loading: false,
    hscodeData: null,
    error: null,
  };
    
  const initialListState = {
    loading: false,
    error: null,
    codeList: [],
  };
  
  export const hscodeReducer = (state = initialState, action) => {
    switch (action.type) {
      case FETCH_HSCODE_REQUEST:
        return { ...state, loading: true, error: null };
      case FETCH_HSCODE_SUCCESS:
        return { ...state, loading: false, hscodeData: action.payload };
      case FETCH_HSCODE_FAILURE:
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
    case FETCH_HSCODE_LIST_FAILURE:
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};