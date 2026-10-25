import { Card } from "../common";

export default function StatsCard({
  title,
  value,
  icon,
  color = "bg-blue-600",
  change,
}) {
  return (
    <Card className="flex items-center justify-between">
      <div>
        <p className="text-sm text-gray-500 dark:text-slate-400">{title}</p>

        <h3 className="mt-2 text-3xl font-bold">{value}</h3>

        {change && <p className="mt-2 text-sm text-green-600">{change}</p>}
      </div>

      <div className={`rounded-xl p-4 text-white ${color}`}>{icon}</div>
    </Card>
  );
}


