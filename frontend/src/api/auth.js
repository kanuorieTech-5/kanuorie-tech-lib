import API from "./axios";

// Register
export const registerUser = async (
  formData
) => {
  const res =
    await API.post(
      "/api/auth/register",
      formData
    );

  return res.data;
};

// Login
export const loginUser = async (
  data
) => {
  const res =
    await API.post(
      "/api/auth/login",
      data
    );

  return res.data;
};