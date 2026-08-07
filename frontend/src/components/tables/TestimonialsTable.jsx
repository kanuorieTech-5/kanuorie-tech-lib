import DataTable from "./DataTable";
import { Button } from "../ui";

export default function TestimonialsTable({
  testimonials = [],
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
      title: "Customer",
    },
    {
      key: "company",
      title: "Company",
    },
    {
      key: "rating",
      title: "Rating",
    },
    {
      key: "actions",
      title: "Actions",
      render: (item) => (
        <div className="flex gap-2">
          <Button size="sm" onClick={() => onEdit(item)}>
            Edit
          </Button>

          <Button
            size="sm"
            variant="destructive"
            onClick={() => onDelete(item._id)}
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
      data={testimonials}
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