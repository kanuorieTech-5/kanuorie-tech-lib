import { Card } from "../common";

export default function StatisticCard({
  title,
  value,
  percentage,
  positive = true,
}) {
  return (
    <Card className="p-6">
      <p className="text-sm text-gray-500">{title}</p>

      <h2 className="mt-3 text-4xl font-bold">{value}</h2>

      <div
        className={`mt-3 inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ${
          positive ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"
        }`}
      >
        {positive ? "▲" : "▼"} {percentage}
      </div>
    </Card>
  );
}
