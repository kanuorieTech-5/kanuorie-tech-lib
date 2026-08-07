import DataTable from "./DataTable";

export default function ActivityTable({
  activities = [],
  loading,

  page,
  totalPages,

  search,
  onSearch,

  onPrevious,
  onNext,
}) {
  const columns = [
    {
      key: "user",
      title: "User",
      render: (activity) =>
        activity.user?.name,
    },
    {
      key: "action",
      title: "Action",
    },
    {
      key: "resource",
      title: "Resource",
    },
    {
      key: "createdAt",
      title: "Time",
      render: (activity) =>
        new Date(
          activity.createdAt
        ).toLocaleString(),
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={activities}
      loading={loading}
      page={page}
      totalPages={totalPages}
      search={search}
      onSearch={onSearch}
      onPrevious={onPrevious}
      onNext={onNext}
    />
  );
}