import API from "./axiosApi";

/* ==========================================
   AUTH
========================================== */

export const registerUser = async (userData) => {
  const { data } = await API.post("/auth/register", userData);
  return data;
};

export const loginUser = async (credentials) => {
  const { data } = await API.post("/auth/login", credentials);
  return data;
};

export const logoutUser = async () => {
  const { data } = await API.post("/auth/logout");
  return data;
};

export const refreshToken = async () => {
  const { data } = await API.get("/auth/refresh");
  return data;
};

/* ==========================================
   CURRENT USER
========================================== */

export const getCurrentUser = async () => {
  const { data } = await API.get("/auth/me");
  return data;
};

/* ==========================================
   EMAIL VERIFICATION
========================================== */

export const verifyEmail = async (token) => {
  const { data } = await API.get(`/auth/verify-email/${token}`);
  return data;
};

export const resendVerificationEmail = async () => {
  const { data } = await API.post("/auth/resend-verification");
  return data;
};

/* ==========================================
   PASSWORD
========================================== */

export const forgotPassword = async (email) => {
  const { data } = await API.post("/auth/forgot-password", {
    email,
  });

  return data;
};

export const resetPassword = async (token, password) => {
  const { data } = await API.put(
    `/auth/reset-password/${token}`,
    {
      password,
    }
  );

  return data;
};

export const changePassword = async (passwords) => {
  const { data } = await API.put(
    "/auth/change-password",
    passwords
  );

  return data;
};

export default {
  registerUser,
  loginUser,
  logoutUser,
  refreshToken,
  getCurrentUser,
  verifyEmail,
  resendVerificationEmail,
  forgotPassword,
  resetPassword,
  changePassword,
};