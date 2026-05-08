import axios from "axios";

const baseURL = import.meta.env.VITE_API_URL?.replace(/\/$/, "");

const API = axios.create({
  baseURL: `${baseURL}/api`,
  withCredentials: true,
});

// 🔐 Attach token
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("techlib-token");

  if (token && !config.url.includes("/auth/register")) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// ❌ Global error handling
API.interceptors.response.use(
  (res) => res,
  (err) => {
    console.error(
      "API ERROR:",
      err.response?.data || err.message
    );

    if (err.response?.status === 401) {
      localStorage.removeItem("techlib-token");
      localStorage.removeItem("techlib-user");
      window.location.href = "/login";
    }

    return Promise.reject(err);
  }
);

export default API;