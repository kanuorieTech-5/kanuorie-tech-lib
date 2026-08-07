import DataTable from "./DataTable";
import { Button } from "../ui";

export default function CoursesTable({
  courses = [],
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
      title: "Course",
    },
    {
      key: "category",
      title: "Category",
    },
    {
      key: "level",
      title: "Level",
    },
    {
      key: "price",
      title: "Price",
    },
    {
      key: "actions",
      title: "Actions",
      render: (course) => (
        <div className="flex gap-2">
          <Button
            size="sm"
            onClick={() => onEdit(course)}
          >
            Edit
          </Button>

          <Button
            size="sm"
            variant="destructive"
            onClick={() => onDelete(course._id)}
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
      data={courses}
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