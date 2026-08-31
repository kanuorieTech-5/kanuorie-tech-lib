import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  useCallback,
} from "react";

import * as authApi from "../api/authApi";
import * as userApi from "../api/userApi";

export const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
};

const TOKEN_KEY = "kanuorietech_token";
const USER_KEY = "kanuorietech_user";

export function AuthProvider({ children }) {
  /* ==========================================
     USER STATE
  ========================================== */

  const [user, setUser] = useState(() => {
    try {
      const storedUser = localStorage.getItem(USER_KEY);

      return storedUser ? JSON.parse(storedUser) : null;
    } catch {
      return null;
    }
  });

  /* ==========================================
     LOADING STATE
  ========================================== */

  const [loadingAuth, setLoadingAuth] = useState(true);

  const [loading, setLoading] = useState(false);

  /* ==========================================
     LOGOUT
  ========================================== */

  const logout = useCallback(async (callAPI = true) => {
    try {
      if (callAPI) {
        await authApi.logoutUser();
      }
    } catch (error) {
      console.warn("Logout API request failed:", error);
    } finally {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);

      setUser(null);
    }
  }, []);

  /* ==========================================
     LOAD CURRENT USER
  ========================================== */

  const loadUser = useCallback(async () => {
    try {
      const token = localStorage.getItem(TOKEN_KEY);

      if (!token) {
        setUser(null);
        return null;
      }

      const res = await authApi.getCurrentUser();

      const currentUser = res?.data?.user || res?.data || res?.user || res;

      if (!currentUser) {
        throw new Error("Unable to determine current user.");
      }

      setUser(currentUser);

      localStorage.setItem(USER_KEY, JSON.stringify(currentUser));

      return currentUser;
    } catch (error) {
      console.error("Failed to restore authentication:", error);

      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);

      setUser(null);

      return null;
    } finally {
      setLoadingAuth(false);
    }
  }, []);

  /* ==========================================
     RESTORE AUTHENTICATION
  ========================================== */

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  /* ==========================================
     LOGIN
  ========================================== */

  const login = useCallback(async (credentials) => {
    setLoading(true);

    try {
      const res = await authApi.loginUser(credentials);

      const token = res?.token || res?.data?.token;

      const currentUser = res?.user || res?.data?.user || null;

      if (!token || !currentUser) {
        throw new Error("Invalid authentication response.");
      }

      localStorage.setItem(TOKEN_KEY, token);

      localStorage.setItem(USER_KEY, JSON.stringify(currentUser));

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

  /* ==========================================
     UPDATE PROFILE
  ========================================== */

  const updateProfile = useCallback(async (payload) => {
    const res = await userApi.updateProfile(payload);

    const updatedUser = res?.data || res?.user || res;

    if (!updatedUser) {
      throw new Error("Profile update returned no user data.");
    }

    setUser(updatedUser);

    localStorage.setItem(USER_KEY, JSON.stringify(updatedUser));

    return updatedUser;
  }, []);
  /* ==========================================
     AVATAR
  ========================================== */
  const uploadAvatar = useCallback(async (formData) => {
    const res = await userApi.uploadAvatar(formData);

    const avatar = res?.data?.avatar || res?.avatar;

    if (!avatar) {
      throw new Error("Avatar URL was not returned by the server.");
    }

    setUser((currentUser) => {
      if (!currentUser) return currentUser;

      const updatedUser = {
        ...currentUser,
        avatar,
      };

      localStorage.setItem(USER_KEY, JSON.stringify(updatedUser));

      return updatedUser;
    });

    return res;
  }, []);

  /* ==========================================
     AUTH HELPERS
  ========================================== */

  const isAuthenticated = Boolean(user);

  const isAdmin =
    String(user?.role || "")
      .trim()
      .toLowerCase() === "admin";

  /* ==========================================
     CONTEXT VALUE
  ========================================== */

  const value = useMemo(
    () => ({
      user,
      setUser,

      loading,
      loadingAuth,

      isAuthenticated,
      isAdmin,

      login,
      logout,
      register,
      loadUser,

      updateProfile,
      uploadAvatar,
    }),
    [
      user,
      loading,
      loadingAuth,
      isAuthenticated,
      isAdmin,
      login,
      logout,
      register,
      loadUser,
      updateProfile,
      uploadAvatar,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
