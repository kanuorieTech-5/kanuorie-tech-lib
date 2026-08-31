export default function StatsGrid({ children }) {
  return (
    <div
      className="
      grid
      gap-6
      sm:grid-cols-2
      xl:grid-cols-4
    "
    >
      {children}
    </div>
  );
}
