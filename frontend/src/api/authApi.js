import API from "./axiosApi";

/*
|--------------------------------------------------------------------------
| AUTHENTICATION
|--------------------------------------------------------------------------
*/

/**
 * Register a new user.
 *
 * POST /api/v1/auth/register
 */
export const registerUser = async (userData) => {
  const { data } = await API.post(
    "/auth/register",
    userData
  );

  return data;
};

/**
 * Login an existing user.
 *
 * POST /api/v1/auth/login
 */
export const loginUser = async (credentials) => {
  const { data } = await API.post(
    "/auth/login",
    credentials
  );

  return data;
};

/*
|--------------------------------------------------------------------------
| CURRENT USER
|--------------------------------------------------------------------------
*/

/**
 * Get the currently authenticated user.
 *
 * GET /api/v1/auth/me
 */
export const getCurrentUser = async () => {
  const { data } = await API.get(
    "/auth/me"
  );

  return data;
};

/*
|--------------------------------------------------------------------------
| PROFILE
|--------------------------------------------------------------------------
*/

/**
 * Update the authenticated user's profile.
 *
 * PUT /api/v1/auth/profile
 */
export const updateProfile = async (
  profileData
) => {
  const { data } = await API.put(
    "/auth/profile",
    profileData
  );

  return data;
};

/*
|--------------------------------------------------------------------------
| PASSWORD
|--------------------------------------------------------------------------
*/

/**
 * Change the authenticated user's password.
 *
 * PUT /api/v1/auth/change-password
 */
export const changePassword = async (
  passwords
) => {
  const { data } = await API.put(
    "/auth/change-password",
    passwords
  );

  return data;
};

/*
|--------------------------------------------------------------------------
| DEFAULT EXPORT
|--------------------------------------------------------------------------
*/

export default {
  registerUser,
  loginUser,
  getCurrentUser,
  updateProfile,
  changePassword,
};
