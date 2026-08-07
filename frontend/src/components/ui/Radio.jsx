import clsx from "clsx";

export default function Radio({
  label,
  name,
  value,
  checked,
  onChange,
  disabled = false,
  className = "",
}) {
  return (
    <label
      className={clsx(
        "flex cursor-pointer items-center gap-3",
        disabled &&
          "cursor-not-allowed opacity-60",
        className
      )}
    >
      <input
        type="radio"
        name={name}
        value={value}
        checked={checked}
        onChange={onChange}
        disabled={disabled}
        className="h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500"
      />

      {label && (
        <span className="text-sm text-slate-700 dark:text-slate-300">
          {label}
        </span>
      )}
    </label>
  );
}