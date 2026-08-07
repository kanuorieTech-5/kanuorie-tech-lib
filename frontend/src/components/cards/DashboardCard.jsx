import { Card } from "../ui";

export default function DashboardCard({
  title,
  value,
  icon,
  color = "text-primary",
  footer,
}) {
  return (
    <Card className="p-6 transition-all duration-300 hover:shadow-lg">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500">
            {title}
          </p>

          <h2 className="mt-2 text-3xl font-bold">
            {value}
          </h2>
        </div>

        <div className={`text-5xl ${color}`}>
          {icon}
        </div>
      </div>

      {footer && (
        <div className="mt-6 border-t pt-4 text-sm text-gray-500">
          {footer}
        </div>
      )}
    </Card>
  );
}