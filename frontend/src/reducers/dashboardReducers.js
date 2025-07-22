import {
    FETCH_PRF_DASHBOARD_REQUEST,
    FETCH_PRF_DASHBOARD_SUCCESS,
    FETCH_PRF_DASHBOARD_FAILURE,
    FETCH_COT_DASHBOARD_REQUEST,
    FETCH_COT_DASHBOARD_SUCCESS,
    FETCH_COT_DASHBOARD_FAILURE,
} from '../actions/actionTypes';

const initialState = {
    loading: false,
    prf_summary: [],
    cot_summary:[],
    error: '',
    message: '',
  };

export const dashboardReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_PRF_DASHBOARD_REQUEST:
      return {
        ...state,
        loading: true,
        error: '',
        message: '',
      };
    case FETCH_PRF_DASHBOARD_SUCCESS:
      return {
        ...state,
        loading: false,
        prf_summary: action.payload,
        error: '',
      };
    case FETCH_PRF_DASHBOARD_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
      case FETCH_COT_DASHBOARD_REQUEST:
        return {
          ...state,
          loading: true,
          error: '',
          message: '',
        };
      case FETCH_COT_DASHBOARD_SUCCESS:
        return {
          ...state,
          loading: false,
          cot_summary: action.payload,
          error: '',
        };
      case FETCH_COT_DASHBOARD_FAILURE:
        return {
          ...state,
          loading: false,
          error: action.payload,
        };

    default:
      return state;
  }
};