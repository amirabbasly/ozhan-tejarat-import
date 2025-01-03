// src/store/store.js

import { configureStore } from '@reduxjs/toolkit';
import { combineReducers } from 'redux';
import { cottageReducer } from './reducers/cottageReducers';
import { cottageDetailsReducer, exportCottageReducer, exportedCottageDetailsReducer } from './reducers/cottageReducers'
import { performaReducer, orderReducer, regedOrderDetailsReducer} from './reducers/performaReducers';
import { customsDeclarationReducer, customsExportDeclarationReducer } from './reducers/customsDeclarationReducers';
import { loadCustomsParams, saveCustomsParams } from './utils/localSotrage/localstorage';
import { representationReducer, checkReducer } from './reducers/representationReducers';
import { dashboardReducer } from './reducers/dashboardReducers'
import { notificationsReducer } from './reducers/notificationsReducer';
import authReducer from './reducers/authReducers';
// Load initial parameters from localStorage
const persistedParams = loadCustomsParams();

// Combine reducers as usual
const rootReducer = combineReducers({
  auth: authReducer,
  order: orderReducer,
  orderDetails: regedOrderDetailsReducer,
  performa: performaReducer,
  cottages: cottageReducer,
  customsDeclarations: customsDeclarationReducer,
  customsExportDeclarations: customsExportDeclarationReducer,
  cottageDetails: cottageDetailsReducer,
  representations: representationReducer,
  checks: checkReducer,
  dashboard: dashboardReducer,
  notifications: notificationsReducer,
  exportCottages: exportCottageReducer,
  expotedCottageDetails: exportedCottageDetailsReducer,
});

// Configure the store with preloaded state
const store = configureStore({
  reducer: rootReducer,
  preloadedState: {
    customsDeclarations: {
      // ...other initial state properties
      ssdsshGUID: persistedParams.ssdsshGUID,
      urlVCodeInt: persistedParams.urlVCodeInt,
      // Ensure other properties from initialState in the reducer are included
      declarations: [],
      declarationDetails: null,
      goods: [],
      customsDutyInfo: {},
      loadingDeclarations: false,
      loadingDeclarationDetails: false,
      loadingGoods: false,
      loadingCustomsDuty: {},
      savingData: false,
      errorDeclarations: '',
      errorDeclarationDetails: '',
      errorGoods: '',
      errorCustomsDuty: {},
      saveError: '',
      saveMessage: '',
    },
    // ...other slices if any
  },
});

// Subscribe to store updates to persist parameters
store.subscribe(() => {
  const { ssdsshGUID, urlVCodeInt } = store.getState().customsDeclarations;
  
  saveCustomsParams({ ssdsshGUID, urlVCodeInt });
});

export default store;
