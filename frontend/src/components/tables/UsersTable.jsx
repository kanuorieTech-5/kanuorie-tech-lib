import DataTable from "./DataTable";
import { Badge, Button } from "../ui";

export default function UsersTable({
  users = [],
  loading,

  page,
  totalPages,

  search,
  onSearch,

  onPrevious,
  onNext,

  onEdit,
  onDelete,
}) {
  const columns = [
    {
      key: "name",
      title: "Name",
    },
    {
      key: "email",
      title: "Email",
    },
    {
      key: "role",
      title: "Role",
      render: (user) => <Badge>{user.role}</Badge>,
    },
    {
      key: "actions",
      title: "Actions",
      render: (user) => (
        <div className="flex gap-2">
          <Button size="sm" onClick={() => onEdit(user)}>
            Edit
          </Button>

          <Button
            size="sm"
            variant="destructive"
            onClick={() => onDelete(user._id)}
          >
            Delete
          </Button>
        </div>
      ),
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={users}
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
