import DataTable from "./DataTable";
import { Button } from "../ui";

export default function BlogTable({
  posts = [],
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
      title: "Title",
    },
    {
      key: "category",
      title: "Category",
    },
    {
      key: "author",
      title: "Author",
    },
    {
      key: "createdAt",
      title: "Published",
      render: (post) =>
        new Date(post.createdAt).toLocaleDateString(),
    },
    {
      key: "actions",
      title: "Actions",
      render: (post) => (
        <div className="flex gap-2">
          <Button size="sm" onClick={() => onEdit(post)}>
            Edit
          </Button>

          <Button
            size="sm"
            variant="destructive"
            onClick={() => onDelete(post._id)}
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
      data={posts}
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