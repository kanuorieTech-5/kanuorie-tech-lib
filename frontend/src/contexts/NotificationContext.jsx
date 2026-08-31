import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  getNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
  clearNotifications as clearNotificationsService,
} from "../services/notification.service";

import { useAuth } from "./AuthContext";
import { useSocket } from "./SocketContext";

const NotificationContext = createContext(null);

export const useNotification = () => useContext(NotificationContext);

export function NotificationProvider({ children }) {
  const { isAuthenticated } = useAuth();
  const socket = useSocket();

  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);

  /* ==========================================
      FETCH NOTIFICATIONS
  ========================================== */

  const fetchNotifications = useCallback(async () => {
    if (!isAuthenticated) {
      setNotifications([]);
      return;
    }

    try {
      setLoading(true);

      const response = await getNotifications();

      const data = response?.notifications || response?.data || response || [];

      setNotifications(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  /* ==========================================
      SOCKET LISTENER
  ========================================== */

  useEffect(() => {
    if (!socket) return;

    const handleNotification = (notification) => {
      setNotifications((prev) => [notification, ...prev]);
    };

    socket.on("notification", handleNotification);

    return () => {
      socket.off("notification", handleNotification);
    };
  }, [socket]);

  /* ==========================================
      INITIAL LOAD
  ========================================== */

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  /* ==========================================
      MARK ONE AS READ
  ========================================== */

  const markAsRead = async (id) => {
    try {
      await markNotificationAsRead(id);

      setNotifications((prev) =>
        prev.map((notification) =>
          notification._id === id || notification.id === id
            ? {
                ...notification,
                isRead: true,
              }
            : notification,
        ),
      );
    } catch (error) {
      console.error(error);
    }
  };

  /* ==========================================
      MARK ALL AS READ
  ========================================== */

  const markAllAsRead = async () => {
    try {
      await markAllNotificationsAsRead();

      setNotifications((prev) =>
        prev.map((notification) => ({
          ...notification,
          isRead: true,
        })),
      );
    } catch (error) {
      console.error(error);
    }
  };

  /* ==========================================
      DELETE ONE
  ========================================== */

  const removeNotification = async (id) => {
    try {
      await deleteNotification(id);

      setNotifications((prev) =>
        prev.filter(
          (notification) => notification._id !== id && notification.id !== id,
        ),
      );
    } catch (error) {
      console.error(error);
    }
  };

  /* ==========================================
      CLEAR ALL
  ========================================== */

  const clearAllNotifications = async () => {
    try {
      await clearNotificationsService();

      setNotifications([]);
    } catch (error) {
      console.error(error);
    }
  };

  /* ==========================================
      UNREAD COUNT
  ========================================== */

  const unreadCount = useMemo(
    () => notifications.filter((notification) => !notification.isRead).length,
    [notifications],
  );

  const value = useMemo(
    () => ({
      notifications,
      unreadCount,
      loading,

      fetchNotifications,

      markAsRead,
      markAllAsRead,

      deleteNotification: removeNotification,

      clearNotifications: clearAllNotifications,
    }),
    [notifications, unreadCount, loading, fetchNotifications],
  );

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}

export default NotificationContext;
