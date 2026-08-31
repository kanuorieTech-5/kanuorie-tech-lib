export default function Table({
  columns = [],
  data = [],
  loading = false,
  emptyMessage = "No records found.",
}) {
  if (loading) {
    return (
      <div className="rounded-xl border bg-white p-10 text-center">
        Loading...
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border bg-white shadow-sm">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-slate-100">
          <tr>
            {columns.map((column) => (
              <th
                key={column.accessor}
                className="px-6 py-4 text-left text-sm font-semibold text-slate-700"
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-100">
          {data.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                className="py-10 text-center text-gray-500"
              >
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((row, index) => (
              <tr key={row._id || row.id || index} className="hover:bg-gray-50">
                {columns.map((column) => (
                  <td key={column.accessor} className="px-6 py-4">
                    {column.render ? column.render(row) : row[column.accessor]}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
