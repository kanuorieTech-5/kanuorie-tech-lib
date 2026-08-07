export default function DashboardTopbar({
  children,
}) {
  return (
    <header
      className="
      flex
      items-center
      justify-between
      border-b
      bg-white
      px-6
      py-4
      dark:bg-gray-900
    "
    >
      {children}
    </header>
  );
}