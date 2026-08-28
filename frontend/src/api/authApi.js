import API from "./axiosApi";

/* ==========================================
   AUTHENTICATION
========================================== */

export const registerUser = async (userData) => {
  const { data } = await API.post(
    "/auth/register",
    userData
  );

  return data;
};

export const loginUser = async (credentials) => {
  const { data } = await API.post(
    "/auth/login",
    credentials
  );

  return data;
};

export const getCurrentUser = async () => {
  const { data } = await API.get(
    "/auth/me"
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
  getCurrentUser,
  changePassword,
};