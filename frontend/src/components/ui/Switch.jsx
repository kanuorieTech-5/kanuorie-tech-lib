import clsx from "clsx";

export default function Switch({
  checked,
  onChange,
  disabled = false,
  className = "",
}) {
  return (
    <button
      type="button"
      onClick={() =>
        !disabled &&
        onChange?.(!checked)
      }
      disabled={disabled}
      className={clsx(
        "relative inline-flex h-6 w-11 items-center rounded-full transition-colors",
        checked
          ? "bg-blue-600"
          : "bg-gray-300 dark:bg-slate-700",
        disabled &&
          "cursor-not-allowed opacity-60",
        className
      )}
    >
      <span
        className={clsx(
          "inline-block h-5 w-5 transform rounded-full bg-white transition-transform",
          checked
            ? "translate-x-5"
            : "translate-x-1"
        )}
      />
    </button>
  );
}