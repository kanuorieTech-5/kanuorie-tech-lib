import API from "./axiosApi";

/* ==========================================
   USER PROFILE
========================================== */

export const getProfile = async () => {
  const { data } = await API.get("/users/profile");
  return data;
};

export const updateProfile = async (profileData) => {
  const { data } = await API.put("/users/profile", profileData);

  return data;
};

/* ==========================================
   AVATAR
========================================== */

export const uploadAvatar = async (formData) => {
  const { data } = await API.put("/users/avatar", formData);

  return data;
};

export const deleteAvatar = async () => {
  const { data } = await API.delete("/users/avatar");

  return data;
};

/* ==========================================
   ACCOUNT
========================================== */

export const changePassword = async (passwordData) => {
  const { data } = await API.put("/users/change-password", passwordData);

  return data;
};

/* ==========================================
   ACCOUNT DELETION
========================================== */

export const deleteAccount = async () => {
  const { data } = await API.delete("/users/profile");

  return data;
};

/* ==========================================
   SETTINGS
========================================== */

export const getSettings = async () => {
  const { data } = await API.get("/users/settings");

  return data;
};

export const updateSettings = async (settings) => {
  const { data } = await API.put("/users/settings", settings);

  return data;
};
