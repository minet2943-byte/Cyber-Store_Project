
import axios from "axios";

// Create base Axios instance
const api = axios.create({
  baseURL:
    import.meta.env.VITE_API_URL ||
    import.meta.env.VITE_API_BASE_URL ||
    "http://localhost:8080/api",

  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },

  timeout: 10000,
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token =
      localStorage.getItem("token") ||
      localStorage.getItem("jwt") ||
      localStorage.getItem("auth_token") ||
      localStorage.getItem("accessToken") ||
      localStorage.getItem("access_token");

    console.log("======================================");
    console.log("REQUEST METHOD :", config.method?.toUpperCase());
    console.log("REQUEST URI    :", config.url);
    console.log("TOKEN EXISTS   :", !!token);

    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;

      console.log("AUTH HEADER    : true");
    } else {
      console.log("AUTH HEADER    : false");
      console.log("NO JWT TOKEN");
    }

    console.log("======================================");

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,

  (error) => {
    const message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      "An unexpected error occurred with the API request.";

    return Promise.reject(new Error(message));
  }
);

export default api;
export { api };
