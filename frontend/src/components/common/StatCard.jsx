import Card from "./Card";

export default function StatCard({ title, description, icon: Icon }) {
  return (
    <Card className="flex items-center justify-between">
      <div>
        {Icon && (
          <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400">
            <Icon size={28} />
          </div>
        )}

        <p className="text-white py-4">{title}</p>
      </div>
      <h2 className="mt-2 text-sm text-white font-bold">{description}</h2>
    </Card>
  );
}
