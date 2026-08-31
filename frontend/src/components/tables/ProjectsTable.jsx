import DataTable from "./DataTable";
import { Button } from "../ui";

export default function ProjectsTable({
  projects = [],
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
      key: "title",
      title: "Project",
    },
    {
      key: "category",
      title: "Category",
    },
    {
      key: "status",
      title: "Status",
    },
    {
      key: "actions",
      title: "Actions",
      render: (project) => (
        <div className="flex gap-2">
          <Button size="sm" onClick={() => onEdit(project)}>
            Edit
          </Button>

          <Button
            size="sm"
            variant="destructive"
            onClick={() => onDelete(project._id)}
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
      data={projects}
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
