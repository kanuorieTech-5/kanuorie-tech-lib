export default function DashboardSidebar({
  children,
}) {
  return (
    <aside
      className="
      h-full
      w-72
      border-r
      bg-white
      dark:bg-gray-900
    "
    >
      {children}
    </aside>
  );
}