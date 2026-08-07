import { useState } from "react";
import {
  Button,
  SearchInput,
} from "../ui";

export default function SearchForm({
  onSearch,
}) {
  const [query, setQuery] =
    useState("");

  const submit = (e) => {
    e.preventDefault();

    onSearch?.(query);
  };

  return (
    <form
      onSubmit={submit}
      className="flex gap-3"
    >
      <SearchInput
        value={query}
        onChange={(e) =>
          setQuery(e.target.value)
        }
      />

      <Button type="submit">
        Search
      </Button>
    </form>
  );
}