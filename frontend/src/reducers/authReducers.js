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

// Helper function to save tokens to localStorage
const saveTokensToLocalStorage = (access_token, refresh_token) => {
    localStorage.setItem('access_token', access_token);
    localStorage.setItem('refresh_token', refresh_token);
};

// Helper function to clear tokens from localStorage
const clearTokensFromLocalStorage = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
};

const initialState = {
    token: localStorage.getItem('access_token'),
    refresh_token: localStorage.getItem('refresh_token'),
    isAuthenticated: !!localStorage.getItem('access_token'), // True if token exists
    loading: false,
    user: localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null, // Parse user JSON
    error: null,
};

const authReducer = (state = initialState, action) => {
    const { type, payload } = action;

    switch (type) {
        case REGISTER_SUCCESS:
            return {    
                ...state,
                isAuthenticated: false, // User needs to log in after registration
                loading: false,
            };
        case REGISTER_FAIL:
            return {
                ...state,
                error: payload,
                loading: false,
            };
        case LOGIN_SUCCESS:
            saveTokensToLocalStorage(payload.access_token, payload.refresh_token);
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
            clearTokensFromLocalStorage();
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
            clearTokensFromLocalStorage();
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
            saveTokensToLocalStorage(payload, state.refresh_token);
            return {
                ...state,
                token: payload,
                isAuthenticated: true,
                loading: false,
            };
        case TOKEN_REFRESH_FAIL:
            clearTokensFromLocalStorage();
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
            clearTokensFromLocalStorage();
            return {
                ...state,
                token: null,
                refresh_token: null,
                isAuthenticated: false,
                loading: false,
                user: null,
                error: payload || null,
            };
        default:
            return state;
    }
};

export default authReducer;
