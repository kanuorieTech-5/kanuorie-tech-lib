import { Card, Button } from "../components/common";
import { useNotification } from "../contexts";

export default function Notifications() {
  const {
    notifications = [],
    clearNotifications,
    markAsRead,
  } = useNotification();

  return (
    <section className="mx-auto max-w-5xl px-6 py-20">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between gap-4">
        <div>
          <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-blue-600">
            Account
          </p>

          <h1 className="text-4xl font-bold tracking-tight">Notifications</h1>
        </div>

        {notifications.length > 0 && (
          <Button variant="secondary" onClick={clearNotifications}>
            Clear All
          </Button>
        )}
      </div>

      {/* Notifications */}
      <div className="space-y-5">
        {notifications.length === 0 ? (
          <Card className="p-8 text-center">
            <h2 className="mb-2 text-xl font-semibold">No notifications yet</h2>

            <p className="text-gray-500">
              You&apos;re all caught up. New notifications will appear here.
            </p>
          </Card>
        ) : (
          notifications.map((notification) => {
            const notificationId = notification?._id || notification?.id;

            const isRead = Boolean(notification?.read);

            return (
              <Card
                key={notificationId}
                className={`transition ${
                  isRead ? "border-gray-200" : "border-blue-500 bg-blue-50/50"
                }`}
              >
                <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0">
                    {/* Unread indicator */}
                    <div className="mb-2 flex items-center gap-2">
                      {!isRead && (
                        <span
                          className="h-2.5 w-2.5 rounded-full bg-blue-600"
                          aria-label="Unread notification"
                        />
                      )}

                      <h2 className="font-bold text-gray-900">
                        {notification?.title || "Notification"}
                      </h2>
                    </div>

                    <p className="leading-7 text-gray-600">
                      {notification?.message || "You have a new notification."}
                    </p>
                  </div>

                  {!isRead && notificationId && (
                    <Button
                      size="sm"
                      onClick={() => markAsRead(notificationId)}
                    >
                      Mark as Read
                    </Button>
                  )}
                </div>
              </Card>
            );
          })
        )}
      </div>
    </section>
  );
}
