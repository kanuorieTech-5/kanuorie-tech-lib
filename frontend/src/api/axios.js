import axios from "axios";

const API = axios.create({
  baseURL:
    import.meta.env.VITE_API_URL ||
    "http://localhost:5000",

  withCredentials: true,
  timeout: 10000,
});

// Attach token
API.interceptors.request.use((config) => {
  const token =
    localStorage.getItem("techlib-token");

  if (
    token &&
    !config.url?.includes("/auth/register")
  ) {
    config.headers.Authorization =
      `Bearer ${token}`;
  }

  return config;
});

// Error handlingn
API.interceptors.response.use(
  (res) => res,

  (err) => {
    console.error(
      "API ERROR:",
      err.response?.data ||
      err.message
    );

    return Promise.reject(err);
  }
);

export default API;