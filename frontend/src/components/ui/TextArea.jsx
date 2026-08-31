import { forwardRef } from "react";
import clsx from "clsx";

const TextArea = forwardRef(
  (
    {
      label,
      error,
      helperText,
      required = false,
      disabled = false,
      rows = 5,
      className = "",
      fullWidth = true,
      ...props
    },
    ref,
  ) => {
    return (
      <div className={clsx(fullWidth && "w-full")}>
        {label && (
          <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">
            {label}

            {required && <span className="ml-1 text-red-500">*</span>}
          </label>
        )}

        <textarea
          ref={ref}
          rows={rows}
          disabled={disabled}
          className={clsx(
            "w-full rounded-xl border border-gray-300 bg-white px-4 py-3 transition",

            "focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500/20",

            "dark:border-slate-700 dark:bg-slate-900 dark:text-white",

            {
              "border-red-500": error,
              "cursor-not-allowed opacity-70": disabled,
            },

            className,
          )}
          {...props}
        />

        {helperText && !error && (
          <p className="mt-2 text-sm text-gray-500">{helperText}</p>
        )}

        {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
      </div>
    );
  },
);

TextArea.displayName = "TextArea";

export default TextArea;
