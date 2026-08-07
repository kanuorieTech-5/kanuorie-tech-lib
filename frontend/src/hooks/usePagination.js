import { useMemo, useState } from "react";

export default function usePagination(items = [], perPage = 10) {
  const [page, setPage] = useState(1);

  const totalPages = Math.ceil(items.length / perPage);

  const currentData = useMemo(() => {
    const start = (page - 1) * perPage;

    return items.slice(start, start + perPage);
  }, [items, page, perPage]);

  return {
    page,
    setPage,
    totalPages,
    currentData,
  };
}