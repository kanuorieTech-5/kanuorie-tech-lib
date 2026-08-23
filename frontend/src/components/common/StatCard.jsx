import Card from "./Card";

export default function StatCard({
  title,
  value,
  icon: Icon,
  color = "bg-blue-600",
}) {
  return (
    <Card className="flex items-center justify-between">
      <div>
        <p className="text-sm text-blue-300">
          {title}
        </p>

        <h2 className="mt-2 text-3xl text-white font-bold">
          {value}
        </h2>
      </div>

      {Icon && (
        <div
          className={`${color} rounded-xl p-4 text-white`}
        >
          <Icon size={28} />
        </div>
      )}
    </Card>
  );
}