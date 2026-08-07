import DataTable from "./DataTable";
import { Badge } from "../ui";

export default function NotificationsTable({
  notifications = [],
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
      key: "title",
      title: "Title",
    },
    {
      key: "message",
      title: "Message",
    },
    {
      key: "isRead",
      title: "Status",
      render: (notification) => (
        <Badge
          variant={
            notification.isRead
              ? "success"
              : "warning"
          }
        >
          {notification.isRead
            ? "Read"
            : "Unread"}
        </Badge>
      ),
    },
    {
      key: "createdAt",
      title: "Date",
      render: (notification) =>
        new Date(
          notification.createdAt
        ).toLocaleDateString(),
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={notifications}
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