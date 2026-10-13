import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

/* ==========================================
   REQUEST INTERCEPTOR
========================================== */

API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("kanuorietech_token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    if (config.data instanceof FormData) {
      // Let Axios set the multipart boundary automatically.
      delete config.headers["Content-Type"];
      delete config.headers["content-type"];
    }

    return config;
  },
  (error) => Promise.reject(error),
);

/* ==========================================
   RESPONSE INTERCEPTOR
========================================== */

API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear expired or invalid authentication credentials.
      localStorage.removeItem("kanuorietech_token");
      localStorage.removeItem("kanuorietech_user");

      const pathname = window.location.pathname;

      const isLoginPage = pathname.startsWith("/login");
      const isPasswordResetPage = pathname.startsWith("/reset-password");

      // Keep password-reset errors on the reset form so the user
      // can see the error and request a new reset link if necessary.
      if (!isLoginPage && !isPasswordResetPage) {
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  },
);

export default API;