export default function EmptyState({ title, description, action }) {
  return (
    <div className="py-20 text-center">
      <h3 className="text-xl font-semibold">{title}</h3>

      <p className="mt-2 text-gray-500">{description}</p>

      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
