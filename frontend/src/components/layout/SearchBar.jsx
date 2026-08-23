import { Search } from "lucide-react";

export default function SearchBar({
  value,
  onChange,
  placeholder = "Search...",
}) {
  return (
    <div className="relative w-full">
      <Search
        className="absolute left-3 top-3 text-gray-400"
        size={18}
      />

      <input
        type="text"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="w-full rounded-lg border py-2 pl-10 pr-4 outline-none focus:border-blue-500"
      />
    </div>
  );
}