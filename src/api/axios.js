import axios from "axios";

// Create instance
const api = axios.create({
  baseURL: "https://shopneo-backend.onrender.com/api/v1/",
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
