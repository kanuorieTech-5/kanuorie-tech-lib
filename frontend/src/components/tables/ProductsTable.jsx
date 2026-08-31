import DataTable from "./DataTable";
import { Button } from "../ui";

export default function ProductsTable({
  products = [],
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
      title: "Product",
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
      key: "stock",
      title: "Stock",
    },
    {
      key: "actions",
      title: "Actions",
      render: (product) => (
        <div className="flex gap-2">
          <Button size="sm" onClick={() => onEdit(product)}>
            Edit
          </Button>

          <Button
            size="sm"
            variant="destructive"
            onClick={() => onDelete(product._id)}
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
      data={products}
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
