// import {
//   FETCH_REPRESENTATIONS_REQUEST,
//   FETCH_REPRESENTATIONS_SUCCESS,
//   FETCH_REPRESENTATIONS_FAILURE,
//   CREATE_REPRESENTATION_SUCCESS,
//   CREATE_REPRESENTATION_FAILURE,
//   UPDATE_REPRESENTATION_FAILURE,
//   UPDATE_REPRESENTATION_SUCCESS,
//   DELETE_REPRESENTATION_SUCCESS,
//   DELETE_REPRESENTATION_FAILURE,
//   FETCH_CHECKS_REQUEST,
//   FETCH_CHECKS_SUCCESS,
//   FETCH_CHECKS_FAILURE,
//   CREATE_CHECK_SUCCESS,
//   CREATE_CHECK_FAILURE,
//   UPDATE_CHECK_FAILURE,
//   UPDATE_CHECK_SUCCESS,
//   DELETE_CHECK_SUCCESS,
//   DELETE_CHECK_FAILURE,
// } from "../actions/actionTypes";

// const representationInitialState = {
//   representations: [],
//   loading: false,
//   error: null,
//   count: 0,
//   next: null,
//   previous: null,
// };
// const checkInitialState = {
//   checks: [],
//   loading: false,
//   error: null,
// };

// export const representationReducer = (
//   state = representationInitialState,
//   action
// ) => {
//   switch (action.type) {
//     case FETCH_REPRESENTATIONS_REQUEST:
//       return {
//         ...state,
//         loading: true,
//         error: null,
//       };

//     case FETCH_REPRESENTATIONS_SUCCESS:
//       // payload expected to be { results, count, next, previous }
//       return {
//         ...state,
//         loading: false,
//         representations: action.payload.results,
//         count: action.payload.count,
//         next: action.payload.next,
//         previous: action.payload.previous,
//       };

//     case FETCH_REPRESENTATIONS_FAILURE:
//       return {
//         ...state,
//         loading: false,
//         error: action.payload,
//       };

//     case CREATE_REPRESENTATION_SUCCESS:
//       return {
//         ...state,
//         representations: [...state.representations, action.payload],
//       };

//     case CREATE_REPRESENTATION_FAILURE:
//       return {
//         ...state,
//         error: action.payload,
//       };

//     case UPDATE_REPRESENTATION_SUCCESS:
//       return {
//         ...state,
//         representations: state.representations.map((rep) =>
//           rep.id === action.payload.id ? action.payload : rep
//         ),
//       };

//     case UPDATE_REPRESENTATION_FAILURE:
//       return {
//         ...state,
//         error: action.payload,
//       };

//     case DELETE_REPRESENTATION_SUCCESS:
//       return {
//         ...state,
//         representations: state.representations.filter(
//           (rep) => rep.id !== action.payload
//         ),
//       };

//     case DELETE_REPRESENTATION_FAILURE:
//       return {
//         ...state,
//         error: action.payload,
//       };

//     default:
//       return state;
//   }
// };

// export const checkReducer = (state = checkInitialState, action) => {
//   switch (action.type) {
//     case FETCH_CHECKS_REQUEST:
//       return { ...state, loading: true, error: null };
//     case FETCH_CHECKS_SUCCESS:
//       return { ...state, loading: false, checks: action.payload };
//     case FETCH_CHECKS_FAILURE:
//       return { ...state, loading: false, error: action.payload };
//     case CREATE_CHECK_SUCCESS:
//       return { ...state, checks: [...state.representations, action.payload] };
//     case CREATE_CHECK_FAILURE:
//       return { ...state, error: action.payload };
//     case UPDATE_CHECK_SUCCESS:
//       return {
//         ...state,
//         checks: state.checks.map((rep) =>
//           rep.id === action.payload.id ? action.payload : rep
//         ),
//       };
//     case UPDATE_CHECK_FAILURE:
//       return { ...state, error: action.payload };
//     case DELETE_CHECK_SUCCESS:
//       return {
//         ...state,
//         checks: state.checks.filter((rep) => rep.id !== action.payload),
//       };
//     case DELETE_CHECK_FAILURE:
//       return { ...state, error: action.payload };
//     default:
//       return state;
//   }
// };





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
  FETCH_CHECKS_REQUEST,
  FETCH_CHECKS_SUCCESS,
  FETCH_CHECKS_FAILURE,
  CREATE_CHECK_SUCCESS,
  CREATE_CHECK_FAILURE,
  UPDATE_CHECK_FAILURE,
  UPDATE_CHECK_SUCCESS,
  DELETE_CHECK_SUCCESS,
  DELETE_CHECK_FAILURE,
} from "../actions/actionTypes";

const representationInitialState = {
  representations: [],
  loading: false,
  error: null,
  count: 0,
  next: null,
  previous: null,
};

const checkInitialState = {
  checks: [],
  loading: false,
  error: null,
  count: 0,
  next: null,
  previous: null,
};

export const representationReducer = (
  state = representationInitialState,
  action
) => {
  switch (action.type) {
    case FETCH_REPRESENTATIONS_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };

    case FETCH_REPRESENTATIONS_SUCCESS:
      // payload expected to be { results, count, next, previous }
      return {
        ...state,
        loading: false,
        representations: action.payload.results,
        count: action.payload.count,
        next: action.payload.next,
        previous: action.payload.previous,
      };

    case FETCH_REPRESENTATIONS_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    case CREATE_REPRESENTATION_SUCCESS:
      return {
        ...state,
        representations: [...state.representations, action.payload],
      };

    case CREATE_REPRESENTATION_FAILURE:
      return {
        ...state,
        error: action.payload,
      };

    case UPDATE_REPRESENTATION_SUCCESS:
      return {
        ...state,
        representations: state.representations.map((rep) =>
          rep.id === action.payload.id ? action.payload : rep
        ),
      };

    case UPDATE_REPRESENTATION_FAILURE:
      return {
        ...state,
        error: action.payload,
      };

    case DELETE_REPRESENTATION_SUCCESS:
      return {
        ...state,
        representations: state.representations.filter(
          (rep) => rep.id !== action.payload
        ),
      };

    case DELETE_REPRESENTATION_FAILURE:
      return {
        ...state,
        error: action.payload,
      };

    default:
      return state;
  }
};

export const checkReducer = (state = checkInitialState, action) => {
  switch (action.type) {
    case FETCH_CHECKS_REQUEST:
      return { ...state, loading: true, error: null };
    case FETCH_CHECKS_SUCCESS:
      return {
        ...state,
        loading: false,
        checks: action.payload.checks || [], // Ensure checks is an array
        count: action.payload.count || 0,
        next: action.payload.next || null,
        previous: action.payload.previous || null,
      };
    case FETCH_CHECKS_FAILURE:
      return { ...state, loading: false, error: action.payload };
    case CREATE_CHECK_SUCCESS:
      return { ...state, checks: [...state.checks, action.payload] }; // Fixed: Use state.checks, not state.representations
    case CREATE_CHECK_FAILURE:
      return { ...state, error: action.payload };
    case UPDATE_CHECK_SUCCESS:
      return {
        ...state,
        checks: state.checks.map((rep) =>
          rep.id === action.payload.id ? action.payload : rep
        ),
      };
    case UPDATE_CHECK_FAILURE:
      return { ...state, error: action.payload };
    case DELETE_CHECK_SUCCESS:
      return {
        ...state,
        checks: state.checks.filter((rep) => rep.id !== action.payload),
      };
    case DELETE_CHECK_FAILURE:
      return { ...state, error: action.payload };
    default:
      return state;
  }
};