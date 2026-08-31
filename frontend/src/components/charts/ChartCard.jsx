export default function ChartCard({ title, subtitle, children }) {
  return (
    <div className="rounded-xl border bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <div className="mb-6">
        <h3 className="text-lg font-semibold">{title}</h3>

        {subtitle && <p className="mt-1 text-sm text-gray-500">{subtitle}</p>}
      </div>

      {children}
    </div>
  );
}
