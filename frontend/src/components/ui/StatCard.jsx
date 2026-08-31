import Card from "./Card";

export default function StatCard({
  title,
  value,
  icon,
  color = "text-blue-600",
}) {
  return (
    <Card className="flex items-center justify-between">
      <div>
        <p className="text-sm text-gray-500">{title}</p>

        <h3 className="mt-2 text-3xl font-bold">{value}</h3>
      </div>

      <div className={color}>{icon}</div>
    </Card>
  );
}
