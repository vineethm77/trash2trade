import axios from "axios";

const BASE_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000";

const API = axios.create({
  baseURL: `${BASE_URL}/api`,
});

// 🔥 Attach token automatically for every request
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default API;
