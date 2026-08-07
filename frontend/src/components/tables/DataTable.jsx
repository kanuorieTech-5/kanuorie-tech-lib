import {
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import { Button } from "../ui";

export default function DataTable({
  columns = [],
  data = [],
  loading = false,

  page = 1,
  totalPages = 1,

  onPrevious,
  onNext,

  emptyMessage = "No records found.",
}) {
  return (
    <div className="overflow-hidden rounded-xl border bg-white shadow-sm dark:bg-gray-900">
      <div className="overflow-x-auto">

        <table className="min-w-full">

          <thead className="bg-gray-100 dark:bg-gray-800">

            <tr>

              {columns.map((column) => (
                <th
                  key={column.key}
                  className="px-6 py-4 text-left text-sm font-semibold"
                >
                  {column.title}
                </th>
              ))}

            </tr>

          </thead>

          <tbody>

            {loading && (

              <tr>

                <td
                  colSpan={columns.length}
                  className="py-12 text-center"
                >
                  Loading...
                </td>

              </tr>

            )}

            {!loading &&
              data.length === 0 && (

                <tr>

                  <td
                    colSpan={columns.length}
                    className="py-12 text-center text-gray-500"
                  >
                    {emptyMessage}
                  </td>

                </tr>

              )}

            {!loading &&
              data.map((row) => (

                <tr
                  key={row._id}
                  className="border-t hover:bg-gray-50 dark:hover:bg-gray-800"
                >

                  {columns.map((column) => (

                    <td
                      key={column.key}
                      className="px-6 py-4"
                    >
                      {column.render
                        ? column.render(row)
                        : row[column.key]}
                    </td>

                  ))}

                </tr>

              ))}

          </tbody>

        </table>

      </div>

      <div className="flex items-center justify-between border-t p-4">

        <Button
          variant="outline"
          size="sm"
          disabled={page === 1}
          onClick={onPrevious}
        >
          <ChevronLeft size={18} />

          Previous
        </Button>

        <span>
          Page {page} of {totalPages}
        </span>

        <Button
          variant="outline"
          size="sm"
          disabled={page === totalPages}
          onClick={onNext}
        >
          Next

          <ChevronRight size={18} />
        </Button>

      </div>
    </div>
  );
}