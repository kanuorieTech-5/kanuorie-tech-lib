import * as AuthApi from "../api/authApi";
export const login = AuthApi.loginUser;
export const register = AuthApi.registerUser;
export const logout = AuthApi.logoutUser;
export const refreshToken = AuthApi.refreshToken;
export const getCurrentUser = AuthApi.getCurrentUser;
export const verifyEmail = AuthApi.verifyEmail;
export const resendVerificationEmail = AuthApi.resendVerificationEmail;
export const forgotPassword = AuthApi.forgotPassword;
export const resetPassword = AuthApi.resetPassword;
export const changePassword = AuthApi.changePassword;

export default {
  login,
  register,
  logout,
  refreshToken,
  getCurrentUser,
  verifyEmail,
  resendVerificationEmail,
  forgotPassword,
  resetPassword,
  changePassword,
};
