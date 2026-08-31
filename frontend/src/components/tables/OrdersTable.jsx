import DataTable from "./DataTable";
import { Badge } from "../ui";

export default function OrdersTable({
  orders = [],
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
      key: "_id",
      title: "Order ID",
    },
    {
      key: "customer",
      title: "Customer",
      render: (order) => order.user?.name,
    },
    {
      key: "amount",
      title: "Amount",
    },
    {
      key: "status",
      title: "Status",
      render: (order) => <Badge>{order.status}</Badge>,
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={orders}
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
