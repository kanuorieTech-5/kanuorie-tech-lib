import clsx from "clsx";

export default function Select({
  label,
  error,
  helperText,
  required = false,
  disabled = false,
  options = [],
  className = "",
  ...props
}) {
  return (
    <div className="w-full">
      {label && (
        <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">
          {label}

          {required && (
            <span className="ml-1 text-red-500">*</span>
          )}
        </label>
      )}

      <select
        disabled={disabled}
        className={clsx(
          "w-full rounded-xl border border-gray-300 bg-white px-4 py-3 transition",

          "focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500/20",

          "dark:border-slate-700 dark:bg-slate-900 dark:text-white",

          {
            "border-red-500": error,
          },

          className
        )}
        {...props}
      >
        {options.map((option) => (
          <option
            key={option.value}
            value={option.value}
          >
            {option.label}
          </option>
        ))}
      </select>

      {helperText && !error && (
        <p className="mt-2 text-sm text-gray-500">
          {helperText}
        </p>
      )}

      {error && (
        <p className="mt-2 text-sm text-red-500">
          {error}
        </p>
      )}
    </div>
  );
}