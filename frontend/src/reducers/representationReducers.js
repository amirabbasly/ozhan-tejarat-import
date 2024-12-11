import {
    FETCH_REPRESENTATIONS_REQUEST,
    FETCH_REPRESENTATIONS_SUCCESS,
    FETCH_REPRESENTATIONS_FAILURE,
    CREATE_REPRESENTATION_SUCCESS,
    CREATE_REPRESENTATION_FAILURE,
    UPDATE_REPRESENTATION_FAILURE,
    UPDATE_REPRESENTATION_SUCCESS,
    DELETE_REPRESENTATION_SUCCESS,
    DELETE_REPRESENTATION_FAILURE,
} from '../actions/actionTypes';

const initialState = {
    representations: [],
    loading: false,
    error: null,
};

export const representationReducer = (state = initialState, action) => {
    switch (action.type) {
        case FETCH_REPRESENTATIONS_REQUEST:
            return { ...state, loading: true, error: null };
        case FETCH_REPRESENTATIONS_SUCCESS:
            return { ...state, loading: false, representations: action.payload };
        case FETCH_REPRESENTATIONS_FAILURE:
            return { ...state, loading: false, error: action.payload };
        case CREATE_REPRESENTATION_SUCCESS:
            return { ...state, representations: [...state.representations, action.payload] };
        case CREATE_REPRESENTATION_FAILURE:
            return { ...state, error: action.payload };
        case UPDATE_REPRESENTATION_SUCCESS:
            return {
                ...state,
                representations: state.representations.map((rep) =>
                    rep.id === action.payload.id ? action.payload : rep
                ),
            };
        case UPDATE_REPRESENTATION_FAILURE:
            return { ...state, error: action.payload };
        case DELETE_REPRESENTATION_SUCCESS:
            return {
                ...state,
                representations: state.representations.filter((rep) => rep.id !== action.payload),
            };
        case DELETE_REPRESENTATION_FAILURE:
            return { ...state, error: action.payload };
        default:
            return state;
    }
};
