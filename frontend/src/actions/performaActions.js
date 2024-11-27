// src/actions/performaActions.js

import axiosInstance from '../utils/axiosInstance';
import {
    FETCH_PERFORMAS_REQUEST,
    FETCH_PERFORMAS_SUCCESS,
    FETCH_PERFORMAS_FAILURE,
    SAVE_SELECTED_PERFORMAS_REQUEST,
    SAVE_SELECTED_PERFORMAS_SUCCESS,
    SAVE_SELECTED_PERFORMAS_FAILURE,
} from './actionTypes';

export const fetchPerformas = (formData) => async (dispatch) => {
    dispatch({ type: FETCH_PERFORMAS_REQUEST });
    try {
        const response = await axiosInstance.post('guid/', formData);
        dispatch({
            type: FETCH_PERFORMAS_SUCCESS,
            payload: response.data.performas,
        });
    } catch (error) {
        dispatch({
            type: FETCH_PERFORMAS_FAILURE,
            payload: error.response ? error.response.data.error : 'An error occurred.',
        });
    }
};

export const saveSelectedPerformas = (selectedPerformas, ssdsshGUID, urlVCodeInt) => async (dispatch) => {
    dispatch({ type: SAVE_SELECTED_PERFORMAS_REQUEST });
    try {
        const response = await axiosInstance.post('save-selected-performas/', {
            selected_performas: selectedPerformas,
            ssdsshGUID,
            urlVCodeInt,
        });
        dispatch({
            type: SAVE_SELECTED_PERFORMAS_SUCCESS,
            payload: response.data.message,
        });
    } catch (error) {
        dispatch({
            type: SAVE_SELECTED_PERFORMAS_FAILURE,
            payload: error.response ? error.response.data.error : 'An error occurred.',
        });
    }
};
