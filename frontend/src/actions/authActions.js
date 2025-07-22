// Import jwtDecode as jwt_decode using alias

// Action Types
import {
    REGISTER_SUCCESS,
    REGISTER_FAIL,
    LOGIN_SUCCESS,
    LOGIN_FAIL,
    LOGOUT,
    AUTH_ERROR,
    TOKEN_REFRESH_SUCCESS,
    TOKEN_REFRESH_FAIL,
    FETCH_COSTUMER_LIST_REQUEST,
    FETCH_COSTUMER_LIST_SUCCESS,
    FETCH_COSTUMER_LIST_FAILURE,
} from './actionTypes';
import axiosInstance from '../utils/axiosInstance';

// Register User
export const register = ({ email, username, password }) => async dispatch => {
    try {
        const res = await axiosInstance.post('/accounts/register/', {
            email,
            username,
            password,
        });

        dispatch({
            type: REGISTER_SUCCESS,
            payload: res.data, // Adjust based on your backend response
        });

        // Optionally, redirect to login or perform additional actions
    } catch (err) {
        dispatch({
            type: REGISTER_FAIL,
            payload: err.response.data, // Adjust based on your backend error response
        });
    }
};

// Login User
export const login = ({ email, password }) => async dispatch => {
    try {
        const res = await axiosInstance.post('/accounts/login/', {
            email,
            password,
        });

        const { access_token, refresh_token, user } = res.data;

        // Decode the access token to get user info

        // Store tokens in localStorage
        localStorage.setItem('access_token', access_token);
        localStorage.setItem('refresh_token', refresh_token);
        localStorage.setItem('user', JSON.stringify(user)); // Save as a string
        dispatch({
            type: LOGIN_SUCCESS,
            payload: { user, access_token, refresh_token },
        });
    } catch (err) {
        dispatch({
            type: LOGIN_FAIL,
            payload: err.response.data, // Adjust based on your backend error response
        });
    }
};

// Logout User
export const logout = () => dispatch => {
    // Remove tokens from localStorage
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
    dispatch({
        type: LOGOUT,
    });
};

// Refresh Token
export const refreshToken = () => async dispatch => {
    const refresh_token = localStorage.getItem('refresh_token');

    if (!refresh_token) {
        dispatch({ type: AUTH_ERROR });
        return;
    }

    try {
        const res = await axiosInstance.post('/accounts/token/refresh/', {
            refresh: refresh_token,
        });

        const { access } = res.data;

        localStorage.setItem('access_token', access);


        dispatch({
            type: TOKEN_REFRESH_SUCCESS,
            payload: access,
        });
    } catch (err) {
        dispatch({
            type: TOKEN_REFRESH_FAIL,
            payload: err.response.data,
        });
    }
};

export const fetchCostumers = () => async (dispatch) => {
    dispatch({ type: FETCH_COSTUMER_LIST_REQUEST });
    try {
        const response = await axiosInstance.get('accounts/customer_list/');
        dispatch({
            type: FETCH_COSTUMER_LIST_SUCCESS,
            payload: response.data,
        });
    } catch (error) {
        dispatch({
            type: FETCH_COSTUMER_LIST_FAILURE,
            payload: error.response ? error.response.data.error : 'An error occurred.',
        });
    }
};
