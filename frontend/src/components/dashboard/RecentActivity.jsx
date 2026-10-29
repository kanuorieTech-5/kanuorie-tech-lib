import { Card } from "../common";

export default function RecentActivity({ activities = [] }) {
  return (
    <Card>
      <h3 className="mb-5 text-lg font-semibold text-gray-900 dark:text-slate-300">
        Recent Activity
      </h3>

      <div className="space-y-4">
        {activities.map((activity) => (
          <div key={activity.id} className="border-b pb-3 last:border-none">
            <p className="font-medium">{activity.title}</p>

            <p className="text-sm text-gray-500 dark:text-slate-400">
              {activity.time}
            </p>
          </div>
        ))}
      </div>
    </Card>
  );
}
