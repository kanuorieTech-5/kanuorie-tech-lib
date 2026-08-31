import * as NotificationApi from "../api/notificationApi";

export const getNotifications = NotificationApi.getNotifications;

export const markNotificationAsRead = NotificationApi.markNotificationAsRead;

export const markAllNotificationsAsRead =
  NotificationApi.markAllNotificationsAsRead;

export const deleteNotification = NotificationApi.deleteNotification;

export const clearNotifications = NotificationApi.clearNotifications;

export default {
  getNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
  clearNotifications,
};
