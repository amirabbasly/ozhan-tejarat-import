// src/redux/auth/authReducer.js

import {
    REGISTER_SUCCESS,
    REGISTER_FAIL,
    LOGIN_SUCCESS,
    LOGIN_FAIL,
    LOGOUT,
    AUTH_ERROR,
    TOKEN_REFRESH_SUCCESS,
    TOKEN_REFRESH_FAIL,
} from '../actions/actionTypes';

const initialState = {
    token: localStorage.getItem('access_token'),
    refresh_token: localStorage.getItem('refresh_token'),
    isAuthenticated: false,
    loading: true,
    user: null,
    error: null,
    

};

const authReducer = (state = initialState, action) => {
    const { type, payload } = action;

    switch (type) {
        case REGISTER_SUCCESS:
            return {
                ...state,
                isAuthenticated: false,
                loading: false,
                // Optionally, handle registration success
            };
        case REGISTER_FAIL:
            return {
                ...state,
                error: payload,
                loading: false,
            };
        case LOGIN_SUCCESS:
            return {
                ...state,
                token: payload.access_token,
                refresh_token: payload.refresh_token,
                isAuthenticated: true,
                loading: false,
                user: payload.user,
                error: null,
            };
        case LOGIN_FAIL:
            return {
                ...state,
                token: null,
                refresh_token: null,
                isAuthenticated: false,
                loading: false,
                user: null,
                error: payload,
            };
        case LOGOUT:
            return {
                ...initialState,
                token: null,
                refresh_token: null,
                isAuthenticated: false,
                loading: false,
                user: null,
                error: null,
            };
        case TOKEN_REFRESH_SUCCESS:
            return {
                ...state,
                token: payload,
                isAuthenticated: true,
                loading: false,
            };
        case TOKEN_REFRESH_FAIL:
            return {
                ...state,
                token: null,
                refresh_token: null,
                isAuthenticated: false,
                loading: false,
                user: null,
                error: payload,
            };
        case AUTH_ERROR:
            return {
                ...state,
                token: null,
                refresh_token: null,
                isAuthenticated: false,
                loading: false,
                user: null,
                error: null,
            };
        default:
            return state;
    }
};

export default authReducer;
