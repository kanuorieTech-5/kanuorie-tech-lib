import { createContext, useContext, useEffect, useMemo, useState, useCallback,} from "react";
import * as authApi from "../api/authApi";
export const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

const TOKEN_KEY = "kanuorietech_token";
const USER_KEY = "kanuorietech_user";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(USER_KEY));
    } catch {
      return null;
    }
  });

  const [loadingAuth, setLoadingAuth] = useState(true);
  const [loading, setLoading] = useState(false);

  /* ======================================
      LOAD CURRENT USER
  ====================================== */

  const loadUser = async () => {
    try {
      const res = await authApi.getCurrentUser();

      const currentUser =
        res.data || res.user || res;

      setUser(currentUser);

      localStorage.setItem(
        USER_KEY,
        JSON.stringify(currentUser)
      );
    } catch (error) {
      logout(false);
    } finally {
      setLoadingAuth(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY);

    if (!token) {
      setLoadingAuth(false);
      return;
    }

    loadUser();
  }, []);

  /* ======================================
      LOGIN
  ====================================== */

  const login = useCallback(async (credentials) => {
    setLoading(true);

    try {
      const res = await authApi.loginUser(credentials);

      const token =
        res.token ||
        res.data?.token;

      const currentUser =
        res.user ||
        res.data?.user;

      localStorage.setItem(
        TOKEN_KEY,
        token
      );

      localStorage.setItem(
        USER_KEY,
        JSON.stringify(currentUser)
      );

      setUser(currentUser);

      return res;
    } finally {
      setLoading(false);
    }
  }, []);

  /* ======================================
      REGISTER
  ====================================== */

  const register = useCallback(async (payload) => {
    setLoading(true);

    try {
      const res = await authApi.registerUser(payload);

      return res;
    } finally {
      setLoading(false);
    }
  }, []);

  /* ======================================
      LOGOUT
  ====================================== */

  const logout = useCallback(async (callAPI = true) => {
    try {
      if (callAPI) {
        await authApi.logoutUser();
      }
    } catch {}

    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);

    setUser(null);
  }, []);

  /* ======================================
      UPDATE PROFILE
  ====================================== */

  const updateProfile = async (payload) => {
    const res =
      await authApi.updateProfile(payload);

    const updated =
      res.user ||
      res.data?.user ||
      res.data;

    setUser(updated);

    localStorage.setItem(
      USER_KEY,
      JSON.stringify(updated)
    );

    return updated;
  };

  /* ======================================
      AVATAR
  ====================================== */

  const uploadAvatar = async (file) => {
    return authApi.uploadAvatar(file);
  };

  /* ======================================
      HELPERS
  ====================================== */

  const isAuthenticated = !!user;

  const isAdmin =
    user?.role === "admin";

  const value = useMemo(
    () => ({
      user,
      setUser,

      loading,
      loadingAuth,

      login,
      logout,
      register,

      loadUser,

      updateProfile,
      uploadAvatar,

      isAuthenticated,
      isAdmin,
    }),
    [
      user,
      loading,
      loadingAuth,
      isAuthenticated,
      isAdmin,
    ]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}