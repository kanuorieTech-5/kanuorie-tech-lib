import { createContext, useState, useEffect } from "react";
import socket from "../socket";
import API from "../api/axios";
import toast from "react-hot-toast";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(undefined); // 👈 undefined = loading
  const [loadingAuth, setLoadingAuth] = useState(true);

  const [settings, setSettings] = useState({
    darkMode: false,
    notifications: true,
  });

  const [notifications, setNotifications] = useState([]);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  /* ========================
     HYDRATE + VERIFY TOKEN
  ======================== */
  useEffect(() => {
    const initAuth = async () => {
      const savedToken = localStorage.getItem("techlib-token");
      const savedSettings = localStorage.getItem("techlib-settings");

      if (savedSettings) {
        setSettings(JSON.parse(savedSettings));
      }

      if (!savedToken) {
        setToken(null);
        setLoadingAuth(false);
        return;
      }

      try {
        // 🔐 VERIFY TOKEN WITH BACKEND
        const res = await API.get("/auth/me", {
          headers: { Authorization: `Bearer ${savedToken}` },
        });

        setUser(res.data.user);
        setToken(savedToken);
      } catch (err) {
        console.warn("Token invalid or expired");
        localStorage.removeItem("techlib-token");
        localStorage.removeItem("techlib-user");

        setUser(null);
        setToken(null);
      } finally {
        setLoadingAuth(false);
      }
    };

    initAuth();
  }, []);

  /* ========================
     SAVE SETTINGS
  ======================== */
  useEffect(() => {
    localStorage.setItem("techlib-settings", JSON.stringify(settings));
  }, [settings]);

  /* ========================
     SOCKET CONNECT (AUTH SAFE)
  ======================== */
  useEffect(() => {
    if (!user?.id || !token) return;

    socket.auth = { token }; // 🔐 attach token
    socket.connect();

    socket.emit("join", user.id);

    return () => {
      socket.disconnect();
    };
  }, [user?.id, token]);

  /* ========================
     FETCH NOTIFICATIONS
  ======================== */
  useEffect(() => {
    if (!user?.id || !token) return;

    const fetchNotifications = async () => {
      try {
        const res = await API.get(`/notifications/${user.id}`);
        setNotifications(res.data);
      } catch (err) {
        console.error("Failed to fetch notifications", err);
      }
    };

    fetchNotifications();
  }, [user?.id, token]);

  /* ========================
     SOCKET LISTENER
  ======================== */
  useEffect(() => {
    const handler = (notification) => {
      setNotifications((prev) => {
        const exists = prev.find((n) => n.id === notification.id);
        if (exists) return prev;
        return [notification, ...prev];
      });

      // 🔔 Toast handling
      if (notification.type === "admin") {
        toast("📢 Admin Message", {
          description: notification.message,
        });
      } else if (notification.type === "course") {
        toast.success("🎓 New Course Assigned!");
      } else {
        toast.success(notification.title || "Notification", {
          description: notification.message,
        });
      }
    };

    socket.on("notification", handler);
    return () => socket.off("notification", handler);
  }, []);

  /* ========================
     LOGIN
  ======================== */
  const login = (data) => {
    localStorage.setItem("techlib-token", data.token);
    localStorage.setItem("techlib-user", JSON.stringify(data.user));

    setUser(data.user);
    setToken(data.token);
  };

  /* ========================
     LOGOUT
  ======================== */
  const logout = () => {
    setUser(null);
    setToken(null);
    setNotifications([]);

    localStorage.removeItem("techlib-user");
    localStorage.removeItem("techlib-token");

    socket.disconnect();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loadingAuth,
        login,
        logout,
        settings,
        setSettings,
        notifications,
        setNotifications,
        unreadCount,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}