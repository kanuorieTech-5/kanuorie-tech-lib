import clsx from "clsx";

export default function Label({
  children,
  htmlFor,
  required = false,
  className = "",
}) {
  return (
    <label
      htmlFor={htmlFor}
      className={clsx(
        "mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200",
        className,
      )}
    >
      {children}

      {required && <span className="ml-1 text-red-500">*</span>}
    </label>
  );
}
