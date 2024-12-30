// src/reducers/customsDeclarationReducers.js

import {
  FETCH_DECLARATIONS_REQUEST,
  FETCH_DECLARATIONS_SUCCESS,
  FETCH_DECLARATIONS_FAILURE,
  FETCH_DECLARATION_DETAILS_REQUEST,
  FETCH_DECLARATION_DETAILS_SUCCESS,
  FETCH_DECLARATION_DETAILS_FAILURE,
  FETCH_GOODS_REQUEST,
  FETCH_GOODS_SUCCESS,
  FETCH_GOODS_FAILURE,
  FETCH_CUSTOMS_DUTY_REQUEST,
  FETCH_CUSTOMS_DUTY_SUCCESS,
  FETCH_CUSTOMS_DUTY_FAILURE,
  SAVE_DATA_REQUEST,
  SAVE_DATA_SUCCESS,
  SAVE_DATA_FAILURE,
  SAVE_MULTIPLE_DECLARATIONS_REQUEST,
  SAVE_MULTIPLE_DECLARATIONS_SUCCESS,
  SAVE_MULTIPLE_DECLARATIONS_FAILURE,
  SAVE_MULTIPLE_DECLARATIONS_PROGRESS,
  SET_CUSTOMS_PARAMS,
  CLEAR_CUSTOMS_PARAMS,
  FETCH_EXPORT_DECLARATIONS_REQUEST,
  FETCH_EXPORT_DECLARATIONS_SUCCESS,
  FETCH_EXPORT_DECLARATIONS_FAILURE,
} from '../actions/actionTypes';

const initialState = {
  declarations: [],
  declarationDetails: null,
  goods: [],
  customsDutyInfo: {}, // { ggsVcodeInt: dutyInfo }
  loadingDeclarations: false,
  loadingDeclarationDetails: false,
  loadingGoods: false,
  loadingCustomsDuty: {}, // { ggsVcodeInt: boolean }
  savingData: false,
  errorDeclarations: '',
  errorDeclarationDetails: '',
  errorGoods: '',
  errorCustomsDuty: {}, // { ggsVcodeInt: error }
  saveError: '',
  saveMessage: '',
  ssdsshGUID: '',
  urlVCodeInt: '',
  savingMultipleDeclarations: false,
  saveMultipleDeclarationsProgress: { current: 0, total: 0 },
  saveMultipleDeclarationsMessage: '',
  saveMultipleDeclarationsError: '',
  failedDeclarations: []
};
const initialStateExport = {
  declarations: [],
  declarationDetails: null,
  goods: [],
  customsDutyInfo: {}, // { ggsVcodeInt: dutyInfo }
  loading: false,
  saveMessage: '',
  ssdsshGUID: '',
  urlVCodeInt: '',
};

export const customsDeclarationReducer = (state = initialState, action) => {
  switch (action.type) {
    // Fetch Declarations
    case FETCH_DECLARATIONS_REQUEST:
      return {
        ...state,
        loadingDeclarations: true,
        errorDeclarations: '',
        declarations: [],
      };
    case FETCH_DECLARATIONS_SUCCESS:
      return {
        ...state,
        loadingDeclarations: false,
        declarations: action.payload,
        errorDeclarations: '',
      };
    case FETCH_DECLARATIONS_FAILURE:
      return {
        ...state,
        loadingDeclarations: false,
        declarations: [],
        errorDeclarations: action.payload,
      };

    // Fetch Declaration Details
    case FETCH_DECLARATION_DETAILS_REQUEST:
      return {
        ...state,
        loadingDeclarationDetails: true,
        errorDeclarationDetails: '',
        declarationDetails: null,
      };
    case FETCH_DECLARATION_DETAILS_SUCCESS:
      return {
        ...state,
        loadingDeclarationDetails: false,
        declarationDetails: action.payload,
        errorDeclarationDetails: '',
      };
    case FETCH_DECLARATION_DETAILS_FAILURE:
      return {
        ...state,
        loadingDeclarationDetails: false,
        declarationDetails: null,
        errorDeclarationDetails: action.payload,
      };

    // Fetch Goods
    case FETCH_GOODS_REQUEST:
      return {
        ...state,
        loadingGoods: true,
        errorGoods: '',
        goods: [],
      };
    case FETCH_GOODS_SUCCESS:
      return {
        ...state,
        loadingGoods: false,
        goods: action.payload,
        errorGoods: '',
      };
    case FETCH_GOODS_FAILURE:
      return {
        ...state,
        loadingGoods: false,
        goods: [],
        errorGoods: action.payload,
      };

    // Fetch Customs Duty Information
    case FETCH_CUSTOMS_DUTY_REQUEST:
      return {
        ...state,
        loadingCustomsDuty: {
          ...state.loadingCustomsDuty,
          [action.payload]: true,
        },
        errorCustomsDuty: {
          ...state.errorCustomsDuty,
          [action.payload]: '',
        },
      };
    case FETCH_CUSTOMS_DUTY_SUCCESS:
      return {
        ...state,
        loadingCustomsDuty: {
          ...state.loadingCustomsDuty,
          [action.payload.ggsVcodeInt]: false,
        },
        customsDutyInfo: {
          ...state.customsDutyInfo,
          [action.payload.ggsVcodeInt]: action.payload.dutyInfo,
        },
        errorCustomsDuty: {
          ...state.errorCustomsDuty,
          [action.payload.ggsVcodeInt]: '',
        },
      };
    case FETCH_CUSTOMS_DUTY_FAILURE:
      return {
        ...state,
        loadingCustomsDuty: {
          ...state.loadingCustomsDuty,
          [action.payload.ggsVcodeInt]: false,
        },
        errorCustomsDuty: {
          ...state.errorCustomsDuty,
          [action.payload.ggsVcodeInt]: action.payload.error,
        },
      };

    // Save Data
    case SAVE_DATA_REQUEST:
      return {
        ...state,
        savingData: true,
        saveError: '',
        saveMessage: '',
      };
    case SAVE_DATA_SUCCESS:
      return {
        ...state,
        savingData: false,
        saveError: '',
        saveMessage: action.payload,
      };
    case SAVE_DATA_FAILURE:
      return {
        ...state,
        savingData: false,
        saveError: action.payload,
        saveMessage: '',
      };
      case SET_CUSTOMS_PARAMS:
        return {
          ...state,
          ssdsshGUID: action.payload.ssdsshGUID,
          urlVCodeInt: action.payload.urlVCodeInt,
        };
  
      // Clear Customs Parameters
      case CLEAR_CUSTOMS_PARAMS:
        return {
          ...state,
          ssdsshGUID: '',
          urlVCodeInt: '',
        };
           // Save Multiple Declarations
    case SAVE_MULTIPLE_DECLARATIONS_REQUEST:
      return {
        ...state,
        savingMultipleDeclarations: true,
        saveMultipleDeclarationsProgress: { current: 0, total: action.payload?.total || 0 }, // Set total dynamically
        saveMultipleDeclarationsError: '',
        saveMultipleDeclarationsMessage: '',
      };
      case SAVE_MULTIPLE_DECLARATIONS_SUCCESS:
        return {
            ...state,
            savingMultipleDeclarations: false,
            saveMultipleDeclarationsMessage: action.payload.message,
            failedDeclarations: action.payload.failedDeclarations || [],
        };
    
    case SAVE_MULTIPLE_DECLARATIONS_FAILURE:
        return {
            ...state,
            savingMultipleDeclarations: false,
            saveMultipleDeclarationsError: action.payload.error || '',
            failedDeclarations: [
                ...state.failedDeclarations,
                ...(action.payload.failedDeclarations || []),
            ],
        };
    
      
    case SAVE_MULTIPLE_DECLARATIONS_PROGRESS:
        return {
          ...state,
          saveMultipleDeclarationsProgress: {
            current: action.payload.current || 0,
            total: action.payload.total || 1, // Avoid division by zero
          },
        };
      

    default:
      return state;
  }
};

export const customsExportDeclarationReducer = (state = initialStateExport, action) => {
  switch (action.type) {
    // Fetch Declarations
    case FETCH_DECLARATIONS_REQUEST:
      return {
        ...state,
        loadingDeclarations: true,
        errorDeclarations: '',
        declarations: [],
      };
    case FETCH_DECLARATIONS_SUCCESS:
      return {
        ...state,
        loadingDeclarations: false,
        declarations: action.payload,
        errorDeclarations: '',
      };
    case FETCH_DECLARATIONS_FAILURE:
      return {
        ...state,
        loadingDeclarations: false,
        declarations: [],
        errorDeclarations: action.payload,
      };

    default:
      return state;
  }
};
