import axiosInstance from "../utils/axiosInstance";
import {
  FETCH_REPRESENTATIONS_REQUEST,
  FETCH_REPRESENTATIONS_SUCCESS,
  FETCH_REPRESENTATIONS_FAILURE,
  CREATE_REPRESENTATION_SUCCESS,
  CREATE_REPRESENTATION_FAILURE,
  UPDATE_REPRESENTATION_SUCCESS,
  UPDATE_REPRESENTATION_FAILURE,
  DELETE_REPRESENTATION_SUCCESS,
  DELETE_REPRESENTATION_FAILURE,
  FETCH_CHECKS_REQUEST,
  FETCH_CHECKS_SUCCESS,
  FETCH_CHECKS_FAILURE,
  CREATE_CHECK_SUCCESS,
  CREATE_CHECK_FAILURE,
  UPDATE_CHECK_SUCCESS,
  UPDATE_CHECK_FAILURE,
  DELETE_CHECK_SUCCESS,
  DELETE_CHECK_FAILURE,
  IMPORT_REPRESENTATION_REQUEST,
  IMPORT_REPRESENTATION_SUCCESS,
  IMPORT_REPRESENTATION_FAILURE,
} from "./actionTypes";

// Fetch all representations
// before: fetchRepresentations had no params
export const fetchRepresentations =
  ({ page = 1, pageSize = 50, search = "" }) =>
  async (dispatch) => {
    dispatch({ type: FETCH_REPRESENTATIONS_REQUEST });
    try {
      const params = { page, page_size: pageSize };
      if (search) params.search = search;
      const { data } = await axiosInstance.get("/representations/", { params });
      dispatch({
        type: FETCH_REPRESENTATIONS_SUCCESS,
        payload: {
          results: data.results,
          count: data.count,
          next: data.next,
          previous: data.previous,
        },
      });
    } catch (error) {
      dispatch({
        type: FETCH_REPRESENTATIONS_FAILURE,
        payload: error.response?.data || "Error fetching representations",
      });
    }
  };

// Create a new representation
export const createRepresentation =
  (representationData) => async (dispatch) => {
    try {
      const response = await axiosInstance.post(
        "/representations/",
        representationData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      dispatch({ type: CREATE_REPRESENTATION_SUCCESS, payload: response.data });
      return response.data; // <--- Return data on success
    } catch (error) {
      dispatch({
        type: CREATE_REPRESENTATION_FAILURE,
        payload: error.response?.data || "Error creating representation",
      });
      throw error; // <--- Rethrow so .catch runs in the component
    }
  };

// Update a representation
export const updateRepresentation =
  (id, representationData) => async (dispatch) => {
    try {
      const response = await axiosInstance.put(
        `/representations/${id}/`,
        representationData,
        {
          headers: {
            "Content-Type": "multipart/form-data", // Ensure correct encoding for file uploads
          },
        }
      );
      dispatch({ type: UPDATE_REPRESENTATION_SUCCESS, payload: response.data });
    } catch (error) {
      dispatch({
        type: UPDATE_REPRESENTATION_FAILURE,
        payload: error.response?.data || "Error updating representation",
      });
    }
  };

// Delete a representation
export const deleteRepresentation = (id) => async (dispatch) => {
  try {
    await axiosInstance.delete(`/representations/${id}/`);
    dispatch({ type: DELETE_REPRESENTATION_SUCCESS, payload: id });
  } catch (error) {
    dispatch({
      type: DELETE_REPRESENTATION_FAILURE,
      payload: error.response?.data || "Error deleting representation",
    });
  }
};
export const fetchChecks = () => async (dispatch) => {
  dispatch({ type: FETCH_CHECKS_REQUEST });
  try {
    const response = await axiosInstance.get("/checks/");
    dispatch({ type: FETCH_CHECKS_SUCCESS, payload: response.data.results });
  } catch (error) {
    dispatch({
      type: FETCH_CHECKS_FAILURE,
      payload: error.response?.data || "Error fetching representations",
    });
  }
};
// Create a new representation
export const createCheck = (representationData) => async (dispatch) => {
  try {
    const response = await axiosInstance.post("/checks/", representationData, {
      headers: {
        "Content-Type": "multipart/form-data", // Ensure correct encoding for file uploads
      },
    });
    dispatch({ type: CREATE_CHECK_SUCCESS, payload: response.data });
  } catch (error) {
    dispatch({
      type: CREATE_CHECK_FAILURE,
      payload: error.response?.data || "Error creating representation",
    });
  }
};

// Update a representation
export const updateCheck = (id, representationData) => async (dispatch) => {
  try {
    const response = await axiosInstance.put(
      `/checks/${id}/`,
      representationData,
      {
        headers: {
          "Content-Type": "multipart/form-data", // Ensure correct encoding for file uploads
        },
      }
    );
    dispatch({ type: UPDATE_CHECK_SUCCESS, payload: response.data });
  } catch (error) {
    dispatch({
      type: UPDATE_CHECK_FAILURE,
      payload: error.response?.data || "Error updating representation",
    });
  }
};

// Delete a representation
export const deleteCheck = (id) => async (dispatch) => {
  try {
    await axiosInstance.delete(`/checks/${id}/`);
    dispatch({ type: DELETE_CHECK_SUCCESS, payload: id });
  } catch (error) {
    dispatch({
      type: DELETE_CHECK_FAILURE,
      payload: error.response?.data || "Error deleting representation",
    });
  }
};
