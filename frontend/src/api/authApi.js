import API from "./axiosApi";

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

export const updateProfile = async (
  profileData
) => {
  const { data } = await API.put(
    "/auth/profile",
    profileData
  );

  return data;
};

export const updateSettings = async (
  settings
) => {
  const { data } = await API.put(
    "/auth/profile",
    { settings }
  );

  return data;
};

export const changePassword = async (
  passwords
) => {
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
  updateProfile,
  updateSettings,
  changePassword,
};