export default function Pagination({
  page,
  totalPages,
  onChange,
}) {
  return (
    <div className="flex items-center justify-center gap-3">
      <button
        disabled={page === 1}
        onClick={() =>
          onChange(page - 1)
        }
      >
        Previous
      </button>

      <span>
        {page} / {totalPages}
      </span>

      <button
        disabled={page === totalPages}
        onClick={() =>
          onChange(page + 1)
        }
      >
        Next
      </button>
    </div>
  );
}