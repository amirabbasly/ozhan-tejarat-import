import axios from "axios";
const baseURL =
  process.env.REACT_APP_API_BASE_URL || "http://192.168.8.36:8000/api/"; // از .env می‌خوانیم

const axiosInstance = axios.create({
  baseURL,
  headers: { "Content-Type": "application/json" },
});

// Flag to prevent multiple simultaneous token refresh requests
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// Interceptor for handling responses
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Handle unauthorized error
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      if (isRefreshing) {
        // If a token refresh is already in progress, queue the request
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers["Authorization"] = `Bearer ${token}`;
            return axiosInstance(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      isRefreshing = true;

      try {
        // Refresh the access token
        const refreshResponse = await axios.post(
          "http://192.168.8.36:8000/api/accounts/token/refresh/",
          {
            refresh: localStorage.getItem("refresh_token"),
          }
        );

        const newAccessToken = refreshResponse.data.access;
        localStorage.setItem("access_token", newAccessToken);

        // Update all queued requests with the new token
        processQueue(null, newAccessToken);

        // Update the original request with the new token
        originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;

        return axiosInstance(originalRequest);
      } catch (refreshError) {
        console.error("Token refresh failed:", refreshError);

        // Clear failed queue and handle logout if needed
        processQueue(refreshError, null);
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        window.location.href = "/login"; // Redirect to login if needed

        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

// Interceptor for setting Authorization header on all requests
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosInstance;
