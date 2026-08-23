import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  Bell,
  Send,
  Megaphone,
  RefreshCw,
  Trash2,
  Users,
  CheckCircle,
  Clock,
} from "lucide-react";

import {
  Card,
  Button,
  Loader,
} from "../../components/common";

import {
  getAdminNotifications,
  createAdminNotification,
  broadcastNotification,
  deleteAdminNotification,
} from "../../services";

const EMPTY_FORM = {
  recipient: "",
  title: "",
  message: "",
  type: "system",
};

export default function AdminNotifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const [form, setForm] = useState(EMPTY_FORM);

  const [showCreateForm, setShowCreateForm] =
    useState(false);

  const [showBroadcastForm, setShowBroadcastForm] =
    useState(false);

  /* ==========================================
     LOAD NOTIFICATIONS
  ========================================== */

  const loadNotifications = useCallback(async () => {
    try {
      setLoading(true);

      const response =
        await getAdminNotifications({
          page: 1,
          limit: 50,
        });

      const data =
        response?.data?.data ??
        response?.data ??
        response ??
        [];

      setNotifications(
        Array.isArray(data) ? data : []
      );
    } catch (error) {
      console.error(
        "Failed to load admin notifications:",
        error
      );

      toast.error(
        error?.response?.data?.message ||
          "Unable to load notifications."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadNotifications();
  }, [loadNotifications]);

  /* ==========================================
     FORM CHANGE
  ========================================== */

  const handleChange = ({ target }) => {
    const { name, value } = target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  /* ==========================================
     CREATE NOTIFICATION
  ========================================== */

  const handleCreate = async (event) => {
    event.preventDefault();

    if (
      !form.recipient.trim() ||
      !form.title.trim() ||
      !form.message.trim()
    ) {
      toast.error(
        "Recipient, title and message are required."
      );

      return;
    }

    try {
      setSubmitting(true);

      await createAdminNotification({
        recipient: form.recipient.trim(),
        title: form.title.trim(),
        message: form.message.trim(),
        type: form.type,
      });

      toast.success(
        "Notification sent successfully."
      );

      setForm(EMPTY_FORM);
      setShowCreateForm(false);

      await loadNotifications();
    } catch (error) {
      console.error(
        "Failed to create notification:",
        error
      );

      toast.error(
        error?.response?.data?.message ||
          "Failed to send notification."
      );
    } finally {
      setSubmitting(false);
    }
  };

  /* ==========================================
     BROADCAST
  ========================================== */

  const handleBroadcast = async (event) => {
    event.preventDefault();

    if (
      !form.title.trim() ||
      !form.message.trim()
    ) {
      toast.error(
        "Title and message are required."
      );

      return;
    }

    try {
      setSubmitting(true);

      const response =
        await broadcastNotification({
          title: form.title.trim(),
          message: form.message.trim(),
          type:
            form.type || "announcement",
        });

      const sent =
        response?.data?.sent ??
        response?.sent ??
        null;

      toast.success(
        sent !== null
          ? `Notification sent to ${sent} users.`
          : "Broadcast notification sent."
      );

      setForm(EMPTY_FORM);
      setShowBroadcastForm(false);

      await loadNotifications();
    } catch (error) {
      console.error(
        "Failed to broadcast notification:",
        error
      );

      toast.error(
        error?.response?.data?.message ||
          "Failed to broadcast notification."
      );
    } finally {
      setSubmitting(false);
    }
  };

  /* ==========================================
     DELETE
  ========================================== */

  const handleDelete = async (id) => {
    if (!id) return;

    const confirmed = window.confirm(
      "Are you sure you want to delete this notification?"
    );

    if (!confirmed) return;

    try {
      setDeletingId(id);

      await deleteAdminNotification(id);

      toast.success(
        "Notification deleted successfully."
      );

      setNotifications((prev) =>
        prev.filter(
          (notification) =>
            notification._id !== id
        )
      );
    } catch (error) {
      console.error(
        "Failed to delete notification:",
        error
      );

      toast.error(
        error?.response?.data?.message ||
          "Failed to delete notification."
      );
    } finally {
      setDeletingId(null);
    }
  };

  /* ==========================================
     LOADING
  ========================================== */

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Loader />
      </div>
    );
  }

  return (
    <div className="space-y-8">

      {/* ======================================
          HEADER
      ====================================== */}

      <div className="flex flex-col justify-between gap-5 md:flex-row md:items-center">

        <div>
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
              <Bell size={24} />
            </div>

            <div>
              <h1 className="text-2xl font-bold text-slate-900">
                Notifications
              </h1>

              <p className="text-sm text-slate-500">
                Manage and send platform notifications.
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">

          <Button
            variant="outline"
            onClick={loadNotifications}
          >
            <RefreshCw
              size={17}
              className="mr-2"
            />
            Refresh
          </Button>

          <Button
            onClick={() => {
              setShowBroadcastForm(false);
              setShowCreateForm(
                (current) => !current
              );
            }}
          >
            <Send
              size={17}
              className="mr-2"
            />
            Send Notification
          </Button>

          <Button
            variant="secondary"
            onClick={() => {
              setShowCreateForm(false);
              setShowBroadcastForm(
                (current) => !current
              );
            }}
          >
            <Megaphone
              size={17}
              className="mr-2"
            />
            Broadcast
          </Button>

        </div>
      </div>

      {/* ======================================
          CREATE NOTIFICATION
      ====================================== */}

      {showCreateForm && (
        <Card className="p-6">

          <div className="mb-6">
            <h2 className="text-lg font-bold text-slate-900">
              Send Notification
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Send a notification to a specific user.
            </p>
          </div>

          <form
            onSubmit={handleCreate}
            className="grid gap-5"
          >

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Recipient User ID
              </label>

              <input
                name="recipient"
                value={form.recipient}
                onChange={handleChange}
                placeholder="Enter user ID"
                className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <div className="grid gap-5 md:grid-cols-2">

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Title
                </label>

                <input
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  placeholder="Notification title"
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Type
                </label>

                <select
                  name="type"
                  value={form.type}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                >
                  <option value="system">
                    System
                  </option>

                  <option value="announcement">
                    Announcement
                  </option>

                  <option value="course">
                    Course
                  </option>

                  <option value="book">
                    Book
                  </option>

                  <option value="order">
                    Order
                  </option>
                </select>
              </div>

            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Message
              </label>

              <textarea
                name="message"
                value={form.message}
                onChange={handleChange}
                rows={5}
                placeholder="Write your notification..."
                className="w-full resize-none rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <div className="flex justify-end gap-3">

              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setShowCreateForm(false);
                  setForm(EMPTY_FORM);
                }}
              >
                Cancel
              </Button>

              <Button
                type="submit"
                loading={submitting}
                disabled={submitting}
              >
                <Send
                  size={17}
                  className="mr-2"
                />
                Send Notification
              </Button>

            </div>

          </form>
        </Card>
      )}

      {/* ======================================
          BROADCAST FORM
      ====================================== */}

      {showBroadcastForm && (
        <Card className="border-blue-200 bg-blue-50/50 p-6">

          <div className="mb-6">
            <h2 className="flex items-center gap-2 text-lg font-bold text-slate-900">
              <Megaphone
                size={20}
                className="text-blue-600"
              />

              Broadcast Notification
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Send this notification to every registered user.
            </p>
          </div>

          <form
            onSubmit={handleBroadcast}
            className="space-y-5"
          >

            <div className="grid gap-5 md:grid-cols-2">

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Title
                </label>

                <input
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  placeholder="Announcement title"
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Type
                </label>

                <select
                  name="type"
                  value={form.type}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                >
                  <option value="announcement">
                    Announcement
                  </option>

                  <option value="system">
                    System
                  </option>

                  <option value="course">
                    Course
                  </option>

                  <option value="book">
                    Book
                  </option>

                  <option value="order">
                    Order
                  </option>
                </select>
              </div>

            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Message
              </label>

              <textarea
                name="message"
                value={form.message}
                onChange={handleChange}
                rows={5}
                placeholder="Write your announcement..."
                className="w-full resize-none rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <div className="flex justify-end gap-3">

              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setShowBroadcastForm(false);
                  setForm(EMPTY_FORM);
                }}
              >
                Cancel
              </Button>

              <Button
                type="submit"
                loading={submitting}
                disabled={submitting}
              >
                <Megaphone
                  size={17}
                  className="mr-2"
                />
                Broadcast to All Users
              </Button>

            </div>

          </form>
        </Card>
      )}

      {/* ======================================
          NOTIFICATIONS LIST
      ====================================== */}

      <Card className="overflow-hidden">

        <div className="border-b border-slate-200 px-6 py-5">
          <div className="flex items-center justify-between">

            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Notification History
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Recent notifications sent through the platform.
              </p>
            </div>

            <div className="rounded-full bg-slate-100 px-3 py-1 text-sm font-semibold text-slate-600">
              {notifications.length}
            </div>

          </div>
        </div>

        {notifications.length === 0 ? (
          <div className="px-6 py-16 text-center">

            <Bell
              size={42}
              className="mx-auto text-slate-300"
            />

            <h3 className="mt-4 text-lg font-semibold text-slate-800">
              No notifications yet
            </h3>

            <p className="mt-2 text-sm text-slate-500">
              Notifications sent to users will appear here.
            </p>

          </div>
        ) : (
          <div className="divide-y divide-slate-100">

            {notifications.map((notification) => {

              const recipient =
                notification.recipient;

              const sender =
                notification.sender;

              return (
                <div
                  key={notification._id}
                  className="flex flex-col gap-4 px-6 py-5 transition hover:bg-slate-50 md:flex-row md:items-center md:justify-between"
                >

                  <div className="flex min-w-0 gap-4">

                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
                      <Bell size={20} />
                    </div>

                    <div className="min-w-0">

                      <div className="flex flex-wrap items-center gap-2">

                        <h3 className="font-semibold text-slate-900">
                          {notification.title ||
                            "Untitled Notification"}
                        </h3>

                        {notification.type && (
                          <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium capitalize text-slate-600">
                            {notification.type}
                          </span>
                        )}

                      </div>

                      <p className="mt-1 line-clamp-2 text-sm text-slate-600">
                        {notification.message}
                      </p>

                      <div className="mt-2 flex flex-wrap gap-4 text-xs text-slate-400">

                        <span className="flex items-center gap-1">
                          <Users size={13} />

                          {recipient?.name ||
                            recipient?.email ||
                            "User"}
                        </span>

                        <span className="flex items-center gap-1">
                          <Clock size={13} />

                          {notification.createdAt
                            ? new Date(
                                notification.createdAt
                              ).toLocaleString()
                            : "Unknown date"}
                        </span>

                        <span className="flex items-center gap-1">

                          {notification.isRead ? (
                            <>
                              <CheckCircle
                                size={13}
                              />
                              Read
                            </>
                          ) : (
                            "Unread"
                          )}

                        </span>

                      </div>

                      {sender && (
                        <p className="mt-1 text-xs text-slate-400">
                          Sent by{" "}
                          {sender.name ||
                            sender.email ||
                            "Admin"}
                        </p>
                      )}

                    </div>

                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      handleDelete(
                        notification._id
                      )
                    }
                    disabled={
                      deletingId ===
                      notification._id
                    }
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-red-500 transition hover:bg-red-50 hover:text-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                    title="Delete notification"
                  >
                    <Trash2 size={18} />
                  </button>

                </div>
              );
            })}

          </div>
        )}

      </Card>
    </div>
  );
}