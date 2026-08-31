import clsx from "clsx";

export default function Checkbox({ label, className = "", ...props }) {
  return (
    <label
      className={clsx("flex cursor-pointer items-center gap-3", className)}
    >
      <input
        type="checkbox"
        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
        {...props}
      />

      {label && (
        <span className="text-sm text-slate-700 dark:text-slate-300">
          {label}
        </span>
      )}
    </label>
  );
}
