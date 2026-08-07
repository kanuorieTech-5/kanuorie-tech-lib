import DataTable from "./DataTable";
import { Button } from "../ui";

export default function TeamTable({
  members = [],
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
      key: "position",
      title: "Position",
    },
    {
      key: "email",
      title: "Email",
    },
    {
      key: "actions",
      title: "Actions",
      render: (member) => (
        <div className="flex gap-2">
          <Button size="sm" onClick={() => onEdit(member)}>
            Edit
          </Button>

          <Button
            size="sm"
            variant="destructive"
            onClick={() => onDelete(member._id)}
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
      data={members}
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