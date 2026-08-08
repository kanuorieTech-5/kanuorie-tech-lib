import { Card, Button,} from "../components/common";

import { useNotification, } from "../contexts";

export default function Notifications() {

  const {

    notifications,

    clearNotifications,

    markAsRead,

  } = useNotifications();

  return (

    <section className="mx-auto max-w-5xl px-6 py-20">

      <div className="mb-8 flex items-center justify-between">

        <h1 className="text-4xl font-bold">

          Notifications

        </h1>

        <Button
          variant="secondary"
          onClick={clearNotifications}
        >
          Clear All
        </Button>

      </div>

      <div className="space-y-5">

        {notifications.length === 0 && (

          <Card>

            No notifications yet.

          </Card>

        )}

        {notifications.map(notification => (

          <Card
            key={notification._id}
            className={
              notification.read
                ? ""
                : "border-blue-600"
            }
          >

            <div className="flex justify-between">

              <div>

                <h2 className="font-bold">

                  {notification.title}

                </h2>

                <p className="text-gray-600">

                  {notification.message}

                </p>

              </div>

              {!notification.read && (

                <Button
                  size="sm"
                  onClick={() =>
                    markAsRead(notification._id)
                  }
                >
                  Mark Read
                </Button>

              )}

            </div>

          </Card>

        ))}

      </div>

    </section>

  );

}