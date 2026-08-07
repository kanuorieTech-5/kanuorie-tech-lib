import { Button } from "../ui";
import DataTable from "./DataTable";

export default function BooksTable({
  books,
  loading,

  page,
  totalPages,

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
      key: "author",
      title: "Author",
    },

    {
      key: "category",
      title: "Category",
    },

    {
      key: "price",
      title: "Price",
    },

    {
      key: "actions",

      title: "Actions",

      render: (book) => (

        <div className="flex gap-2">

          <Button
            size="sm"
            onClick={() => onEdit(book)}
          >
            Edit
          </Button>

          <Button
            variant="destructive"
            size="sm"
            onClick={() =>
              onDelete(book._id)
            }
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
      data={books}
      loading={loading}

      page={page}
      totalPages={totalPages}

      onPrevious={onPrevious}
      onNext={onNext}
    />
  );
}