import { forwardRef, useState } from "react";
import clsx from "clsx";
import { Eye, EyeOff, Search, Loader2 } from "lucide-react";

const Input = forwardRef(
  (
    {
      label,
      error,
      helperText,

      leftIcon,
      rightIcon,

      loading = false,

      fullWidth = true,

      variant = "default",

      className = "",

      type = "text",

      required = false,

      disabled = false,

      ...props
    },
    ref
  ) => {
    const [showPassword, setShowPassword] =
      useState(false);

    const isPassword =
      type === "password";

    const inputType =
      isPassword && showPassword
        ? "text"
        : type;

    return (
      <div
        className={clsx(
          fullWidth && "w-full"
        )}
      >
        {label && (
          <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">
            {label}

            {required && (
              <span className="ml-1 text-red-500">
                *
              </span>
            )}
          </label>
        )}

        <div className="relative">
          {/* Left Icon */}

          {(leftIcon ||
            variant === "search") && (
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
              {variant === "search" ? (
                <Search size={18} />
              ) : (
                leftIcon
              )}
            </span>
          )}

          <input
            ref={ref}
            type={inputType}
            disabled={disabled || loading}
            className={clsx(
              "w-full rounded-xl border bg-white px-4 py-3 transition",

              "focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500/20",

              "dark:border-slate-700 dark:bg-slate-900 dark:text-white",

              {
                "pl-11":
                  leftIcon ||
                  variant === "search",

                "pr-11":
                  rightIcon ||
                  isPassword ||
                  loading,

                "border-red-500":
                  error,

                "cursor-not-allowed opacity-70":
                  disabled,
              },

              className
            )}
            {...props}
          />

          {/* Loading */}

          {loading && (
            <span className="absolute right-4 top-1/2 -translate-y-1/2">
              <Loader2
                size={18}
                className="animate-spin"
              />
            </span>
          )}

          {/* Password */}

          {isPassword &&
            !loading && (
              <button
                type="button"
                onClick={() =>
                  setShowPassword(
                    !showPassword
                  )
                }
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
              >
                {showPassword ? (
                  <EyeOff size={18} />
                ) : (
                  <Eye size={18} />
                )}
              </button>
            )}

          {/* Right Icon */}

          {!loading &&
            !isPassword &&
            rightIcon && (
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                {rightIcon}
              </span>
            )}
        </div>

        {helperText &&
          !error && (
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
);

Input.displayName = "Input";

export default Input;