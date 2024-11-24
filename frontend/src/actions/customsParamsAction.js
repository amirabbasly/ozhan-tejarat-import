// src/actions/customsParamsActions.js

import { SET_CUSTOMS_PARAMS, CLEAR_CUSTOMS_PARAMS } from './actionTypes';

// Action to set ssdsshGUID and urlVCodeInt
export const setCustomsParams = (ssdsshGUID, urlVCodeInt) => ({
  type: SET_CUSTOMS_PARAMS,
  payload: { ssdsshGUID, urlVCodeInt },
});

// Action to clear ssdsshGUID and urlVCodeInt
export const clearCustomsParams = () => ({
  type: CLEAR_CUSTOMS_PARAMS,
});
