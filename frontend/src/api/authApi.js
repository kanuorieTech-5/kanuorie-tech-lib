import API from "./axiosApi";

/* ==========================================
   AUTHENTICATION
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
  const { data } = await API.post("/auth/refresh-token");
  return data;
};

export const getCurrentUser = async () => {
  const { data } = await API.get("/auth/me");
  return data;
};

export const verifyEmail = async (verificationData) => {
  const { data } = await API.post("/auth/verify-email", verificationData);
  return data;
};

export const resendVerificationEmail = async (emailData) => {
  const { data } = await API.post("/auth/resend-verification", emailData);
  return data;
};

export const forgotPassword = async (emailData) => {
  const { data } = await API.post("/auth/forgot-password", emailData);
  return data;
};

export const resetPassword = async (passwordData) => {
  const { data } = await API.post("/auth/reset-password", passwordData);
  return data;
};

export const changePassword = async (passwords) => {
  const { data } = await API.put("/auth/change-password", passwords);
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